"use client";

import Link from "next/link";
import type { Brand } from "@/lib/brands";

interface Props {
  brands: Brand[];
}

export function BrandTicker({ brands }: Props) {
  // Duplicate the array so the seamless loop works: [A B C … | A B C …]
  const doubled = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden" aria-label="Marken-Schleife">
      {/* Fade masks left & right */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#FAFAF9] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#FAFAF9] to-transparent" />

      {/* Scrolling track */}
      <div
        className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused]"
        style={{ willChange: "transform" }}
      >
        {doubled.map((b, i) => (
          <Link
            key={`${b.slug}-${i}`}
            href={`/auto-bewerten/${b.slug}`}
            tabIndex={i >= brands.length ? -1 : 0}
            aria-hidden={i >= brands.length}
            className="group flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white border border-border hover:border-amber hover:shadow-warm transition-all shrink-0 w-28"
            aria-label={i < brands.length ? `${b.name} bewerten` : undefined}
          >
            {b.hasLogo ? (
              <span className="h-10 w-16 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${b.slug}.svg`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  draggable={false}
                  className="max-h-10 max-w-[64px] object-contain transition-transform group-hover:scale-110 duration-200"
                />
              </span>
            ) : (
              <span className="h-10 w-16 flex items-center justify-center text-base font-bold text-foreground/50">
                {b.name}
              </span>
            )}
            <span className="text-xs font-semibold text-foreground text-center truncate w-full text-center">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
