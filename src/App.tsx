import { useState } from "react";
import DefaultDemo from "@/components/ui/demo";
import { CardDealFlipDemo } from "@/components/tds/card-deal-flip/Demo";
import {
  ShieldAlert,
  Glasses,
  Flame,
  HardHat,
  ArrowUpRight,
  Play,
  CheckCircle2,
  ChevronUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Modules" },
    { id: "hazard", label: "Hazard Detection" },
    { id: "machinery", label: "Heavy Machinery" },
    { id: "emergency", label: "Emergency Evacuation" },
    { id: "compliance", label: "PPE & Health" },
  ];

  const modules = [
    {
      id: "mod-1",
      category: "hazard",
      title: "Highwall Instability & Rockfall Mapping",
      tag: "Geological Risk",
      level: "Intermediate",
      duration: "15 min",
      accuracy: "99.2%",
      icon: <ShieldAlert className="h-5 w-5 text-amber-500" />,
      description:
        "Augmented reality spatial mesh mapping micro-fractures, rockfall velocity trajectories, and automated safety buffer perimeter generation for quarry benches.",
      checklist: ["Highwall slope angle scan", "Fracture displacement tracking", "Exclusion zone establishment"],
    },
    {
      id: "mod-2",
      category: "machinery",
      title: "Heavy Haul Truck Blind-Spot Simulation",
      tag: "Fleet Safety",
      level: "Advanced",
      duration: "20 min",
      accuracy: "98.7%",
      icon: <Layers className="h-5 w-5 text-blue-500" />,
      description:
        "360-degree cockpit view overlaying dynamic blind-zone cones, pedestrian proximity alerts, and haul road intersection right-of-way protocols.",
      checklist: ["Pre-ignition 3D walkaround", "Blind spot radar calibration", "Dump area reversing guidance"],
    },
    {
      id: "mod-3",
      category: "emergency",
      title: "Zero-Visibility Evacuation & Toxic Gas Drill",
      tag: "Life Safety",
      level: "Critical",
      duration: "10 min",
      accuracy: "99.8%",
      icon: <Flame className="h-5 w-5 text-rose-500" />,
      description:
        "Spatial AR pathfinding through dense smoke toward primary refuge chambers with real-time toxic gas threshold HUD simulation.",
      checklist: ["SCBA mask seal verification", "Refuge chamber beacon lock", "Atmospheric air testing HUD"],
    },
    {
      id: "mod-4",
      category: "compliance",
      title: "Smart PPE & Thermal Fatigue Audit",
      tag: "Worker Vitals",
      level: "Beginner",
      duration: "8 min",
      accuracy: "99.5%",
      icon: <HardHat className="h-5 w-5 text-emerald-500" />,
      description:
        "Automated edge-AI verification of chin straps, high-visibility vest retro-reflectivity, and wearable core thermal strain monitoring.",
      checklist: ["Biometric heart-rate check", "Helmet harness lock test", "Dust particulate filter rating"],
    },
  ];

  const filteredModules =
    activeCategory === "all"
      ? modules
      : modules.filter((m) => m.category === activeCategory);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#ece8df]">
      {/* Ad Marsal Editorial Hero Section */}
      <DefaultDemo />

      {/* AR Training Second Page Section */}
      <section
        id="ar-training"
        className="relative z-40 min-h-screen w-full scroll-mt-0 bg-slate-50 px-6 py-20 sm:py-28 text-slate-900 border-t border-slate-200/80 shadow-[0_-20px_50px_rgba(0,0,0,0.06)]"
      >
        <div className="mx-auto max-w-6xl">
          {/* Header Banner & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/60 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AD MARSAL VOCATIONAL TRAINING HUB</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                AR Training & Simulation
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                Step directly into real-time spatial augmented reality modules. Practice hazardous mine quarry procedures, emergency evacuation routes, and equipment operation in safe simulated environments.
              </p>
            </div>

            {/* Quick Return to Hero */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 self-start sm:self-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5"
            >
              <ChevronUp className="h-4 w-4" />
              <span>Back to Hero</span>
            </button>
          </div>

          {/* Key Metrics Row */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Hazard Accuracy</span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">99.4%</div>
              <span className="mt-1 inline-flex items-center text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> LiDAR Validated
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Modules</span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">12 Scenarios</div>
              <span className="mt-1 inline-flex items-center text-xs text-blue-600 font-medium">
                <Glasses className="mr-1 h-3.5 w-3.5" /> WebXR + Mobile AR
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trainees Certified</span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">1,480+</div>
              <span className="mt-1 inline-flex items-center text-xs text-slate-500 font-medium">
                Quarry & Mine Shifts
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Zero-Accident Goal</span>
              <div className="mt-1 text-2xl sm:text-3xl font-bold text-emerald-600">Vision Zero</div>
              <span className="mt-1 inline-flex items-center text-xs text-slate-500 font-medium">
                DGMS Standard Aligned
              </span>
            </div>
          </div>

          {/* Module Category Filter Pills */}
          <div className="mt-12 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Training Module Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredModules.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 shadow-inner">
                        {item.icon}
                      </div>
                      <div>
                        <span className="inline-block rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {item.tag}
                        </span>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.level} · {item.duration}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      {item.accuracy} Target
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* Syllabus Micro-checklist */}
                  <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                    {item.checklist.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Activity className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Live Simulation Ready</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSimulation(item.title)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-blue-600 active:scale-95"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Launch Module</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Simulation Modal / Notification banner */}
          {activeSimulation && (
            <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Glasses className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Module Initialized
                    </h4>
                    <p className="text-xs text-slate-600">{activeSimulation}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSimulation(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-600 animate-pulse" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">Loading WebXR Spatial Mesh...</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Card Deal Flip — 3-Section Scroll Story Section */}
      <section id="card-deal-flip" className="relative z-40 w-full">
        <CardDealFlipDemo onLaunch={(title) => setActiveSimulation(title)} />
      </section>
    </main>
  );
}
