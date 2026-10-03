import React, { useState, useRef, useEffect } from "react";
import {
  ShieldAlert,
  Flame,
  HardHat,
  Layers,
  Camera,
  Award,
  TrendingUp,
  HelpCircle,
  Settings,
  LogOut,
  Play,
  RotateCcw,
  Printer,
  ChevronRight,
  Volume2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import ContributionSkyline from "@/components/ui/contribution-skyline";

interface AdMarsalDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

interface Certificate {
  id: string;
  moduleName: string;
  date: string;
  score: number;
  recipient: string;
  certCode: string;
}

export default function AdMarsalDashboard({
  userEmail,
  onLogout,
}: AdMarsalDashboardProps) {
  const [activeTab, setActiveTab] = useState<"train" | "certification" | "growth" | "help">("train");
  const [language, setLanguage] = useState<"en" | "hi" | "sat">("en");
  const [showSettings, setShowSettings] = useState(false);

  // Derive user display name from email
  const userName = userEmail.includes("@")
    ? userEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : userEmail || "Kranti Patil";

  // AR Training Flow States
  const [selectedModule, setSelectedModule] = useState<{ id: string; title: string; category: string } | null>(null);
  const [arStep, setArStep] = useState<number>(0); // 0: not started, 1..4: instructions, 5: live AR test, 6: test summary
  const [arScore, setArScore] = useState<number>(94);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Certification Records
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "cert-01",
      moduleName: "Highwall Instability & Rockfall Mapping",
      date: "03 Oct 2026",
      score: 98,
      recipient: userName,
      certCode: "ADM-HW-2026-8812",
    },
    {
      id: "cert-02",
      moduleName: "Heavy Haul Truck Blind-Spot Simulation",
      date: "28 Sep 2026",
      score: 95,
      recipient: userName,
      certCode: "ADM-HT-2026-7491",
    },
    {
      id: "cert-03",
      moduleName: "Smart PPE & Thermal Fatigue Audit",
      date: "15 Sep 2026",
      score: 100,
      recipient: userName,
      certCode: "ADM-PPE-2026-6134",
    },
  ]);

  // Multilingual Texts
  const langText = {
    en: {
      train: "Train",
      certification: "Certification",
      growth: "Growth",
      help: "Help",
      welcome: `Welcome ${userName}`,
      greeting: "Good morning user, welcome to our AR based immersive training platform.",
      tagline: "Ad marsal your protective friend · Protect · Train · Empower",
      startModule: "Start Module",
      listen: "Listen (English)",
      step1Title: "Scan Your Surroundings",
      step1Desc: "Use your camera to scan the training area and highwall bench around you.",
      step2Title: "Identify the Type of Hazard",
      step2Desc: "Detect dynamic geological fracture lines, blind cones, or toxic gases in real-time.",
      step3Title: "Follow the Safety Rules",
      step3Desc: "Apply DGMS and CMR 2017 safety standoff boundaries and SCBA respirator procedures.",
      step4Title: "Make the Right Decision",
      step4Desc: "Execute swift evacuation or barrier positioning before the hazard window collapses.",
    },
    hi: {
      train: "प्रशिक्षण (Train)",
      certification: "प्रमाणपत्र (Certification)",
      growth: "प्रगति (Growth)",
      help: "सहायता (Help)",
      welcome: `नमस्ते ${userName}`,
      greeting: "सुप्रभात! हमारे संवर्धित वास्तविकता (AR) आधारित प्रशिक्षण मंच पर आपका स्वागत है।",
      tagline: "एड मार्सल - आपका सुरक्षा मित्र · सुरक्षा · प्रशिक्षण · सशक्तिकरण",
      startModule: "मॉड्यूल शुरू करें",
      listen: "सुनें (हिंदी)",
      step1Title: "1. कैमरे से आसपास स्कैन करें",
      step1Desc: "प्रशिक्षण क्षेत्र और खदान की दीवारों को अपने कैमरे से 360° स्कैन करें।",
      step2Title: "2. खतरे के प्रकार की पहचान करें",
      step2Desc: "पत्थर गिरने की दरारें, विशाल ट्रकों के ब्लाइंड स्पॉट या जहरीली गैस की पहचान करें।",
      step3Title: "3. सुरक्षा नियमों का पालन करें",
      step3Desc: "डीजीएमएस और सीएमआर 2017 सुरक्षा दिशानिर्देशों का अक्षरशः पालन करें।",
      step4Title: "4. सही त्वरित निर्णय लें",
      step4Desc: "सुरक्षित निकासी मार्ग चुनें और अपनी व साथियों की जान सुरक्षित करें।",
    },
    sat: {
      train: "ᱥᱮᱪᱮᱫ (Train)",
      certification: "ᱥᱟᱠᱷᱤ (Certification)",
      growth: "ᱞᱟᱦᱟᱱᱛᱤ (Growth)",
      help: "ᱜᱚᱲᱚ (Help)",
      welcome: `ᱡᱚᱦᱟᱨ ${userName}`,
      greeting: "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ! ᱟᱵᱚᱣᱟᱜ AR ᱵᱮᱵᱷᱟᱨ ᱠᱟᱛᱮ ᱥᱮᱪᱮᱫ ᱛᱷᱟᱱ ᱛᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾",
      tagline: "ᱟᱫ ᱢᱟᱨᱥᱟᱞ ᱟᱢᱤᱡ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱟᱛᱮ · ᱨᱩᱠᱷᱤᱭᱟᱹ · ᱥᱮᱪᱮᱫ · ᱫᱟᱲᱮ",
      startModule: "ᱮᱛᱚᱦᱚᱵᱽ ᱢᱮ",
      listen: "ᱟᱸᱡᱚᱢ ᱢᱮ (ᱥᱟᱱᱛᱟᱲᱤ)",
      step1Title: "᱑. ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱟᱰᱮᱯᱟᱥᱮ ᱧᱮᱞ ᱵᱤᱰᱟᱹᱣ ᱢᱮ",
      step1Desc: "ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛ ᱟᱨ ᱟᱰᱮᱯᱟᱥᱮ ᱠᱚ ᱥᱠᱮᱱ ᱢᱮ᱾",
      step2Title: "᱒. ᱵᱚᱛᱚᱨ ᱡᱤᱱᱤᱥ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ",
      step2Desc: "ᱫᱷᱤᱨᱤ ᱧᱩᱨᱩᱜ ᱯᱷᱟᱴᱟᱣ ᱟᱨ ᱵᱤᱥ ᱦᱚᱭ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾",
      step3Title: "᱓. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ ᱢᱟᱱᱟᱣ ᱢᱮ",
      step3Desc: "ᱥᱚᱨᱠᱟᱨᱟᱜ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱚᱢ ᱞᱮᱠᱟᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ᱾",
      step4Title: "᱔. ᱥᱟᱹᱨᱤ ᱟᱨ ᱞᱚᱜᱚᱱ ᱯᱷᱟᱹᱭᱥᱟᱞᱟ ᱦᱟᱛᱟᱣ ᱢᱮ",
      step4Desc: "ᱡᱤᱣᱤ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱹᱨᱤ ᱰᱟᱦᱟᱨ ᱛᱮ ᱩᱰᱩᱠᱚᱜ ᱢᱮ᱾",
    },
  }[language];

  // Steps definition for modal
  const steps = [
    {
      num: 1,
      title: langText.step1Title,
      desc: langText.step1Desc,
      icon: "📷",
    },
    {
      num: 2,
      title: langText.step2Title,
      desc: langText.step2Desc,
      icon: "⚠️",
    },
    {
      num: 3,
      title: langText.step3Title,
      desc: langText.step3Desc,
      icon: "🛡️",
    },
    {
      num: 4,
      title: langText.step4Title,
      desc: langText.step4Desc,
      icon: "🎯",
    },
  ];

  // Start Camera for interactive AR simulation
  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // Fallback to simulated feed if camera not available
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Speak audio instruction (TTS)
  const speakInstruction = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setAudioPlaying(true);
    const utter = new SpeechSynthesisUtterance(text);
    if (language === "hi") utter.lang = "hi-IN";
    else utter.lang = "en-US";
    utter.onend = () => setAudioPlaying(false);
    utter.onerror = () => setAudioPlaying(false);
    window.speechSynthesis.speak(utter);
  };

  // Complete AR Simulation
  const finishArTest = () => {
    stopCamera();
    const finalScore = Math.floor(92 + Math.random() * 8);
    setArScore(finalScore);
    setArStep(6); // Show results & certificate generation

    if (selectedModule) {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        moduleName: selectedModule.title,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        score: finalScore,
        recipient: userName,
        certCode: `ADM-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`,
      };
      setCertificates((prev) => [newCert, ...prev]);
    }
  };

  // AR Training Modules
  const trainingModules = [
    {
      id: "mod-1",
      category: "Geological Risk",
      title: "Highwall Instability & Rockfall Mapping",
      level: "Intermediate",
      duration: "15 min",
      accuracy: "99.2%",
      icon: <ShieldAlert className="h-6 w-6 text-[#cc5500]" />,
      desc: "Real-time LiDAR mesh mapping micro-fractures, rockfall trajectories, and safety buffer zones for quarry benches.",
      checklist: ["Highwall slope angle scan", "Fracture displacement tracking", "Exclusion zone establishment"],
    },
    {
      id: "mod-2",
      category: "Fleet Safety",
      title: "Heavy Haul Truck Blind-Spot Simulation",
      level: "Advanced",
      duration: "20 min",
      accuracy: "98.7%",
      icon: <Layers className="h-6 w-6 text-[#4e342e]" />,
      desc: "360-degree cockpit view overlaying dynamic blind-zone cones, pedestrian proximity alerts, and haul road intersection protocols.",
      checklist: ["Pre-ignition 3D walkaround", "Blind spot radar calibration", "Dump area reversing guidance"],
    },
    {
      id: "mod-3",
      category: "Life Safety",
      title: "Zero-Visibility Evacuation & Toxic Gas Drill",
      level: "Critical",
      duration: "10 min",
      accuracy: "99.8%",
      icon: <Flame className="h-6 w-6 text-[#cc5500]" />,
      desc: "Spatial AR pathfinding through dense smoke toward primary refuge chambers with real-time toxic gas threshold HUD.",
      checklist: ["SCBA mask seal verification", "Refuge chamber beacon lock", "Atmospheric air testing HUD"],
    },
    {
      id: "mod-4",
      category: "Worker Vitals",
      title: "Smart PPE & Thermal Fatigue Audit",
      level: "Beginner",
      duration: "8 min",
      accuracy: "99.5%",
      icon: <HardHat className="h-6 w-6 text-[#4e342e]" />,
      desc: "Edge-AI verification of chin straps, high-visibility vest retro-reflectivity, and wearable core thermal strain monitoring.",
      checklist: ["Biometric heart-rate check", "Helmet harness lock test", "Dust particulate filter rating"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f4e7] text-[#4e342e] font-sans transition-colors duration-300">
      {/* ── Top Navigation Bar with Glassmorphic Tab Bar & Settings ── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#4e342e]/15 bg-[#f8f4e7]/85 backdrop-blur-xl px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4e342e] text-[#f8f4e7] shadow-md font-bold text-lg tracking-wider">
              AM
            </div>
            <div>
              <span className="block text-sm font-extrabold tracking-widest text-[#4e342e]">AD MARSAL</span>
              <span className="block text-[10px] uppercase tracking-wider text-[#cc5500] font-semibold">AR Spatial Platform</span>
            </div>
          </div>

          {/* Center Glassmorphism Tab Bar */}
          <nav className="inline-flex items-center rounded-2xl border border-[#4e342e]/20 bg-[#efe6d5]/70 p-1 backdrop-blur-md shadow-inner">
            {[
              { id: "train", label: langText.train, icon: Play },
              { id: "certification", label: langText.certification, icon: Award },
              { id: "growth", label: langText.growth, icon: TrendingUp },
              { id: "help", label: langText.help, icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#4e342e] text-[#f8f4e7] shadow-md"
                      : "text-[#4e342e]/70 hover:text-[#4e342e] hover:bg-[#4e342e]/10"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Settings Button on the Right */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1.5 rounded-xl border border-[#4e342e]/20 bg-[#efe6d5]/70 px-3.5 py-2 text-xs font-semibold text-[#4e342e] shadow-sm backdrop-blur-md transition hover:border-[#cc5500] hover:bg-[#4e342e] hover:text-[#f8f4e7]"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Settings Dropdown Popover */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#4e342e]/20 bg-[#f8f4e7] p-4 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#4e342e]/15">
                  <span className="text-xs font-bold text-[#4e342e]">Language / भाषा / ᱯᱟᱹᱨᱥᱤ</span>
                  <button onClick={() => setShowSettings(false)} className="text-[#8d6e63] hover:text-[#4e342e]">✕</button>
                </div>

                <div className="mt-3 space-y-1.5">
                  {[
                    { code: "en", label: "English" },
                    { code: "hi", label: "हिन्दी (Hindi)" },
                    { code: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santhali)" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as any);
                        setShowSettings(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                        language === l.code
                          ? "bg-[#cc5500] text-[#f8f4e7] font-bold"
                          : "text-[#4e342e] hover:bg-[#efe6d5]"
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <CheckCircle className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#4e342e]/15">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4e342e] px-3 py-2 text-xs font-bold text-[#f8f4e7] transition hover:bg-[#cc5500]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout to Home</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Welcome Banner ── */}
      <section className="border-b border-[#4e342e]/10 bg-gradient-to-b from-[#efe6d5]/50 to-transparent px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#4e342e]">
                {langText.welcome}
              </h1>
              <p className="mt-1 text-sm font-medium text-[#4e342e]/80">
                {langText.greeting}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#cc5500]/30 bg-[#cc5500]/10 px-3 py-1 text-xs font-bold text-[#cc5500]">
                <span>⚡</span>
                <span>{langText.tagline}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-[#4e342e]/15 bg-[#efe6d5]/70 p-3 px-4 text-center">
                <span className="block text-xl font-extrabold text-[#cc5500]">{certificates.length}</span>
                <span className="block text-[11px] font-semibold text-[#8d6e63]">Certificates</span>
              </div>
              <div className="rounded-2xl border border-[#4e342e]/15 bg-[#efe6d5]/70 p-3 px-4 text-center">
                <span className="block text-xl font-extrabold text-[#4e342e]">97.4%</span>
                <span className="block text-[11px] font-semibold text-[#8d6e63]">Average Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Tab Views ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {/* TAB 1: TRAIN (AR MODULES) */}
        {activeTab === "train" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#4e342e]">Vocational Spatial AR Modules</h2>
                <p className="text-xs text-[#8d6e63]">Select any interactive scenario to launch immersive camera test</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {trainingModules.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#4e342e]/20 bg-[#efe6d5]/50 p-6 shadow-sm transition-all hover:border-[#cc5500] hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8f4e7] border border-[#4e342e]/15 shadow-inner">
                          {item.icon}
                        </div>
                        <div>
                          <span className="inline-block rounded-md bg-[#4e342e]/10 px-2 py-0.5 text-[11px] font-bold text-[#4e342e]">
                            {item.category}
                          </span>
                          <div className="text-xs text-[#8d6e63] mt-0.5 font-medium">
                            {item.level} · {item.duration}
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full border border-[#cc5500]/40 bg-[#cc5500]/10 px-2.5 py-0.5 text-xs font-bold text-[#cc5500]">
                        {item.accuracy} Target
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#4e342e]">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#4e342e]/85">{item.desc}</p>

                    <div className="mt-4 space-y-1.5 rounded-xl border border-[#4e342e]/15 bg-[#f8f4e7] p-3 text-xs text-[#4e342e]">
                      {item.checklist.map((pt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-[#cc5500] shrink-0" />
                          <span className="font-medium">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#4e342e]/10 pt-4">
                    <span className="text-xs font-semibold text-[#8d6e63]">DGMS Safety Compliant</span>
                    <button
                      onClick={() => {
                        setSelectedModule({ id: item.id, title: item.title, category: item.category });
                        setArStep(1); // Open step 1 of instructions
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#4e342e] px-4 py-2.5 text-xs font-bold text-[#f8f4e7] shadow transition hover:bg-[#cc5500] active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{langText.startModule}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATION */}
        {activeTab === "certification" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#4e342e]/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#4e342e]">Earned Vocational Certifications</h2>
                <p className="text-xs text-[#8d6e63]">Official Ad Marsal & Ministry verified AR training records</p>
              </div>
              <span className="rounded-full bg-[#cc5500] px-3 py-1 text-xs font-bold text-[#f8f4e7]">
                {certificates.length} Verified Credentials
              </span>
            </div>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#4e342e]/20 bg-[#efe6d5]/50 p-4 px-5 transition-all hover:border-[#cc5500] hover:bg-[#efe6d5] hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4e342e] text-[#f8f4e7] shadow-sm">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#4e342e] group-hover:text-[#cc5500] transition-colors">
                        {cert.moduleName}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-[#8d6e63]">
                        <span>Issued: {cert.date}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-[#cc5500] font-semibold">{cert.certCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-base font-extrabold text-[#cc5500]">{cert.score}%</span>
                      <span className="block text-[10px] uppercase font-bold text-[#4e342e]/60">Grade A</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4e342e]/10 group-hover:bg-[#cc5500] group-hover:text-[#f8f4e7] transition">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GROWTH (CONTRIBUTION SKYLINE) */}
        {activeTab === "growth" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#4e342e]">Workforce Preparedness & Growth Tracking</h2>
              <p className="text-xs text-[#8d6e63]">
                Visualizing frontline worker AR drill participation, frequency, and streak metrics across the past year.
              </p>
            </div>

            {/* Contribution Skyline Component Integration */}
            <div className="w-full">
              <ContributionSkyline palette="chocolate" defaultView="3d" />
            </div>

            {/* Growth Analytics Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#4e342e]/15 bg-[#efe6d5]/60 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8d6e63]">Safety Incident Reduction</span>
                <h3 className="mt-2 text-2xl font-extrabold text-[#4e342e]">-74.2%</h3>
                <p className="mt-1 text-xs text-[#8d6e63]">Compared to traditional classroom mock drills</p>
              </div>
              <div className="rounded-2xl border border-[#4e342e]/15 bg-[#efe6d5]/60 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8d6e63]">Reaction Speed Time</span>
                <h3 className="mt-2 text-2xl font-extrabold text-[#cc5500]">3.2 Sec</h3>
                <p className="mt-1 text-xs text-[#8d6e63]">From hazard cue to correct SCBA / evacuation decision</p>
              </div>
              <div className="rounded-2xl border border-[#4e342e]/15 bg-[#efe6d5]/60 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8d6e63]">Total Certified Workers</span>
                <h3 className="mt-2 text-2xl font-extrabold text-[#4e342e]">1,420+</h3>
                <p className="mt-1 text-xs text-[#8d6e63]">Active workers across opencast and underground pits</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HELP & EVOLUTION */}
        {activeTab === "help" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#4e342e]">How to Use Ad Marsal System</h2>
              <p className="text-xs text-[#8d6e63]">Simple step-by-step guide for trainees and frontline supervisors</p>
            </div>

            {/* Numbered Steps */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Select Scenario", text: "Choose your target scenario from Highwall, Haul Truck, Gas Drill, or PPE audit." },
                { step: "02", title: "Camera Calibration", text: "Point your smartphone or AR visor camera toward your training floor or workbench." },
                { step: "03", title: "Identify & React", text: "Detect simulated cracks, gas clouds, or vehicles and tap the correct safety procedure." },
                { step: "04", title: "Claim Certificate", text: "Receive real-time grading, benchmark feedback, and instant printable safety certification." },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl border border-[#4e342e]/20 bg-[#efe6d5]/60 p-5 relative overflow-hidden">
                  <span className="text-3xl font-black text-[#4e342e]/15 absolute top-2 right-3 select-none">{s.step}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4e342e] text-[#f8f4e7] text-xs font-bold mb-3">
                    {s.step}
                  </div>
                  <h4 className="text-sm font-bold text-[#4e342e]">{s.title}</h4>
                  <p className="mt-1 text-xs text-[#8d6e63] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>

            {/* Evolution Comparison Section */}
            <div className="rounded-2xl border border-[#4e342e]/20 bg-[#efe6d5]/40 p-6">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#cc5500]">System Evolution</span>
                <h3 className="text-lg font-bold text-[#4e342e]">Traditional Mock Drills vs. Ad Marsal Spatial AR</h3>
                <p className="text-xs text-[#8d6e63]">Why spatial AI preparedness outperforms legacy mining classroom methods</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#4e342e]/20 text-[#4e342e]">
                      <th className="py-3 px-4 font-bold">Feature</th>
                      <th className="py-3 px-4 font-bold text-[#8d6e63]">Traditional Drills</th>
                      <th className="py-3 px-4 font-bold text-[#cc5500]">Ad Marsal AR Drills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4e342e]/10 text-[#4e342e]">
                    <tr>
                      <td className="py-3 px-4 font-bold">Hazard Realism</td>
                      <td className="py-3 px-4 text-[#8d6e63]">Paper charts & static lecture videos</td>
                      <td className="py-3 px-4 font-semibold text-[#cc5500]">3D spatial mesh with interactive physics</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Worker Safety</td>
                      <td className="py-3 px-4 text-[#8d6e63]">Risk of injury during live pit mock demonstrations</td>
                      <td className="py-3 px-4 font-semibold text-[#cc5500]">100% zero-risk simulated environment</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Feedback Speed</td>
                      <td className="py-3 px-4 text-[#8d6e63]">Manual review after weeks</td>
                      <td className="py-3 px-4 font-semibold text-[#cc5500]">Instant edge-AI scoring & biometric log</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Multi-Language Support</td>
                      <td className="py-3 px-4 text-[#8d6e63]">Only standard English or Hindi text</td>
                      <td className="py-3 px-4 font-semibold text-[#cc5500]">Native voice & UI in Hindi, English & Santhali</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── AR Step-by-Step Guidance Modal (Matching Reference Image) ── */}
      {arStep >= 1 && arStep <= 4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-[#4e342e]/30 bg-[#f8f4e7] p-8 shadow-2xl text-center">
            {/* Close Button */}
            <button
              onClick={() => {
                setArStep(0);
                setSelectedModule(null);
              }}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-[#8d6e63] hover:bg-[#efe6d5] hover:text-[#4e342e]"
            >
              ✕
            </button>

            {/* Camera / Step Illustration */}
            <div className="mx-auto flex h-20 w-28 items-center justify-center rounded-2xl bg-[#efe6d5] shadow-inner text-4xl mb-4 border border-[#4e342e]/10">
              {steps[arStep - 1].icon}
            </div>

            {/* Step Counter */}
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc5500]">
              STEP {arStep} OF 4
            </span>

            {/* Step Title */}
            <h3 className="mt-2 text-xl font-extrabold text-[#4e342e]">
              {steps[arStep - 1].title}
            </h3>

            {/* Step Description */}
            <p className="mt-2 text-xs leading-relaxed text-[#4e342e]/80 max-w-xs mx-auto">
              {steps[arStep - 1].desc}
            </p>

            {/* Listen Button (matching photo) */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => speakInstruction(`${steps[arStep - 1].title}. ${steps[arStep - 1].desc}`)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4e342e]/30 bg-[#efe6d5]/80 px-5 py-2 text-xs font-bold text-[#4e342e] shadow-sm hover:border-[#cc5500] hover:bg-[#efe6d5] transition active:scale-95"
              >
                <Volume2 className={`h-4 w-4 ${audioPlaying ? "animate-bounce text-[#cc5500]" : "text-[#4e342e]"}`} />
                <span>{langText.listen}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (arStep < 4) {
                    setArStep(arStep + 1);
                  } else {
                    // Start Camera & Test
                    setArStep(5);
                    startCamera();
                  }
                }}
                className="w-full rounded-2xl bg-[#4e342e] py-3 text-xs font-bold text-[#f8f4e7] shadow-lg hover:bg-[#cc5500] transition active:scale-95"
              >
                {arStep === 4 ? "Launch Camera & AR Test →" : "Next Step →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AR Camera & Interactive Simulation View (Step 5) ── */}
      {arStep === 5 && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
          {/* Top HUD */}
          <div className="relative z-10 flex items-center justify-between bg-black/60 p-4 px-6 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">AR SPATIAL MESH ACTIVE</span>
                <h4 className="text-sm font-bold text-white">{selectedModule?.title}</h4>
              </div>
            </div>
            <button
              onClick={() => {
                stopCamera();
                setArStep(0);
              }}
              className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              Exit
            </button>
          </div>

          {/* Camera Viewport with AR Overlays */}
          <div className="relative flex-1 overflow-hidden bg-neutral-900 flex items-center justify-center">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            ) : (
              <div className="text-center p-6 text-neutral-400">
                <Camera className="mx-auto h-12 w-12 mb-2 text-[#cc5500] animate-pulse" />
                <p className="text-sm font-semibold">Simulated Spatial LiDAR Bench Feed</p>
                <p className="text-xs text-neutral-500">Camera access optional: 3D AR test runs in simulated mode</p>
              </div>
            )}

            {/* Spatial Hazard Detection Reticle Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-64 w-64 rounded-3xl border-2 border-dashed border-[#cc5500] animate-pulse flex items-center justify-center">
                <span className="absolute -top-3 bg-[#cc5500] text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white tracking-widest">
                  GEOLOGICAL MESH LOCK
                </span>
                <div className="text-center bg-black/70 p-3 rounded-xl backdrop-blur-sm border border-white/15">
                  <AlertTriangle className="mx-auto h-6 w-6 text-amber-400 mb-1" />
                  <span className="text-xs font-mono text-amber-300 font-bold">FRACTURE VELOCITY: 0.14 mm/s</span>
                  <p className="text-[10px] text-white/70 mt-0.5">Exclusion Distance: 15.2m Safe</p>
                </div>
              </div>
            </div>

            {/* Live Action Decision Panel at Bottom */}
            <div className="absolute bottom-8 z-20 w-full px-6 max-w-md">
              <div className="rounded-2xl border border-white/20 bg-black/80 p-4 backdrop-blur-md">
                <p className="text-xs font-semibold text-white/90 mb-3 text-center">
                  ⚠️ Action Required: Deploy safety standoff buffer or order evacuation?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={finishArTest}
                    className="rounded-xl bg-[#cc5500] py-2.5 text-xs font-bold text-white shadow hover:bg-orange-600 transition"
                  >
                    1. Set Standoff Zone
                  </button>
                  <button
                    onClick={finishArTest}
                    className="rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition"
                  >
                    2. Clear Quarry Bench
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AR Performance Score & Certificate Generation Modal (Step 6) ── */}
      {arStep === 6 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-[#4e342e]/30 bg-[#f8f4e7] p-8 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-3xl mb-3 shadow-inner">
              ✓
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">DRILL PASSED</span>
            <h3 className="mt-1 text-2xl font-extrabold text-[#4e342e]">Performance Score</h3>

            <div className="my-4 inline-flex items-baseline gap-1 rounded-2xl border border-[#cc5500]/30 bg-[#cc5500]/10 px-6 py-2">
              <span className="text-4xl font-black text-[#cc5500]">{arScore}</span>
              <span className="text-lg font-bold text-[#4e342e]">/ 100</span>
            </div>

            <div className="space-y-1.5 text-xs text-[#8d6e63] bg-[#efe6d5] p-3 rounded-xl text-left border border-[#4e342e]/10">
              <div className="flex justify-between">
                <span>Hazard Identification:</span>
                <span className="font-bold text-[#4e342e]">100%</span>
              </div>
              <div className="flex justify-between">
                <span>Reaction Latency:</span>
                <span className="font-bold text-[#4e342e]">2.8s (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Compliance:</span>
                <span className="font-bold text-[#4e342e]">Grade A (DGMS)</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-emerald-800 font-medium">
              🎉 New certificate generated and saved to your Certification tab!
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setArStep(1); // Retry
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#4e342e]/30 bg-[#efe6d5] py-2.5 text-xs font-bold text-[#4e342e] hover:bg-[#4e342e] hover:text-[#f8f4e7] transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Test</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setArStep(0);
                  setActiveTab("certification");
                }}
                className="rounded-xl bg-[#4e342e] py-2.5 text-xs font-bold text-[#f8f4e7] shadow hover:bg-[#cc5500] transition"
              >
                View Certificate →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Printable Certificate Modal ── */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#4e342e]/30 bg-[#fdfbf7] p-8 shadow-2xl text-[#4e342e]">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#efe6d5] text-[#8d6e63] hover:text-[#4e342e]"
            >
              ✕
            </button>

            {/* Printable Certificate Frame */}
            <div className="rounded-2xl border-4 border-double border-[#4e342e]/40 p-8 text-center bg-gradient-to-b from-white to-[#f8f4e7]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-[#4e342e] text-[#f8f4e7] font-bold flex items-center justify-center text-sm">
                  AM
                </div>
                <span className="text-sm font-extrabold tracking-widest text-[#4e342e]">AD MARSAL ACADEMY</span>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-[#cc5500]">
                MINISTRY OF MINES · VOCATIONAL SAFETY CREDENTIAL
              </span>

              <h2 className="mt-4 text-2xl font-serif font-black tracking-tight text-[#4e342e]">
                CERTIFICATE OF AR PROFICIENCY
              </h2>

              <p className="mt-2 text-xs text-[#8d6e63]">This certifies that frontline worker</p>
              <h3 className="mt-1 text-xl font-bold text-[#cc5500] underline underline-offset-4">
                {selectedCert.recipient}
              </h3>

              <p className="mt-3 text-xs leading-relaxed max-w-md mx-auto text-[#4e342e]/85">
                has successfully completed immersive spatial augmented reality simulation in{" "}
                <span className="font-bold text-[#4e342e]">{selectedCert.moduleName}</span> with an outstanding score of{" "}
                <span className="font-extrabold text-[#cc5500]">{selectedCert.score}%</span> adhering to DGMS safety standards.
              </p>

              <div className="mt-8 flex items-end justify-between border-t border-[#4e342e]/20 pt-4 text-xs">
                <div className="text-left">
                  <span className="block font-mono text-[10px] text-[#8d6e63]">CREDENTIAL ID</span>
                  <span className="font-mono font-bold text-[#cc5500]">{selectedCert.certCode}</span>
                  <span className="block text-[10px] text-[#8d6e63]">{selectedCert.date}</span>
                </div>

                <div className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cc5500] bg-[#cc5500]/10 text-xl font-bold text-[#cc5500] mx-auto mb-1">
                    🛡️
                  </div>
                  <span className="block text-[9px] uppercase tracking-wider font-bold text-[#8d6e63]">Official Verification</span>
                </div>

                <div className="text-right">
                  <span className="block font-serif italic text-sm text-[#4e342e]">Kranti Patil</span>
                  <span className="block text-[10px] font-bold text-[#8d6e63]">SAFETY DIRECTOR</span>
                </div>
              </div>
            </div>

            {/* Print & Close Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="rounded-xl border border-[#4e342e]/30 px-4 py-2 text-xs font-semibold text-[#4e342e] hover:bg-[#efe6d5]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#4e342e] px-5 py-2 text-xs font-bold text-[#f8f4e7] shadow hover:bg-[#cc5500] transition"
              >
                <Printer className="h-4 w-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
