import React, { useState } from "react";
import DefaultDemo from "@/components/ui/demo";
import { CardDealFlipDemo } from "@/components/tds/card-deal-flip/Demo";
import LoginModal from "@/components/auth/LoginModal";
import AdMarsalDashboard from "@/components/dashboard/AdMarsalDashboard";
import MorphOrb from "@/components/ui/ai-thiking-orb-and-input";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("pkranti280@gmail.com");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#f8f4e7]">
      {/* ── Main Conditional Content ── */}
      {isLoggedIn ? (
        <AdMarsalDashboard userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <main className="min-h-screen bg-[#ece8df]">
          {/* Ad Marsal Editorial Hero Poster */}
          <DefaultDemo onLogin={() => setShowLoginModal(true)} />

          {/* Card Deal Flip — 3-Section Scroll Story Section */}
          <section id="card-deal-flip" className="relative z-40 w-full">
            <CardDealFlipDemo />
          </section>

          {/* Login Modal */}
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </main>
      )}

      {/* ── Floating Sticky Chatbot Trigger (Bottom-Right on all pages) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        {showChatbot ? (
          <div className="mb-3 animate-in zoom-in-95 fade-in duration-200">
            <MorphOrb onClose={() => setShowChatbot(false)} />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setShowChatbot(!showChatbot)}
          className="group flex flex-col items-center focus:outline-none"
          aria-label="Open Ad Marsal Chatbot"
        >
          {/* Cute Smile Circle */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#cc5500] bg-[#4e342e] text-[#f8f4e7] shadow-[0_8px_25px_rgba(78,52,46,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#cc5500] group-hover:border-[#4e342e] active:scale-95">
            <span className="text-2xl select-none transition-transform duration-200 group-hover:rotate-12">
              😊
            </span>
          </div>

          {/* Label Below Circle */}
          <span className="mt-1.5 rounded-full border border-[#4e342e]/15 bg-[#f8f4e7]/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#4e342e] shadow-sm backdrop-blur-md group-hover:bg-[#4e342e] group-hover:text-[#f8f4e7] transition-colors">
            Your Chatbot
          </span>
        </button>
      </div>
    </div>
  );
}
