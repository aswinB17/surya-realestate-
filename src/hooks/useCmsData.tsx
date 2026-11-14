"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { CmsData } from "@/types/cms";
import { initialCmsData } from "@/lib/cms/defaultData";

interface CmsContextType {
  data: CmsData;
  isLoading: boolean;
  error: string | null;
  version: string | null;
  refresh: () => Promise<void>;
  updateOptimistic: (updater: (prev: CmsData) => CmsData) => void;
}

const CmsContext = createContext<CmsContextType>({
  data: initialCmsData,
  isLoading: false,
  error: null,
  version: null,
  refresh: async () => {},
  updateOptimistic: () => {},
});

export const CMS_BROADCAST_CHANNEL = "surya_cms_channel";
export const CMS_STORAGE_SYNC_KEY = "surya_cms_last_sync";

export function broadcastCmsUpdate(version?: string) {
  try {
    if (typeof window !== "undefined") {
      const payload = {
        type: "CMS_UPDATED",
        version: version || Date.now().toString(),
        timestamp: Date.now(),
      };
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel(CMS_BROADCAST_CHANNEL);
        bc.postMessage(payload);
        bc.close();
      }
      localStorage.setItem(CMS_STORAGE_SYNC_KEY, payload.timestamp.toString());
    }
  } catch (e) {
    // Ignore storage/broadcast errors
  }
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(initialCmsData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  const pathname = usePathname();
  const currentVersionRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  // Core fetcher: silent=true avoids triggering jarring loading spinners during background sync
  const fetchContent = useCallback(async (silent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!silent) {
      setIsLoading(true);
    }

    try {
      const res = await fetch("/api/content", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.success && json.data) {
        setData(json.data);
        const newVer = json.version || json.data.lastUpdated || Date.now().toString();
        currentVersionRef.current = newVer;
        setVersion(newVer);
        setError(null);
      }
    } catch (err: any) {
      console.warn("CMS content sync warning:", err.message);
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Lightweight version check: fetches ~40 bytes to see if content changed
  const checkVersionAndSync = useCallback(async () => {
    if (isFetchingRef.current) return;
    try {
      const res = await fetch("/api/content/version", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.version) {
        if (currentVersionRef.current && json.version !== currentVersionRef.current) {
          // Version has changed on server! Fetch full content silently in background
          fetchContent(true);
        } else if (!currentVersionRef.current) {
          currentVersionRef.current = json.version;
          setVersion(json.version);
        }
      }
    } catch (e) {
      // Ignore background check failure
    }
  }, [fetchContent]);

  // 1. Initial Load
  useEffect(() => {
    fetchContent(false);
  }, [fetchContent]);

  // 2. Same-Browser Instant Sync (BroadcastChannel + LocalStorage event)
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(CMS_BROADCAST_CHANNEL);
        bc.onmessage = (event) => {
          if (event.data?.type === "CMS_UPDATED") {
            fetchContent(true);
          }
        };
      } catch (e) {}
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CMS_STORAGE_SYNC_KEY) {
        fetchContent(true);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchContent]);

  // 3. Cross-Device Real-Time Server-Sent Events (SSE) Stream
  useEffect(() => {
    if (typeof window === "undefined" || !("EventSource" in window)) return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    const connectSSE = () => {
      if (isUnmounted) return;
      try {
        eventSource = new EventSource("/api/content/stream");

        eventSource.addEventListener("connected", (e: MessageEvent) => {
          try {
            const parsed = JSON.parse(e.data);
            if (parsed.version && currentVersionRef.current && parsed.version !== currentVersionRef.current) {
              fetchContent(true);
            }
          } catch (err) {}
        });

        eventSource.addEventListener("update", () => {
          // Instant real-time push received from server!
          fetchContent(true);
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect with backoff
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connectSSE, 5000);
          }
        };
      } catch (e) {
        if (!isUnmounted) {
          reconnectTimeout = setTimeout(connectSSE, 5000);
        }
      }
    };

    connectSSE();

    return () => {
      isUnmounted = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) eventSource.close();
    };
  }, [fetchContent]);

  // 4. Smart Background Polling (Bulletproof Fallback every 4s, 15s when tab hidden)
  useEffect(() => {
    const intervalTime = typeof document !== "undefined" && document.hidden ? 15000 : 4000;
    const interval = setInterval(() => {
      checkVersionAndSync();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [checkVersionAndSync]);

  // 5. Window Focus & Visibility Change Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkVersionAndSync();
      }
    };

    const handleFocus = () => {
      checkVersionAndSync();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkVersionAndSync]);

  // 6. Navigation listener (when user clicks links to other pages)
  useEffect(() => {
    if (pathname) {
      checkVersionAndSync();
    }
  }, [pathname, checkVersionAndSync]);

  // Optimistic updater for local state
  const updateOptimistic = useCallback((updater: (prev: CmsData) => CmsData) => {
    setData((prev) => updater(prev));
  }, []);

  return (
    <CmsContext.Provider
      value={{
        data,
        isLoading,
        error,
        version,
        refresh: () => fetchContent(false),
        updateOptimistic,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCmsData() {
  return useContext(CmsContext);
}
