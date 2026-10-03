import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const COPY = {
  placeholder: "Ask Ad Marsal safety AI…",
  labels: ["Analyzing Hazard", "Reviewing Protocol", "Simulating AR Action", "Composing Safety Advice"],
  done: "Safety Guidance Ready",
  answerTitle: "Ad Marsal AI Advice",
  answerBody: "Stay alert: Always scan highwalls for fractures before positioning haul equipment. Maintain minimum 15m clearance from unstable slopes.",
  reset: "Ask another question",
  send: "Send",
};

type Phase = "idle" | "launch" | "assemble" | "think" | "resolve" | "condense" | "unfold" | "answered" | "reset";

export interface MorphOrbProps {
  onSubmit?: (text: string) => Promise<string> | string;
  minThinkMs?: number;
  speed?: number;
  onClose?: () => void;
}

const PILL_H = 54, BALL_SMALL = 54, ORB_D = 110, ORB_R = 55, CANVAS = 180;
const CARD_H = 130;
const FLY_D = 120;
const pillW = () => Math.min(460, window.innerWidth - 48);
const cardW = () => Math.min(360, window.innerWidth - 48);
const homeDy = () => 140;

type Ease = (t: number) => number;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fmt = (v: number) => String(Math.round(v * 1e4) / 1e4);
const TAU = Math.PI * 2;

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const solve = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) return t;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 40; i++) {
      const e = sx(t);
      if (Math.abs(e - x) < 1e-6) break;
      if (x > e) lo = t; else hi = t;
      t = (hi - lo) / 2 + lo;
    }
    return t;
  };
  return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
}

const E = {
  out: cubicBezier(0.22, 1, 0.36, 1),
  io: cubicBezier(0.65, 0, 0.35, 1),
  in: cubicBezier(0.4, 0, 1, 1),
  fly: cubicBezier(0.5, 0, 0.1, 1),
  grow: cubicBezier(0.3, 0, 0.2, 1),
  vortex: cubicBezier(0.6, 0, 0.2, 1),
  spring: cubicBezier(0.34, 1.4, 0.64, 1),
  card: cubicBezier(0.65, 0, 0.2, 1),
  lin: (t: number) => t,
};

const bez = (t: number, p0: number, c: number, p2: number) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p2;

interface Track { ch: string; from: number; to: number; t0: number; t1: number; ease?: Ease }
const T = (ch: string, from: number, to: number, t0: number, t1: number, ease: Ease = E.io): Track => ({ ch, from, to, t0, t1, ease });

interface Geo { pw: number; cw: number; H: number; dir: number }

const launchTracks = (g: Geo): Track[] => [
  T("w", g.pw, g.pw - 12, 0, 100, E.out),
  T("oInput", 1, 0, 0, 160, E.in),
  T("inScale", 1, 0.6, 0, 160, E.in),
  T("oGlow", 1, 0, 0, 300, E.out),
  T("w", g.pw - 12, BALL_SMALL, 100, 560, E.io),
  T("h", PILL_H, PILL_H + 6, 380, 500, E.out),
  T("h", PILL_H + 6, BALL_SMALL, 500, 620, E.out),
  T("oPill", 1, 0, 300, 560, E.out),
  T("oBall", 0, 1, 300, 560, E.out),
  T("u", 0, 1, 620, 1500, E.fly),
  T("w", BALL_SMALL, FLY_D, 620, 1300, E.grow),
  T("h", BALL_SMALL, FLY_D, 620, 1300, E.grow),
  T("w", FLY_D, ORB_D, 1300, 1500, E.out),
  T("h", FLY_D, ORB_D, 1300, 1500, E.out),
  T("cHalo", 0, 0.6, 620, 1500, E.out),
];

const ASSEMBLE: Track[] = [
  T("oRing", 1, 0, 0, 300, E.out),
  T("oBall", 1, 0, 0, 260, E.out),
  T("orb.k", 0, 1, 0, 800, E.out),
  T("orb.alpha", 0, 1, 0, 800, E.out),
  T("orb.spin", 0, 0.9, 0, 800, E.out),
  T("sOp", 0, 1, 300, 620, E.out),
  T("sTy", 6, 0, 300, 620, E.out),
];

const RESOLVE: Track[] = [
  T("orb.sweep", 0, 1, 0, 700, E.io),
  T("orb.spin", 0.9, 0.3, 0, 700, E.out),
  T("orb.gain", 1, 0, 0, 700, E.out),
  T("orb.floor", 0, 0.95, 400, 900, E.out),
];

