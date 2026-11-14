import { cmsEventEmitter, getCmsVersion } from "@/lib/cms/store";

export async function GET(request: Request) {
  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (eventType: string, data: any) => {
        try {
          controller.enqueue(encoder.encode(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Stream might be closed
        }
      };

      // Send initial connect handshake
      send("connected", { version: getCmsVersion() });

      // Listen to server-wide CMS update events
      const onUpdate = (version: string) => {
        send("update", { version, timestamp: Date.now() });
      };

      cmsEventEmitter.on("update", onUpdate);

      // Heartbeat comment every 20 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
        }
      }, 20000);

      cleanup = () => {
        clearInterval(heartbeat);
        cmsEventEmitter.off("update", onUpdate);
      };
    },
    cancel() {
      if (cleanup) cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
