"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

export type JourneyItem = {
  id: string;
  year: string;
  month: string;
  title: string;
  content: string;
  highlight?: boolean;
};

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: JourneyItem[];
};

const defaultJourneyItems: JourneyItem[] = [
  {
    id: "trad-manuals",
    year: "1990",
    month: "March",
    title: "Paper SOPs & Whistle Drills",
    content: "Rote classroom manuals with 0% spatial hazard perception and zero muscle memory.",
  },
  {
    id: "video-slides",
    year: "2005",
    month: "November",
    title: "2D Audio-Visual Projectors",
    content: "Passive classroom video lectures without realistic pit perspective or physical reaction tests.",
  },
  {
    id: "mock-drills",
    year: "2015",
    month: "July",
    title: "Live Quarry Mock Drills",
    content: "Costly pit shutdowns with severe real injury risks during live simulated bench rockfalls.",
  },
  {
    id: "vr-cables",
    year: "2020",
    month: "October",
    title: "Tethered VR Headsets",
    content: "Bulky enclosed headsets prone to motion nausea; impractical under humid underground conditions.",
  },
  {
    id: "desktop-cad",
    year: "2023",
    month: "April",
    title: "Desktop GIS & 2D CAD",
    content: "Restricted to planning engineers in surface offices, inaccessible to frontline quarry operators.",
  },
  {
    id: "ai-mesh-beta",
    year: "2025",
    month: "September",
    title: "Mobile LiDAR Benchmarks",
    content: "First edge-mesh prototypes tested during SIH trials for automated rock fracture detection.",
  },
  {
    id: "ad-marsal-2026",
    year: "2026",
    month: "May",
    title: "Ad Marsal Spatial Edge AR",
    content: "100% Zero-risk real-time HUD, instant hazard detection, DGMS compliance in Hindi, English & Santhali.",
    highlight: true,
  },
];