const CONDENSE: Track[] = [
  T("sOp", 1, 0, 0, 160, E.in),
  T("sTy", 0, -6, 0, 160, E.in),
  T("orb.k", 1, 0, 120, 640, E.vortex),
  T("oGreen", 0, 1, 260, 700, E.spring),
  T("pulse", 0, 1, 320, 760, E.out),
  T("orb.alpha", 1, 0, 500, 800, E.out),
];

const unfoldTracks = (g: Geo, tw: number): Track[] => [
  T("w", ORB_D, 120, 0, 90, E.in),
  T("h", ORB_D, 120, 0, 90, E.in),
  T("w", 120, g.cw, 90, 700, E.card),
  T("h", 120, CARD_H, 90, 700, E.out),
  T("r", ORB_D / 2, 16, 90, 700, E.io),
  T("oGreen", 1, 0, 200, 560, E.out),
  T("oCard", 0, 1, 200, 560, E.out),
  T("hOp", 0, 1, 520, 840, E.out),
  T("wp", 0, 1, 600, 600 + tw, E.lin),
];

const R_OUT: Track[] = [
  T("oInput", 1, 0, 0, 140, E.out),
  T("oPill", 1, 0, 0, 200, E.out),
];
const R_IN: Track[] = [
  T("orb.alpha", 0, 1, 0, 200, E.out),
  T("sOp", 0, 1, 0, 200, E.out),
];
const R_RESOLVE: Track[] = [T("orb.sweep", 0, 1, 0, 250, E.io)];
const R_CONDENSE: Track[] = [
  T("oGreen", 0, 1, 0, 250, E.out),
  T("orb.alpha", 1, 0, 0, 250, E.out),
];
const R_GREEN_OUT: Track[] = [T("oGreen", 1, 0, 0, 120, E.out)];
const rCardIn = (tw: number): Track[] => [
  T("oCard", 0, 1, 0, 250, E.out),
  T("hOp", 0, 1, 0, 250, E.out),
  T("wp", 0, 1, 0, tw, E.lin),
];

const FADE = ["oGlow", "oPill", "oBall", "oGreen", "oCard", "oRing", "oInput", "sOp", "orb.alpha"];

const INIT: Record<string, number> = {
  h: PILL_H, r: 999, oGlow: 1, oPill: 1, oBall: 0, oGreen: 0, oCard: 0, oRing: 1, oInput: 1, inScale: 1,
  gs: 0.55, cs: 1, hOp: 0, dotS: 0, u: 0, yOff: 0, trail: 0, pulse: -1, sOp: 0, sTy: 6, cHalo: 0, wp: 0,
  "orb.k": 0, "orb.alpha": 0, "orb.spin": 0, "orb.pop": 1, "orb.sweep": 0, "orb.vortex": 0, "orb.gain": 1, "orb.floor": 0, "orb.rad": 0,
};

const RINGS = 14;
const DOT_LIST = (() => {
  const rand = mulberry32(7);
  const out: { x: number; y: number; z: number; u: number; seed: number }[] = [];
  for (let k = 0; k < RINGS; k++) {
    const y = 1 - ((k + 0.5) / RINGS) * 2;
    const r = Math.sqrt(1 - y * y);
    const m = Math.max(4, Math.round(24 * r));
    for (let j = 0; j < m; j++) {
      const a = (j / m) * TAU + k * 0.35;
      out.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r, u: (1 - y) / 2, seed: rand() * 6.283 });
    }
  }
  return out;
})();
const N = DOT_LIST.length;
const DX = Float32Array.from(DOT_LIST, (d) => d.x);
const DY = Float32Array.from(DOT_LIST, (d) => d.y);
const DZ = Float32Array.from(DOT_LIST, (d) => d.z);
const DU = Float32Array.from(DOT_LIST, (d) => d.u);
const DS = Float32Array.from(DOT_LIST, (d) => d.seed);

const G_STEPS = 20, A_STEPS = 36;
const COLORS: string[] = (() => {
  const out: string[] = [];
  for (let gi = 0; gi <= G_STEPS; gi++) {
    const g = gi / G_STEPS;
    const r = Math.round(lerp(204, 78, g)), gg = Math.round(lerp(85, 52, g)), b = Math.round(lerp(0, 46, g));
    for (let ai = 0; ai <= A_STEPS; ai++) out.push(`rgba(${r},${gg},${b},${(ai / A_STEPS).toFixed(3)})`);
  }
  return out;
})();

