import React from "react";
import Image from "next/image";

interface BottomLandscapeProps {
  className?: string;
  fadeColor?: string;
}

export default function BottomLandscape({
  className = "",
  fadeColor = "#FAF8F3",
}: BottomLandscapeProps) {
  return (
    <div
      className={`relative w-full h-7 sm:h-7.5 lg:h-8.5 xl:h-9 overflow-hidden pointer-events-none select-none shrink-0 mt-auto ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/images/reference/bottom-leaves-v2.png"
        alt="Madurai Cityscape & Landscape"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1600px"
        className="object-cover object-bottom"
      />
      {/* Natural smooth blend into canvas at the top edge */}
      <div
        className="absolute inset-x-0 top-0 h-2 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${fadeColor} 0%, ${fadeColor}99 50%, transparent 100%)`,
        }}
      />
    </div>
  );
}
