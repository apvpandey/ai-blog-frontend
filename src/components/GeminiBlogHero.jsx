import React from "react";
import { useNavigate } from "react-router-dom";

function StarIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M8 0 C8 0 8.5 5.5 10 8 C11.5 10.5 16 8 16 8 C16 8 11.5 7.5 10 10 C8.5 12.5 8 16 8 16 C8 16 7.5 12.5 6 10 C4.5 7.5 0 8 0 8 C0 8 4.5 8.5 6 6 C7.5 3.5 8 0 8 0Z"
        fill="white"
      />
    </svg>
  );
}

function GeminiIcon() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Dashed rotating ring */}
      <div
        className="absolute animate-spin-slow rounded-full"
        style={{
          width: "min(220px, 55vw)",
          height: "min(220px, 55vw)",
          border: "1.5px dashed rgba(99,102,241,0.5)",
        }}
      />

      {/* Dot on ring top */}
      <div
        className="absolute w-3 h-3 rounded-full bg-indigo-400"
        style={{
          top: "calc(50% - min(110px, 27.5vw))",
          left: "50%",
          transform: "translate(-50%, 0)",
          boxShadow: "0 0 10px #818cf8",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 rounded-3xl flex items-center justify-center"
        style={{
          width: "min(180px, 45vw)",
          height: "min(180px, 45vw)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bg" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#1e2c50" />
              <stop offset="100%" stopColor="#0f1623" />
            </radialGradient>
            <linearGradient
              id="gemGrad"
              x1="90"
              y1="8"
              x2="90"
              y2="172"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="30%" stopColor="#a78bfa" />
              <stop offset="60%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient
              id="shimmer"
              x1="0"
              y1="0"
              x2="180"
              y2="180"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {/* Card background */}
          <rect width="180" height="180" rx="36" fill="url(#bg)" />
          <rect width="180" height="180" rx="36" fill="url(#shimmer)" />

          {/* Gemini star shape */}
          <path
            d="M90 10
         C90 10 97 52 114 70
         C132 88 172 90 172 90
         C172 90 132 92 114 110
         C97 128 90 170 90 170
         C90 170 83 128 66 110
         C48 92 8 90 8 90
         C8 90 48 88 66 70
         C83 52 90 10 90 10Z"
            fill="url(#gemGrad)"
          />

          {/* Subtle highlight */}
          <path
            d="M90 10
         C90 10 95 42 108 60
         C121 76 150 82 160 90
         C150 90 121 88 108 90
         C95 92 90 100 90 100
         C90 100 85 92 72 90
         C59 88 30 90 20 90
         C30 90 59 88 72 70
         C85 52 90 10 90 10Z"
            fill="#ffffff"
            fillOpacity="0.07"
          />
        </svg>
      </div>
    </div>
  );
}

export default function GeminiBlogHero() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at 65% 40%, rgba(99,102,241,0.07) 0%, transparent 55%), #0d1117",
      }}
    >
      {/* Hero Section */}
      <section className="flex-1 flex items-center w-full px-6 sm:px-12 lg:px-20 xl:px-32 py-16 sm:py-24">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          {/* Left Content */}
          <div className="flex flex-col gap-6 w-full md:w-1/2 xl:w-[52%] text-center md:text-left">
            {/* Heading */}
            <div className="animate-fadein1">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                <span className="text-indigo-400">Create Blog</span>
                <br />
                <span className="text-white">through Gemini</span>
              </h1>
            </div>

            {/* Description */}
            <p className="animate-fadein2 text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              Transform your ideas into engaging blog posts effortlessly with
              the power of Gemini. Just share your topic, and let AI handle the
              writing while you focus on what matters most.
            </p>

            {/* CTA Button */}
            <div className="animate-fadein3 flex justify-center md:justify-start">
              <button
                onClick={() => navigate("/welcome")}
                className="group flex items-center gap-2 text-white font-semibold text-base sm:text-lg px-8 py-4 rounded-2xl transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                  boxShadow: "0 4px 28px rgba(99,102,241,0.4)",
                }}
              >
                Get Started
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M4 10h12M12 6l4 4-4 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Gemini Visual */}
          <div
            className="animate-fadein1 relative flex-shrink-0 flex items-center justify-center w-full md:w-1/2 xl:w-[44%]"
            style={{ height: "min(320px, 60vw)" }}
          >
            {/* Sparkles */}
            <div
              className="absolute animate-twinkle1 z-20"
              style={{ top: "8%", left: "8%" }}
            >
              <StarIcon size={22} className="opacity-70" />
            </div>
            <div
              className="absolute animate-twinkle2 z-20"
              style={{ top: "4%", right: "10%" }}
            >
              <StarIcon size={14} className="opacity-50" />
            </div>
            <div
              className="absolute animate-twinkle3 w-3 h-3 rounded-full bg-indigo-300 z-20"
              style={{ right: "6%", top: "48%", boxShadow: "0 0 8px #818cf8" }}
            />
            <div
              className="absolute animate-twinkle2 z-20"
              style={{ bottom: "10%", right: "15%" }}
            >
              <StarIcon size={18} className="opacity-60" />
            </div>
            <div
              className="absolute animate-twinkle1 z-20"
              style={{ bottom: "16%", left: "12%" }}
            >
              <StarIcon size={12} className="opacity-40" />
            </div>

            <GeminiIcon />
          </div>
        </div>
      </section>
    </div>
  );
}