interface OrbParams {
  k: number; alpha: number; spin: number; rot: number; sweep: number; pop: number;
  vortex: number; gain: number; floor: number; rad: number; prog: number;
}
const ORB_KEYS = ["k", "alpha", "spin", "sweep", "pop", "vortex", "gain", "floor", "rad"] as const;

function createOrb(canvas: HTMLCanvasElement, getSpeed: () => number, isReduced: () => boolean) {
  const P: OrbParams = { k: 0, alpha: 0, spin: 0, rot: 0, sweep: 0, pop: 1, vortex: 0, gain: 1, floor: 0, rad: 0, prog: 0 };
  const ctx = canvas.getContext("2d");
  const lit = new Float32Array(N);
  const SX = new Float32Array(N), SY = new Float32Array(N), SR = new Float32Array(N), SD = new Float32Array(N);
  const SC = new Int16Array(N);
  let time = 0, raf = 0, last = 0, dead = false;

  const reset = () => {
    P.k = 0; P.alpha = 0; P.spin = 0; P.rot = 0; P.sweep = 0; P.pop = 1; P.vortex = 0; P.gain = 1; P.floor = 0; P.rad = 0; P.prog = 0;
    lit.fill(0);
    time = isReduced() ? 1.2 : 0;
  };
  reset();

  if (!ctx) return { P, ensure() {}, reset, destroy() {} };

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(CANVAS * dpr);
  canvas.height = Math.round(CANVAS * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const CP = Math.cos(0.35), SP = Math.sin(0.35), C0 = CANVAS / 2;

  const draw = (dt: number) => {
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    time += dt;
    P.rot += P.spin * dt;
    const yaw = P.rot + P.vortex, cyw = Math.cos(yaw), syw = Math.sin(yaw);

    for (let n = 0; n < N; n++) {
      const dx = DX[n], dy = DY[n], dz = DZ[n], u = DU[n];
      const ki = clamp01(P.k * 1.5 - 0.5 * u);
      if (ki <= 0.001) { SC[n] = -1; continue; }
      const eo = E.out(ki);

      const x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
      const y2 = dy * CP - z1 * SP, z2 = dy * SP + z1 * CP;
      const f = 2.8 / (2.8 - z2), depth = (z2 + 1) / 2;
      const ox = x1 * ORB_R * eo * f, oy = -y2 * ORB_R * eo * f;

      const g = clamp01((P.sweep * 1.4 - u) / 0.4);
      let a = 0.2 + 0.3 * depth + 0.5 * g;
      a = Math.max(a, P.floor * 0.7);
      if (a > 1) a = 1;
      a *= eo * P.alpha;

      SX[n] = C0 + ox;
      SY[n] = C0 + oy;
      SD[n] = depth;
      SR[n] = (1.1 * (0.5 + 0.5 * depth) * f + g * 0.2) * (0.4 + 0.6 * eo);
      const ai = Math.round(a * A_STEPS), gi = Math.round(g * G_STEPS);
      SC[n] = ai <= 0 ? -1 : gi * (A_STEPS + 1) + ai;
    }

    for (let pass = 0; pass < 2; pass++) {
      for (let n = 0; n < N; n++) {
        const c = SC[n];
        if (c < 0) continue;
        if ((SD[n] >= 0.5) !== (pass === 1)) continue;
        ctx.fillStyle = COLORS[c];
        ctx.beginPath();
        ctx.arc(SX[n], SY[n], SR[n], 0, TAU);
        ctx.fill();
      }
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (dead) return;
    const dt = isReduced() ? 0 : Math.max(0, Math.min(0.05, (now - last) / 1000)) * getSpeed();
    last = now;
    draw(dt);
    if (P.alpha > 0.002) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, CANVAS, CANVAS);
  };

  const ensure = () => {
    if (raf || dead || P.alpha <= 0.002) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const destroy = () => {
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  return { P, ensure, reset, destroy };
}

export default function MorphOrb(props: MorphOrbProps) {
  const [phase, setPhaseState] = useState<Phase>("idle");
  const [value, setValue] = useState("");
  const [lbl, setLbl] = useState<{ cur: string; prev: string | null; n: number }>({ cur: COPY.labels[0], prev: null, n: 0 });
  const [answer, setAnswer] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<any>(null);

  const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    if (!canvasRef.current) return;
    const orb = createOrb(canvasRef.current, () => 1, () => false);
    orbRef.current = orb;
    return () => orb.destroy();
  }, []);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || phase !== "idle") return;

    setPhaseState("think");
    if (orbRef.current) {
      orbRef.current.P.k = 1;
      orbRef.current.P.alpha = 1;
      orbRef.current.P.spin = 0.8;
      orbRef.current.ensure();
    }

    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % COPY.labels.length;
      setLbl({ cur: COPY.labels[idx], prev: null, n: idx });
    }, 800);

    let res = COPY.answerBody;
    if (props.onSubmit) {
      try {
        res = await Promise.resolve(props.onSubmit(text));
      } catch {}
    } else {
      await new Promise((r) => setTimeout(r, 2200));
      if (text.toLowerCase().includes("evacuat")) {
        res = "Follow yellow optical markers on the floor to Safe Refuge Bay 3. Do not use standard elevators.";
      } else if (text.toLowerCase().includes("gas") || text.toLowerCase().includes("methane")) {
        res = "Methane concentrations above 1.25% require immediate power shut-down and crew withdrawal according to CMR 2017.";
      } else {
        res = `Safety guidance for "${text}": Always verify your smart PPE sensor calibrations and adhere to Ad Marsal frontline protocol.`;
      }
    }

    clearInterval(timer);
    if (orbRef.current) {
      orbRef.current.P.sweep = 1;
      orbRef.current.P.alpha = 0.2;
    }
    setAnswer(res);
    setPhaseState("answered");
  };

  const onReset = () => {
    setValue("");
    setAnswer("");
    setPhaseState("idle");
    if (orbRef.current) orbRef.current.reset();
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-[460px] rounded-2xl border border-[#4e342e]/30 bg-[#f8f4e7] p-5 shadow-2xl backdrop-blur-md text-[#4e342e] font-sans"
      style={{
        boxShadow: "0 20px 40px rgba(78, 52, 46, 0.25)",
      }}
    >
      <div className="flex items-center justify-between border-b border-[#4e342e]/15 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4e342e] text-[#f8f4e7] shadow-sm">
            <span className="text-base">😊</span>
          </div>
          <div>
            <h4 className="m-0 text-sm font-bold text-[#4e342e]">Ad Marsal AI Safety Assistant</h4>
            <p className="m-0 text-[11px] text-[#cc5500] font-medium">Frontline Intelligence · 24/7 Active</p>
          </div>
        </div>
        {props.onClose && (
          <button
            onClick={props.onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#4e342e]/70 hover:bg-[#4e342e]/10 hover:text-[#4e342e] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {phase === "think" && (
        <div className="flex flex-col items-center justify-center py-6">
          <canvas ref={canvasRef} className="h-[120px] w-[120px]" />
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#cc5500] animate-pulse">
            <span>●</span>
            <span>{lbl.cur}…</span>
          </div>
        </div>
      )}

      {phase === "answered" && (
        <div className="py-2">
          <div className="rounded-xl border border-[#cc5500]/30 bg-[#efe6d5]/70 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#cc5500] mb-1.5">
              <span>🛡️</span>
              <span>{COPY.answerTitle}</span>
            </div>
            <p className="text-sm leading-relaxed text-[#4e342e] font-medium m-0">{answer}</p>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={onReset}
              className="text-xs font-bold text-[#cc5500] hover:text-[#4e342e] underline transition-colors"
            >
              ← {COPY.reset}
            </button>
            <span className="text-[11px] text-[#8d6e63]">Ground verified by CMR 2017</span>
          </div>
        </div>
      )}

      {phase === "idle" && (
        <form onSubmit={onFormSubmit} className="space-y-3">
          <p className="text-xs text-[#8d6e63] m-0">Ask anything regarding mine hazards, AR drills, smart PPE, or evacuation:</p>
          <div className="relative flex items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={COPY.placeholder}
              className="w-full rounded-xl border border-[#4e342e]/25 bg-white/80 px-3.5 py-3 pr-11 text-xs text-[#4e342e] placeholder-[#8d6e63]/70 shadow-inner focus:border-[#cc5500] focus:outline-none focus:ring-1 focus:ring-[#cc5500]"
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#4e342e] text-[#f8f4e7] transition hover:bg-[#cc5500] disabled:opacity-30"
            >
              →
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Highwall scan rules", "Haul truck blindspots", "Toxic gas PPM limits"].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setValue(prompt)}
                className="rounded-full border border-[#4e342e]/15 bg-[#efe6d5]/50 px-2.5 py-1 text-[10px] font-medium text-[#4e342e] hover:border-[#cc5500] hover:bg-[#efe6d5]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
