"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./card-deal-flip.css";

export type DealCard = {
  title: string;
  number: string;
  color: string;
  textColor?: string;
  tag?: string;
  description?: string;
  items: string[];
  onLaunch?: () => void;
};

const smooth = (p: number) => p * p * (3 - 2 * p);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function Glyph({ kind }: { kind: 0 | 1 | 2 }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      {kind === 0 && <circle cx="9" cy="9" r="7" />}
      {kind === 1 && <path d="M9 2v14M2 9h14" />}
      {kind === 2 && <path d="M9 2l7 7-7 7-7-7z" />}
    </svg>
  );
}

function CardFrontContent({ card }: { card: DealCard }) {
  return (
    <>
      <div className="tds-deal__title">
        <p className="tds-deal__mono font-bold">{card.number}</p>
        <p className="tds-deal__mono opacity-85 text-[11px]">{card.tag || "AR MODULE"}</p>
      </div>
      <div className="tds-deal__card-center">
        <h3 className="tds-deal__card-headline">{card.title}</h3>
      </div>
      <div className="tds-deal__title">
        <p className="tds-deal__mono opacity-85 text-[11px]">AD MARSAL</p>
        <p className="tds-deal__mono font-bold">{card.number}</p>
      </div>
    </>
  );
}

export function CardDealFlip({
  name,
  intro,
  tags,
  cards,
  heading,
  bars,
  children,
}: {
  name: string;
  intro: string;
  tags: [string, string];
  cards: DealCard[];
  heading: string;
  bars: [string, string];
  /** the section between the hero and the services */
  children: ReactNode;
}) {
  const hero = useRef<HTMLElement>(null);
  const services = useRef<HTMLElement>(null);

  useEffect(() => {
    const heroEl = hero.current!;
    const svc = services.current!;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 1001px)");
    const group = heroEl.querySelector<HTMLElement>(".tds-deal__hero-cards")!;
    const heroCards = Array.from(
      heroEl.querySelectorAll<HTMLElement>(".tds-deal__hero-card"),
    );
    const layer = svc.querySelector<HTMLElement>(".tds-deal__layer")!;
    const head = svc.querySelector<HTMLElement>(".tds-deal__svc-head")!;
    const svcCards = Array.from(
      svc.querySelectorAll<HTMLElement>(".tds-deal__card"),
    );
    const inners = svcCards.map((c) =>
      c.querySelector<HTMLElement>(".tds-deal__flip")!,
    );

    svc.classList.add("tds-deal--js");
    // Hero cards pop in once, then bob.
    heroCards.forEach((c, i) =>
      c.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
        duration: reduce ? 0 : 750,
        delay: reduce ? 0 : 250 + i * 100,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "forwards",
      }),
    );

    let heroP = 0;
    let svcP = 0;
    let raf = 0;
    let last = performance.now();

    const targets = () => {
      const vh = window.innerHeight;
      const hr = heroEl.getBoundingClientRect();
      const sr = svc.getBoundingClientRect();
      return {
        hero: clamp(-hr.top / (hr.height * 0.75)),
        svc: clamp((vh - sr.top) / (vh * 4)),
        sr,
        vh,
      };
    };

    const paint = (t: ReturnType<typeof targets>) => {
      // Hero cards fall out.
      group.style.opacity = String(mix(1, 0.5, smooth(heroP)));
      const heroN = heroCards.length;
      const heroCenter = (heroN - 1) / 2;
      heroCards.forEach((c, i) => {
        const p = smooth(clamp((heroP - i * 0.09) / (1 - i * 0.09)));
        const norm = heroCenter > 0 ? (i - heroCenter) / heroCenter : 0;
        const x = mix(0, -norm * 90, p);
        const r = mix(0, -norm * 15, p);
        c.style.translate = `${x}% ${mix(0, 400, p)}%`;
        c.style.rotate = `${r}deg`;
        c.style.scale = String(mix(1, 0.75, p));
      });

      // The fixed card layer only shows through the services section.
      const top = Math.max(0, t.sr.top);
      const bottom = Math.max(0, t.vh - t.sr.bottom);
      layer.style.clipPath = `inset(${top}px 0 ${bottom}px 0)`;
      layer.style.visibility =
        top >= t.vh || bottom >= t.vh ? "hidden" : "visible";

      head.style.transform = `translateY(${mix(300, 0, smooth(clamp(svcP / 0.9)))}%)`;
      const svcN = svcCards.length;
      const svcCenter = (svcN - 1) / 2;
      svcCards.forEach((card, i) => {
        const d = i * 0.05;
        const p = clamp((svcP - d) / (0.9 - d));
        const norm = svcCenter > 0 ? (i - svcCenter) / svcCenter : 0;
        const start = -norm * 100;
        const tilt = norm * 5;
        let y: number,
          scale: number,
          x = start,
          rot = tilt,
          flip = 0;
        if (p < 0.4) {
          const s = smooth(p / 0.4);
          y = mix(-100, 50, s);
          scale = mix(0.25, 0.75, s);
        } else if (p < 0.6) {
          const s = smooth((p - 0.4) / 0.2);
          y = mix(50, 0, s);
          scale = mix(0.75, 1, s);
        } else {
          const s = smooth((p - 0.6) / 0.4);
          y = 0;
          scale = 1;
          x = mix(start, 0, s);
          rot = mix(tilt, 0, s);
          flip = s * 180;
        }
        card.style.opacity = String(p < 0.2 ? smooth(p / 0.2) : 1);
        card.style.transform = `translate(${x}%, ${y}%) rotate(${rot}deg) scale(${scale})`;
        inners[i].style.transform = `rotateY(${flip}deg)`;
      });
    };

    const clear = () => {
      group.style.opacity = "";
      heroCards.forEach(
        (c) => (c.style.translate = c.style.rotate = c.style.scale = ""),
      );
      layer.style.clipPath = layer.style.visibility = "";
      head.style.transform = "";
      svcCards.forEach((c, i) => {
        c.style.opacity = c.style.transform = "";
        inners[i].style.transform = "";
      });
    };

    // About 1s of catch-up behind the scrollbar ("scrub: 1").
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = targets();
      const k = reduce ? 1 : 1 - Math.exp(-dt * 4);
      heroP += (t.hero - heroP) * k;
      svcP += (t.svc - svcP) * k;
      paint(t);
      const settled =
        Math.abs(t.hero - heroP) < 0.0005 && Math.abs(t.svc - svcP) < 0.0005;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!desktop.matches) return;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onMode = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (desktop.matches) {
        svc.classList.add("tds-deal--pin");
        const t = targets();
        heroP = t.hero;
        svcP = t.svc;
        paint(t);
      } else {
        svc.classList.remove("tds-deal--pin");
        clear();
      }
    };

    onMode();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    desktop.addEventListener("change", onMode);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      desktop.removeEventListener("change", onMode);
      svc.classList.remove("tds-deal--js", "tds-deal--pin");
      clear();
    };
  }, []);

  return (
    <div className="tds-deal">
      <section ref={hero} className="tds-deal__hero">
        <div className="tds-deal__bar tds-deal__bar--top">
          <Glyph kind={0} />
          <Glyph kind={0} />
        </div>
        <div className="tds-deal__hero-content">
          <h1 className="tds-deal__name">{name}</h1>
          <div className="tds-deal__hero-foot">
            <p className="tds-deal__intro">{intro}</p>
            <div className="tds-deal__tags">
              {tags.map((t) => (
                <p key={t} className="tds-deal__mono">
                  <span aria-hidden>&#9654;</span> {t}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="tds-deal__hero-cards" aria-hidden>
          {cards.map((c, i) => (
            <div
              key={i}
              className="tds-deal__hero-card"
              style={{ zIndex: cards.length - 1 - i }}
            >
              <div
                className="tds-deal__hero-card-inner"
                style={{
                  background: c.color,
                  color: c.textColor,
                  animationDelay: `${i * 0.25}s`,
                }}
              >
                <CardFrontContent card={c} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {children}

      <section ref={services} className="tds-deal__services">
        <div className="tds-deal__stage">
          <div className="tds-deal__svc-head">
            <p className="tds-deal__md">{heading}</p>
          </div>
          <div className="tds-deal__bar tds-deal__bar--top">
            <span>
              <Glyph kind={0} />
              <Glyph kind={2} />
            </span>
            <span>
              <Glyph kind={2} />
              <Glyph kind={0} />
            </span>
          </div>
          <div className="tds-deal__bar tds-deal__bar--bottom">
            <p className="tds-deal__mono">
              <span aria-hidden>&#9654;</span> {bars[0]}
            </p>
            <p className="tds-deal__mono">{bars[1]}</p>
          </div>
        </div>
        <div className="tds-deal__layer">
          <div className="tds-deal__cards">
            {cards.map((c, i) => (
              <div
                key={i}
                className="tds-deal__card"
                style={{ "--i": i, zIndex: cards.length - 1 - i } as CSSProperties}
              >
                <div
                  className="tds-deal__card-float"
                  style={{ animationDelay: `${i * 0.25}s` }}
                >
                  <div className="tds-deal__flip">
                    <div
                      className="tds-deal__face tds-deal__face--front"
                      style={{ background: c.color, color: c.textColor }}
                      aria-hidden
                    >
                      <CardFrontContent card={c} />
                    </div>
                    <div className="tds-deal__face tds-deal__face--back">
                      <div className="tds-deal__back-header">
                        <div className="tds-deal__title">
                          <span className="tds-deal__mono font-bold text-[#2f5233]">{c.number}</span>
                          <span className="tds-deal__back-tag">
                            {c.tag || "AR TRAINING"}
                          </span>
                        </div>
                        <h4 className="tds-deal__back-title">{c.title}</h4>
                      </div>

                      {c.description && (
                        <p className="tds-deal__back-desc">{c.description}</p>
                      )}

                      <div className="tds-deal__back-syllabus">
                        <p className="tds-deal__mono tds-deal__syllabus-label">TRAINING CHECKLIST</p>
                        <ul className="tds-deal__list">
                          {c.items.map((item) => (
                            <li key={item}>
                              <span className="tds-deal__check-dot">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          c.onLaunch?.();
                        }}
                        className="tds-deal__launch-btn"
                      >
                        <span>Launch AR Module</span>
                        <span aria-hidden>▶</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
