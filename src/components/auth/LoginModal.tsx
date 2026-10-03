import React, { useState } from "react";
import { Eye, EyeOff, LogIn, Zap, X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email || "pkranti280@gmail.com");
  };

  const handleQuickDemo = () => {
    setEmail("pkranti280@gmail.com");
    setPassword("admarsal2026");
    onLoginSuccess("pkranti280@gmail.com");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[390px] rounded-3xl border border-[#4e342e]/30 bg-[#f8f4e7] p-6 shadow-2xl text-[#4e342e]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-[#8d6e63] hover:bg-[#efe6d5] hover:text-[#4e342e] transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Google / Gmail Sign In */}
        <button
          type="button"
          onClick={() => onLoginSuccess("pkranti280@gmail.com")}
          className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#4e342e]/20 bg-white py-3 text-xs font-bold text-[#4e342e] shadow-sm transition hover:bg-[#efe6d5] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google / Gmail</span>
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#4e342e]/15" />
          <span className="text-[11px] font-medium text-[#8d6e63]">or sign in with</span>
          <div className="h-px flex-1 bg-[#4e342e]/15" />
        </div>

        {/* 1-Click Quick Demo Sign In */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#cc5500]/40 bg-[#cc5500]/10 py-3 text-xs font-bold text-[#cc5500] shadow-sm transition hover:bg-[#cc5500] hover:text-[#f8f4e7] active:scale-[0.98]"
        >
          <Zap className="h-4 w-4 fill-current" />
          <span>⚡ 1-Click Quick Demo Sign In</span>
        </button>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4e342e] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[#4e342e]/25 bg-white/90 px-3.5 py-2.5 text-xs text-[#4e342e] placeholder-[#8d6e63]/60 focus:border-[#cc5500] focus:outline-none focus:ring-1 focus:ring-[#cc5500]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4e342e] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#4e342e]/25 bg-white/90 px-3.5 py-2.5 pr-10 text-xs text-[#4e342e] placeholder-[#8d6e63]/60 focus:border-[#cc5500] focus:outline-none focus:ring-1 focus:ring-[#cc5500]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d6e63] hover:text-[#4e342e]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-[11px] font-semibold text-[#cc5500] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4e342e] py-3 text-xs font-bold text-[#f8f4e7] shadow-lg transition hover:bg-[#cc5500] active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#4e342e]/15" />
          <span className="text-[11px] font-medium text-[#8d6e63]">or</span>
          <div className="h-px flex-1 bg-[#4e342e]/15" />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#8d6e63]">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="font-bold text-[#cc5500] hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
