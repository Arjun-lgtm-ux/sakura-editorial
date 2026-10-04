"use client";

import React, {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

type Month = keyof typeof monthOrder;

export type JourneyItem = {
  id: string;
  year: string;
  month: Month;
  title?: string;
  content: string;
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
  duration?: number;
  scrollDuration?: number;
  topData?: JourneyItem[];
  bottomData?: JourneyItem[];
};

const defaultTopJourneyData: JourneyItem[] = [
  {
    id: "trad-manuals",
    year: "1990",
    month: "March",
    title: "Paper SOPs & Whistle Drills",
    content: "Rote classroom manuals with zero spatial hazard perception and zero muscle memory.",
  },
  {
    id: "mock-drills",
    year: "2015",
    month: "July",
    title: "Live Quarry Mock Drills",
    content: "Costly pit shutdowns with severe real injury risks during live simulated bench rockfalls.",
  },
  {
    id: "desktop-cad",
    year: "2023",
    month: "April",
    title: "Desktop GIS & 2D CAD",
    content: "Restricted to planning engineers in surface offices, inaccessible to frontline quarry operators.",
  },
  {
    id: "ad-marsal-2026",
    year: "2026",
    month: "May",
    title: "Ad Marsal Spatial Edge AR",
    content: "100% Zero-risk real-time HUD, instant hazard detection, DGMS compliance in Hindi, English & Santhali.",
  },
];

const defaultBottomJourneyData: JourneyItem[] = [
  {
    id: "video-slides",
    year: "2005",
    month: "November",
    title: "2D Audio-Visual Projectors",
    content: "Passive classroom video lectures without realistic pit perspective or physical reaction tests.",
  },
  {
    id: "vr-cables",
    year: "2020",
    month: "October",
    title: "Tethered VR Headsets",
    content: "Bulky enclosed headsets prone to motion nausea; impractical under humid underground conditions.",
  },
  {
    id: "ai-mesh-beta",
    year: "2025",
    month: "September",
    title: "Mobile LiDAR Prototype",
    content: "First edge-mesh prototypes tested during SIH trials for automated rock fracture detection.",
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
  duration,
  scrollDuration = 1.2,
  topData = defaultTopJourneyData,
  bottomData = defaultBottomJourneyData,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const topJourneyData = topData;
  const bottomJourneyData = bottomData;
  const allJourneyItems: JourneyItem[] = [
    ...topJourneyData,
    ...bottomJourneyData,
  ].sort((a, b) => {
    const yearDiff = Number(a.year) - Number(b.year);
    if (yearDiff !== 0) return yearDiff;
    return monthOrder[a.month] - monthOrder[b.month];
  });

  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  // GSAP Animation setup
  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Initialize nodes
      allJourneyItems.forEach((item) => {
        gsap.set(`.jl-${item.id}`, {
          scaleY: 0.1,
          transformOrigin: topJourneyData.some((t) => t.id === item.id) ? "bottom bottom" : "top top",
        });
        gsap.set(`.jd-${item.id}`, { scale: 0.3 });
        gsap.set(`.title-${item.id}`, { y: 20, opacity: 0.3 });
        gsap.set(`.description-${item.id}`, { y: 20, opacity: 0.3 });
      });
      gsap.set(".journey-line", { width: "10%" });

      // Create Master Animation Timeline controlled by horizontal scroll
      const masterTl = gsap.timeline({ paused: true });

      masterTl.to(".journey-line", {
        width: "98%",
        ease: "none",
        duration: 1,
      }, 0);

      const count = allJourneyItems.length;
      allJourneyItems.forEach((item, index) => {
        const itemPos = (index + 0.5) / count;
        const startTime = Math.max(0, itemPos - 0.15);
        const animDur = 0.25;

        masterTl.to(
          `.jl-${item.id}`,
          { scaleY: 1, ease: "power2.out", duration: animDur },
          startTime
        );
        masterTl.to(
          `.jd-${item.id}`,
          { scale: 1, ease: "back.out(2)", duration: animDur },
          startTime
        );
        masterTl.to(
          [`.title-${item.id}`, `.description-${item.id}`],
          { y: 0, opacity: 1, stagger: 0.05, ease: "power2.out", duration: animDur },
          startTime + 0.05
        );
      });

      // Update GSAP timeline progress on container horizontal scroll
      const handleScroll = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) {
          masterTl.progress(1);
          setScrollProgress(100);
          return;
        }
        const current = container.scrollLeft;
        const progress = Math.min(1, Math.max(0, current / maxScroll));
        masterTl.progress(progress);
        setScrollProgress(progress * 100);
        setCanScrollLeft(current > 15);
        setCanScrollRight(current < maxScroll - 15);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      // Initial trigger
      handleScroll();

      // Mouse wheel horizontal translation inside this box
      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY * 1.5;
        }
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
      };
    }, container);

    return () => ctx.revert();
  }, [allJourneyItems]);

  const scrollByAmount = (distance: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl border border-[#4e342e]/20 p-6 shadow-sm overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Box Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4e342e]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#cc5500]/15 text-[#cc5500]">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#cc5500]">
              HISTORICAL JOURNEY & DRILL EVOLUTION
            </span>
          </div>
          <h3 className="mt-1 text-xl font-black text-[#4e342e]">{title}</h3>
          <p className="text-xs text-[#8d6e63] font-medium">{periodLabel}</p>
        </div>

        {/* Scroll Control Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <span className="hidden md:inline-block text-[11px] font-bold text-[#8d6e63] bg-[#efe6d5]/70 px-2.5 py-1 rounded-full border border-[#4e342e]/10">
            ↔ Scroll horizontally to trigger GSAP animation
          </span>
          <button
            type="button"
            onClick={() => scrollByAmount(-450)}
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
            onClick={() => scrollByAmount(450)}
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

      {/* Single Self-Contained Scrollable Box */}
      <div
        ref={containerRef}
        className="relative mt-4 w-full h-[480px] overflow-x-auto overflow-y-auto rounded-2xl border border-[#4e342e]/10 bg-[#efe6d5]/20 p-6 scrollbar-thin scrollbar-track-[#efe6d5] scrollbar-thumb-[#cc5500]/60"
      >
        <div
          ref={trackRef}
          className="relative flex items-center min-w-[2100px] h-[430px] pr-12"
        >
          {/* Cover / Lead-in Poster Card on the left */}
          <div className="h-[380px] w-[320px] shrink-0 overflow-hidden rounded-2xl border border-[#4e342e]/25 shadow-md relative group mr-12">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#cc5500]">
                36-YEAR TRAJECTORY
              </span>
              <h4 className="mt-1 text-lg font-bold leading-tight">
                From Whistle Drills to Spatial Holograms
              </h4>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                Tracing the technological transformation of Indian mine safety from paper SOPs to interactive 3D spatial AR.
              </p>
            </div>
          </div>

          {/* Interactive GSAP Timeline Canvas */}
          <div className="relative h-full flex-1 flex flex-col justify-between">
            {/* Central Horizontal Axis Line */}
            <div className="w-full absolute left-0 top-1/2 -translate-y-1/2 flex items-center h-fit z-0">
              <div
                className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                style={activeStyle}
              />
              <div
                className="h-1 w-full rounded-full journey-line bg-[#cc5500] origin-left transition-all"
                style={activeStyle}
              />
              <div
                className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                style={activeStyle}
              />
            </div>

            {/* TOP ROW: Even / Top Milestones */}
            <div className="flex h-1/2 w-full items-end pb-8">
              <div className="w-full flex gap-x-24 pl-10">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative w-72 shrink-0 flex flex-col justify-end"
                  >
                    {/* Content Card */}
                    <div className="space-y-1 rounded-2xl border border-[#4e342e]/15 bg-[#f8f4e7] p-4 shadow-sm mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#cc5500]">
                          {item.month}
                        </span>
                        <span className="rounded-md bg-[#4e342e]/10 px-2 py-0.5 text-xs font-black text-[#4e342e]">
                          {item.year}
                        </span>
                      </div>
                      <h4 className={`title-${item.id} text-sm font-bold text-[#4e342e] line-clamp-1`}>
                        {item.title || `${item.year} Milestone`}
                      </h4>
                      <p
                        className={`description-${item.id} text-xs leading-relaxed`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>

                    {/* Stem Line & Connecting Dot */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`h-12 w-0.5 origin-bottom rounded-full jl-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`size-3.5 relative rounded-full ring-4 ring-[#cc5500]/20 jd-${item.id}`}
                        style={activeStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM ROW: Odd / Bottom Milestones */}
            <div className="flex h-1/2 w-full items-start pt-8">
              <div className="w-full flex gap-x-24 pl-44">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative w-72 shrink-0 flex flex-col justify-start"
                  >
                    {/* Connecting Dot & Stem Line */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`size-3.5 relative rounded-full ring-4 ring-[#cc5500]/20 jd-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`h-12 w-0.5 origin-top rounded-full jl-${item.id}`}
                        style={activeStyle}
                      />
                    </div>

                    {/* Content Card */}
                    <div className="space-y-1 rounded-2xl border border-[#4e342e]/15 bg-[#f8f4e7] p-4 shadow-sm mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#cc5500]">
                          {item.month}
                        </span>
                        <span className="rounded-md bg-[#4e342e]/10 px-2 py-0.5 text-xs font-black text-[#4e342e]">
                          {item.year}
                        </span>
                      </div>
                      <h4 className={`title-${item.id} text-sm font-bold text-[#4e342e] line-clamp-1`}>
                        {item.title || `${item.year} Milestone`}
                      </h4>
                      <p
                        className={`description-${item.id} text-xs leading-relaxed`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar Indicator */}
      <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#4e342e]/10 pt-3 text-[11px] text-[#8d6e63]">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="h-2 w-2 rounded-full bg-[#4e342e]" />
          <span>1990 Traditional Drills</span>
        </div>

        <div className="h-1.5 flex-1 max-w-sm rounded-full bg-[#4e342e]/15 overflow-hidden">
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
