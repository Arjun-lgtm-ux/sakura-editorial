"use client";

import { useEffect, useRef, useState } from "react";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export type SakuraEditorialKeyword = {
  label: string;
};

export type SakuraEditorialPosterProps = {
  title?: string;
  keywords?: SakuraEditorialKeyword[];
  headline?: string;
  body?: string;
  subheadline?: string;
  footerLeft?: string;
  footerCenter?: string;
  footerRight?: string;
  socialHandle?: string;
  sceneSrc?: string;
  sceneAlt?: string;
  foregroundSrc?: string | null;
  foregroundAlt?: string;
  height?: string;
  forceProgress?: number;
  preview?: boolean;
  className?: string;
  onLogin?: () => void;
  onTabClick?: (tabId: string) => void;
};

const ASSET = "https://design-layer.com/dev/sakura-editorial-poster";
const FALLBACK_UNSPLASH_SCENE =
  "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop";
const FONT_LINK_ID = "sakura-editorial-poster-fonts";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500;600&family=Saira+Extra+Condensed:wght@700;800&display=swap";

export const SAKURA_EDITORIAL_DEFAULT_KEYWORDS: SakuraEditorialKeyword[] = [
  { label: "Bloom" },
  { label: "Pause" },
  { label: "Return" },
];

const DEFAULT_BODY =
  "For a few still days the canopy turns pale pink, and the street below goes quiet. Walk while the color lasts — it is already leaving, petal by petal, into the wind.";

const FRAME_PAD_CLASS = "p-[clamp(1.25rem,4vmin,2.5rem)]";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getScrollParent(el: HTMLElement): HTMLElement | Window {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const oy = style.overflowY;
    const canScroll =
      (oy === "auto" || oy === "scroll" || oy === "overlay") &&
      node.scrollHeight > node.clientHeight + 1;
    if (canScroll) {
      if (node === document.documentElement || node === document.body) {
        return window;
      }
      return node;
    }
    node = node.parentElement;
  }
  return window;
}

function readScrollProgress(
  track: HTMLElement,
  scrollRoot: HTMLElement | Window,
): number {
  const useWindowScroll =
    !(scrollRoot instanceof HTMLElement) ||
    (typeof document !== "undefined" &&
      (scrollRoot === document.documentElement || scrollRoot === document.body));

  if (useWindowScroll) {
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const scrollable = track.offsetHeight - vh;
    if (scrollable <= 0) return 1;
    return clamp01(-rect.top / scrollable);
  }

  const rootRect = scrollRoot.getBoundingClientRect();
  const trackRect = track.getBoundingClientRect();
  const scrollable = track.offsetHeight - scrollRoot.clientHeight;
  if (scrollable <= 0) return 1;
  return clamp01((rootRect.top - trackRect.top) / scrollable);
}

type TitleChar = {
  key: string;
  char: string;
  index: number;
  fromCenter: number;
};

function splitTitleChars(title: string): TitleChar[] {
  const chars = Array.from(title);
  const mid = Math.max(chars.length - 1, 1) / 2;
  return chars.map((char, index) => ({
    key: `${index}-${char === " " ? "sp" : char}`,
    char: char === " " ? "\u00A0" : char,
    index,
    fromCenter: mid <= 0 ? 0 : Math.abs(index - mid) / mid,
  }));
}

function charReveal(progress: number, fromCenter: number): number {
  const start = fromCenter * 0.55;
  const end = Math.min(1, start + 0.38);
  return clamp01((progress - start) / Math.max(0.001, end - start));
}

function useSakuraEditorialFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