export default function Timeline({
  title = "Evolution: Traditional Drills to Ad Marsal AR",
  periodLabel = "1990 — 2026 Safety Paradigm Shift",
  textColor = "#4e342e",
  mutedTextColor = "#8d6e63",
  activeColor = "#cc5500",
  backgroundColor = "#f8f4e7",
  imageUrl = "/mine-background.jpg",
  imageAlt = "Open cast quarry drill evolution",
  items = defaultJourneyItems,
}: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;
    setScrollProgress(maxScroll > 0 ? (current / maxScroll) * 100 : 0);
    setCanScrollLeft(current > 10);
    setCanScrollRight(current < maxScroll - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // If user scrolls vertically inside this box, pan horizontally
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
        updateScrollState();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const scrollByAmount = (distance: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
      setTimeout(updateScrollState, 350);
    }
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    updateScrollState();
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full rounded-3xl border border-[#4e342e]/20 p-6 shadow-sm overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Top Header Bar with Scroller Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4e342e]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#cc5500]/15 text-[#cc5500]">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#cc5500]">
              HISTORICAL JOURNEY & PARADIGM SHIFT
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-[#4e342e]">{title}</h3>
          <p className="text-xs text-[#8d6e63] font-medium">{periodLabel}</p>
        </div>

        {/* Scroll Navigation Buttons & Hint */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <span className="hidden md:inline-block text-[11px] font-bold text-[#8d6e63] bg-[#efe6d5]/70 px-2.5 py-1 rounded-full border border-[#4e342e]/10">
            ↔ Scroll or Drag sideways
          </span>
          <button
            type="button"
            onClick={() => scrollByAmount(-400)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[#4e342e]/20 bg-[#efe6d5] text-[#4e342e] transition hover:bg-[#4e342e] hover:text-[#f8f4e7] ${
              !canScrollLeft ? "opacity-35 cursor-not-allowed" : "hover:scale-105 active:scale-95"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(400)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[#4e342e]/20 bg-[#efe6d5] text-[#4e342e] transition hover:bg-[#4e342e] hover:text-[#f8f4e7] ${
              !canScrollRight ? "opacity-35 cursor-not-allowed" : "hover:scale-105 active:scale-95"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller Container */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={`relative mt-6 overflow-x-auto overflow-y-hidden pb-4 select-none scrollbar-thin scrollbar-track-[#efe6d5] scrollbar-thumb-[#cc5500]/60 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        <div className="flex items-center gap-8 min-w-max px-2 py-4">
          {/* Leading Cover Card */}
          <div className="relative h-64 w-72 shrink-0 overflow-hidden rounded-2xl border border-[#4e342e]/20 shadow-md group">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 flex flex-col justify-end text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#cc5500]">
                36-YEAR TRAJECTORY
              </span>
              <h4 className="mt-1 text-base font-bold leading-tight">
                From Whistles to Spatial Holograms
              </h4>
              <p className="mt-1 text-[11px] text-zinc-300 leading-snug">
                Tracing India's mining safety transformation across 4 generations of miners.
              </p>
            </div>
          </div>

          {/* Timeline Nodes along a connecting track */}
          <div className="relative flex items-center gap-10">
            {/* The Central Connecting Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#4e342e]/20 -z-0">
              <div
                className="h-full bg-gradient-to-r from-[#cc5500]/60 via-[#cc5500] to-emerald-500 transition-all duration-300"
                style={{ width: `${Math.max(10, scrollProgress)}%` }}
              />
            </div>

            {items.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="relative z-10 flex flex-col items-center w-64 shrink-0 transition-transform hover:-translate-y-1"
                >
                  {/* Top Slot (for even index) */}
                  <div className={`h-28 w-full flex flex-col justify-end pb-2 ${isEven ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    {isEven && (
                      <div className={`rounded-2xl border p-4 shadow-sm transition-all ${
                        item.highlight
                          ? "border-[#cc5500] bg-white ring-2 ring-[#cc5500]/20 shadow-md"
                          : "border-[#4e342e]/15 bg-[#efe6d5]/70 hover:bg-[#efe6d5]"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${item.highlight ? "text-[#cc5500]" : "text-[#8d6e63]"}`}>
                            {item.month}
                          </span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                            item.highlight ? "bg-[#cc5500] text-white" : "bg-[#4e342e]/10 text-[#4e342e]"
                          }`}>
                            {item.year}
                          </span>
                        </div>
                        <h5 className="mt-1 text-xs font-bold text-[#4e342e] line-clamp-1">{item.title}</h5>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#4e342e]/80 line-clamp-2">{item.content}</p>
                      </div>
                    )}
                  </div>

                  {/* Center Node on the line */}
                  <div className="relative my-3 flex items-center justify-center">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                      item.highlight
                        ? "bg-[#cc5500] ring-4 ring-[#cc5500]/30 shadow-lg scale-110"
                        : "bg-[#f8f4e7] border-2 border-[#4e342e] hover:border-[#cc5500]"
                    }`}>
                      <div className={`h-2.5 w-2.5 rounded-full ${item.highlight ? "bg-white animate-pulse" : "bg-[#4e342e]"}`} />
                    </div>
                  </div>

                  {/* Bottom Slot (for odd index) */}
                  <div className={`h-28 w-full flex flex-col justify-start pt-2 ${!isEven ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    {!isEven && (
                      <div className={`rounded-2xl border p-4 shadow-sm transition-all ${
                        item.highlight
                          ? "border-[#cc5500] bg-white ring-2 ring-[#cc5500]/20 shadow-md"
                          : "border-[#4e342e]/15 bg-[#efe6d5]/70 hover:bg-[#efe6d5]"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${item.highlight ? "text-[#cc5500]" : "text-[#8d6e63]"}`}>
                            {item.month}
                          </span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                            item.highlight ? "bg-[#cc5500] text-white" : "bg-[#4e342e]/10 text-[#4e342e]"
                          }`}>
                            {item.year}
                          </span>
                        </div>
                        <h5 className="mt-1 text-xs font-bold text-[#4e342e] line-clamp-1">{item.title}</h5>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#4e342e]/80 line-clamp-2">{item.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar Track */}
      <div className="mt-2 flex items-center justify-between gap-4 border-t border-[#4e342e]/10 pt-3 text-[11px] text-[#8d6e63]">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="h-2 w-2 rounded-full bg-[#4e342e]" />
          <span>1990 Traditional Drills</span>
        </div>

        <div className="h-1.5 flex-1 max-w-xs rounded-full bg-[#4e342e]/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#cc5500] transition-all duration-150"
            style={{ width: `${Math.max(5, scrollProgress)}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 font-bold text-[#cc5500]">
          <span className="h-2 w-2 rounded-full bg-[#cc5500] animate-ping" />
          <span>2026 Ad Marsal Spatial AR</span>
        </div>
      </div>
    </div>
  );
}