function SakuraFitTitle({
  title,
  revealProgress,
}: {
  title: string;
  revealProgress: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [fontPx, setFontPx] = useState<number | null>(null);
  const chars = splitTitleChars(title);
  const titleProgress = clamp01(revealProgress / 0.4);

  useEffect(() => {
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    if (!wrap || !probe) return;

    const PROBE = 100;
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const next = (wrap.clientWidth / Math.max(1, probe.scrollWidth)) * PROBE;
      if (!Number.isFinite(next) || next <= 0) return;
      setFontPx(next);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    const fonts = document.fonts;
    const onFonts = () => {
      void fonts?.ready.then(fit);
    };
    fonts?.addEventListener?.("loadingdone", onFonts);
    void (async () => {
      try {
        await fonts?.load?.('800 100px "Saira Extra Condensed"');
      } catch {
        /* fallback metrics */
      }
      await fonts?.ready;
      fit();
    })();
    fit();

    return () => {
      cancelled = true;
      ro.disconnect();
      fonts?.removeEventListener?.("loadingdone", onFonts);
    };
  }, [title]);

  const titleStyle = {
    fontFamily: '"Saira Extra Condensed", "Arial Narrow", sans-serif',
    fontWeight: 800,
    letterSpacing: "0.02em",
    WebkitFontSmoothing: "antialiased" as const,
    MozOsxFontSmoothing: "grayscale" as const,
    textRendering: "geometricPrecision" as const,
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-x-[4%] top-[11%] sm:top-[10%] z-20 overflow-visible"
    >
      <span
        ref={probeRef}
        aria-hidden
        className="pointer-events-none invisible absolute whitespace-nowrap uppercase leading-none"
        style={{ ...titleStyle, fontSize: 100 }}
      >
        {title}
      </span>
      <h1
        className="m-0 overflow-visible whitespace-nowrap text-left uppercase leading-none text-white"
        style={{
          ...titleStyle,
          fontSize: fontPx != null ? `${fontPx}px` : "min(36cqw, 52cqh)",
        }}
      >
        {chars.map((item) => {
          const t = charReveal(titleProgress, item.fromCenter);
          const y = (1 - t) * (18 + item.fromCenter * 24);
          const side = item.index < chars.length / 2 ? 1 : -1;
          const x =
            (1 - t) *
            (item.fromCenter > 0.01 ? item.fromCenter * 16 * side : 0);
          return (
            <span
              key={item.key}
              aria-hidden
              className="inline-block"
              style={{
                opacity: t,
                transform: `translate3d(${x}px, ${y}px, 0)`,
              }}
            >
              {item.char}
            </span>
          );
        })}
        <span className="sr-only">{title}</span>
      </h1>
    </div>
  );
}

function SakuraHeroVisual({
  title,
  sceneSrc,
  sceneAlt,
  foregroundSrc,
  foregroundAlt,
  revealProgress,
  onLogin,
  onTabClick,
}: {
  title: string;
  sceneSrc: string;
  sceneAlt: string;
  foregroundSrc: string | null;
  foregroundAlt: string;
  revealProgress: number;
  onLogin?: () => void;
  onTabClick?: (tabId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("home");
  const navContainerRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navTabs = [
    { id: "home", label: "Home" },
    { id: "training", label: "AR Training" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabClick?.(tabId);

    if (tabId === "training") {
      const el = document.getElementById("ar-training");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (tabId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tabId === "analytics") {
      const el = document.getElementById("card-deal-flip");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Sync active tab with user scroll position
  useEffect(() => {
    const handleScroll = () => {
      const arSection = document.getElementById("ar-training");
      if (arSection) {
        const rect = arSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          setActiveTab("training");
        } else if (window.scrollY < 300) {
          setActiveTab("home");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update sliding pill position dynamically on tab change, layout shift, or resize
  useEffect(() => {
    const updatePill = () => {
      const activeEl = tabRefs.current[activeTab];
      const container = navContainerRef.current;
      if (activeEl && container) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeEl.getBoundingClientRect();
        setPillStyle({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
          opacity: 1,
        });
      }
    };

    updatePill();
    const frameId = requestAnimationFrame(updatePill);
    const timer = setTimeout(updatePill, 60);
    window.addEventListener("resize", updatePill);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      window.removeEventListener("resize", updatePill);
    };
  }, [activeTab]);

  // Center-Outward Harmonic Physics (symmetrically echoing AD MARSAL's reveal)
  const navProgress = clamp01(revealProgress / 0.32);
  const easeOutCubic = 1 - Math.pow(1 - navProgress, 3);

  // Tabs container: drops in with a liquid glass descent and horizontal expansion
  const navTranslateY = (1 - easeOutCubic) * -30;
  const navScaleX = 0.9 + easeOutCubic * 0.1;
  const navScaleY = 0.94 + easeOutCubic * 0.06;
  const navOpacity = clamp01(navProgress * 2.6);

  // Login button: synchronized orbital glide from top-right with soft spring dampening
  const loginProgress = clamp01(revealProgress / 0.34);
  const loginEase = 1 - Math.pow(1 - loginProgress, 3);
  const loginTranslateY = (1 - loginEase) * -30;
  const loginTranslateX = (1 - loginEase) * 20;
  const loginScale = 0.9 + loginEase * 0.1;
  const loginOpacity = clamp01(loginProgress * 2.8);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={sceneSrc}
          alt={sceneAlt}
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
          draggable={false}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_UNSPLASH_SCENE) {
              e.currentTarget.src = FALLBACK_UNSPLASH_SCENE;
            }
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Dynamic Glass Navigation Capsule Centered in the Page */}
      <div
        className="absolute top-[2.5%] left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-140px)] transition-transform duration-100 will-change-transform"
        style={{
          opacity: navOpacity,
          transform: `translate3d(-50%, ${navTranslateY}px, 0) scale(${navScaleX}, ${navScaleY})`,
          transformOrigin: "top center",
        }}
      >
        <nav
          ref={navContainerRef}
          className="relative inline-flex min-w-[320px] sm:min-w-[480px] md:min-w-[620px] items-center justify-center gap-1 sm:gap-2 rounded-2xl border border-white/15 bg-white/[0.04] p-1.5 px-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] overflow-x-auto scrollbar-none group"
        >
          {/* Subtle Prismatic Light Sweep across Glass Rim */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(${(easeOutCubic - 0.5) * 220}%)`,
              }}
            />
          </div>

          {/* Smooth Sliding Liquid Glass Pill for Active Tab */}
          <div
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl border border-white/25 bg-white/[0.12] shadow-[0_0_20px_rgba(255,255,255,0.12)] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
            }}
          />

          {navTabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            // Center-outward harmonic stagger (indices 0, 1, 2, 3 -> center 1.5)
            const fromCenter = Math.abs(index - 1.5) / 1.5; // ~0.33 for inner, 1.0 for outer
            const direction = index < 1.5 ? -1 : 1;
            const tabDelay = (1 - fromCenter) * 0.08; // inner tabs (AR Training, Analytics) appear first
            const tabProgress = clamp01((navProgress - tabDelay) / (1 - tabDelay || 0.001));
            const tabEase = 1 - Math.pow(1 - tabProgress, 2.5);
            const tabX = (1 - tabEase) * (fromCenter * 14 * direction);
            const tabY = (1 - tabEase) * 8;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                style={{
                  opacity: tabEase,
                  transform: `translate3d(${tabX}px, ${tabY}px, 0)`,
                }}
                className={cn(
                  "relative z-10 inline-flex items-center justify-center rounded-xl px-5 sm:px-7 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap will-change-transform active:scale-95",
                  isActive
                    ? "text-white font-semibold drop-shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Small Glass Login Button on the Right Side */}
      <div
        className="absolute top-[2.5%] right-[4%] z-40 transition-transform duration-100 will-change-transform"
        style={{
          opacity: loginOpacity,
          transform: `translate3d(${loginTranslateX}px, ${loginTranslateY}px, 0) scale(${loginScale})`,
        }}
      >
        <button
          type="button"
          onClick={onLogin}
          className="group relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:bg-white/[0.10] hover:shadow-[0_0_24px_rgba(255,255,255,0.18)] hover:-translate-y-0.5 active:scale-95 shrink-0"
        >
          {/* Subtle Active Indicator Dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span>Login</span>
          <LogIn className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-white/80 group-hover:text-white" />
        </button>
      </div>

      <SakuraFitTitle title={title} revealProgress={revealProgress} />

      {foregroundSrc ? (
        <img
          src={foregroundSrc}
          alt={foregroundAlt}
          className="pointer-events-none absolute bottom-0 left-1/2 z-30 h-auto w-[min(92%,78cqh)] -translate-x-[40%] object-contain object-bottom drop-shadow-[0_10px_28px_rgba(40,20,20,0.18)]"
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[35] bg-gradient-to-b from-transparent via-transparent to-[#f5f5f0]/18"
      />
    </div>
  );
}

function SakuraEditorialCopy({
  keywordItems,
  headline,
  body,
  subheadline,
  footerLeft,
  footerCenter,
  footerRight,
  socialHandle,
}: {
  keywordItems: SakuraEditorialKeyword[];
  headline: string;
  body: string;
  subheadline: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
  socialHandle?: string;
}) {
  return (
    <div className="relative flex min-h-[38%] flex-col border-0 bg-transparent p-[clamp(1.1rem,4.5cqw,2.25rem)] text-[#f6eee8]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4a2c32]/55 via-[#c99aa0]/25 to-transparent"
      />
      <div className="relative z-10 flex items-start justify-between gap-3 text-[clamp(9px,1.7cqw,11px)] font-light tracking-[0.16em] text-[#f6eee8]/70">
        {keywordItems.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>

      <h2
        className="relative z-10 mt-[clamp(0.7rem,2.2cqw,1.15rem)] text-[clamp(1.2rem,3.6cqw,1.7rem)] font-semibold leading-[1.3] text-[#f6eee8]"
        style={{
          fontFamily:
            '"Cormorant Garamond", "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif',
        }}
      >
        {headline}
      </h2>

      <p className="relative z-10 mt-[clamp(0.5rem,1.6cqw,0.75rem)] max-w-[62%] text-[clamp(10px,1.7cqw,12px)] font-light leading-[1.55] text-[#f6eee8]/85">
        {body}
      </p>

      <p
        className="relative z-10 mt-[clamp(0.65rem,2cqw,0.95rem)] text-[clamp(0.95rem,2.6cqw,1.2rem)] font-medium leading-[1.35] text-[#f6eee8]"
        style={{ fontFamily: '"Jost", ui-sans-serif, sans-serif' }}
      >
        {subheadline}
      </p>

      <div className="relative z-10 mt-auto flex items-end justify-between gap-3 pt-[clamp(0.7rem,2.4cqw,1.1rem)] text-[clamp(9px,1.6cqw,11px)] font-light tracking-[0.08em] text-[#f6eee8]/75">
        <span>{footerLeft}</span>
        <span>{footerCenter}</span>
        <span>{footerRight}</span>
      </div>

      {socialHandle ? (
        <span className="absolute bottom-[clamp(0.35rem,1.2cqw,0.65rem)] right-[clamp(0.75rem,4.5cqw,2.25rem)] z-10 text-[clamp(9px,2cqw,11px)] font-light tracking-[0.04em] text-[#f6eee8]/40">
          {socialHandle}
        </span>
      ) : null}
    </div>
  );
}

export function SakuraEditorialPoster({
  title = "AD MARSAL",
  keywords = SAKURA_EDITORIAL_DEFAULT_KEYWORDS,
  headline = "Petals Hold the Light | 花びらが光を抱く。",
  body = DEFAULT_BODY,
  subheadline = "Stay for the fall. 散るまで、見ていて。",
  footerLeft = "DesignLayer",
  footerCenter = "Vol. 01",
  footerRight = "03.26 2026",
  socialHandle = "@designlayer",
  sceneSrc = `${import.meta.env.BASE_URL}mine-background.jpg`,
  sceneAlt = "Open-pit mining quarry aerial view",
  foregroundSrc = null,
  foregroundAlt = "",
  height = "280vh",
  forceProgress,
  preview = false,
  className,
  onLogin,
  onTabClick,
}: SakuraEditorialPosterProps) {
  useSakuraEditorialFonts();

  const trackRef = useRef<HTMLElement>(null);
  const keywordItems = keywords.filter((item) => item.label.trim().length > 0);

  const locked = forceProgress != null && Number.isFinite(forceProgress);
  const [progress, setProgress] = useState(
    forceProgress != null ? clamp01(forceProgress) : 0,
  );
  const [stickyPx, setStickyPx] = useState<number | null>(null);

  const fillViewport = locked || preview;
  const trackHeight = fillViewport ? "auto" : height;
  const useSticky = !locked && !preview;

  useEffect(() => {
    if (locked || preview) {
      setProgress(clamp01(forceProgress ?? 0));
      setStickyPx(null);
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const scrollRoot = getScrollParent(track);
    let target = 0;
    let current = 0;
    let raf = 0;

    const read = () => {
      const fromRoot = readScrollProgress(track, scrollRoot);
      if (scrollRoot === window) return fromRoot;
      const fromWindow = readScrollProgress(track, window);
      return Math.abs(fromWindow - fromRoot) > 0.02 ? fromWindow : fromRoot;
    };

    const loop = () => {
      const delta = target - current;
      current += Math.abs(delta) > 0.35 ? delta * 0.22 : delta * 0.14;
      if (Math.abs(delta) < 0.0008) current = target;
      setProgress(current);
      raf = window.requestAnimationFrame(loop);
    };

    const onScroll = () => {
      target = read();
    };

    const onResize = () => {
      if (scrollRoot === window) {
        setStickyPx(window.innerHeight);
      } else {
        setStickyPx((scrollRoot as HTMLElement).clientHeight);
      }
      target = read();
    };

    onResize();
    target = read();
    current = target;
    setProgress(current);

    const opts: AddEventListenerOptions = { passive: true };
    scrollRoot.addEventListener("scroll", onScroll, opts);
    window.addEventListener("resize", onResize);
    raf = window.requestAnimationFrame(loop);

    return () => {
      scrollRoot.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(raf);
    };
  }, [forceProgress, locked, preview]);

  const revealProgress = locked || preview ? clamp01(forceProgress ?? 0) : progress;
  const copyProgress = clamp01((revealProgress - 0.78) / 0.22);
  const copyOffset = `${(1 - copyProgress) * 100}%`;
  const panelHeight =
    useSticky && stickyPx != null
      ? stickyPx
      : fillViewport
        ? "100%"
        : ("100svh" as const);

  return (
    <section
      ref={trackRef}
      className={cn(
        "relative isolate w-full bg-[#ece8df]",
        fillViewport && "h-screen",
        className,
      )}
      style={{
        height: useSticky ? trackHeight : undefined,
        fontFamily: '"Jost", ui-sans-serif, sans-serif',
      }}
    >
      <div
        className={cn(
          "box-border w-full overflow-hidden",
          FRAME_PAD_CLASS,
          useSticky ? "sticky top-0" : "relative",
        )}
        style={{ height: panelHeight }}
      >
        <article className="@container relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-xl bg-[#f5f5f0] shadow-[0_24px_80px_rgba(80,50,50,0.12)]">
          <div className="@container relative min-h-0 flex-1 overflow-hidden [container-type:size]">
            <SakuraHeroVisual
              title={title}
              sceneSrc={sceneSrc}
              sceneAlt={sceneAlt}
              foregroundSrc={foregroundSrc}
              foregroundAlt={foregroundAlt}
              revealProgress={revealProgress}
              onLogin={onLogin}
              onTabClick={onTabClick}
            />
          </div>

          <div
            className="absolute inset-x-0 bottom-0 z-30 will-change-transform"
            style={{ transform: `translate3d(0, ${copyOffset}, 0)` }}
          >
            <SakuraEditorialCopy
              keywordItems={keywordItems}
              headline={headline}
              body={body}
              subheadline={subheadline}
              footerLeft={footerLeft}
              footerCenter={footerCenter}
              footerRight={footerRight}
              socialHandle={socialHandle}
            />
          </div>
        </article>
      </div>
    </section>
  );
}

export default SakuraEditorialPoster;
