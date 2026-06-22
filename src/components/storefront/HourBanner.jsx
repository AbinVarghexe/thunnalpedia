"use client";

import React, { useState, useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export function HourBanner() {
  const bannerVisible = useUIStore((state) => state.bannerVisible);
  const hideBanner = useUIStore((state) => state.hideBanner);

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 23);
    targetDate.setMinutes(targetDate.getMinutes() + 59);
    targetDate.setSeconds(targetDate.getSeconds() + 59);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!bannerVisible) return null;

  const formatNumber = (num) => String(num).padStart(2, "0");

  return (
    <div className="absolute top-0 left-0 w-full bg-[#A51717] text-white text-xs font-sans py-3 px-6 flex items-center justify-between gap-4 border-b border-white/10 z-50 transition-all duration-500">
      {/* Promo Info */}
      <div className="flex items-center gap-2 truncate">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse flex-none"></span>
        <span className="font-bold tracking-widest uppercase truncate">
          COMPLEMENTARY SHIPPING WORLDWIDE // USE CODE KERALA10 // DROP 04
        </span>
      </div>
      
      {/* Ticking timer + Close Action */}
      <div className="flex items-center gap-4 flex-none">
        <div className="hidden md:flex items-center gap-1 font-mono text-xs tracking-wider font-bold text-primary-200">
          <span>LIVE IN:</span>
          <span>[</span>
          <span>{formatNumber(timeLeft.hours)}</span>
          <span>:</span>
          <span>{formatNumber(timeLeft.minutes)}</span>
          <span>:</span>
          <span>{formatNumber(timeLeft.seconds)}</span>
          <span>]</span>
        </div>

        <a 
          href="#collections" 
          className="underline hover:text-primary-200 uppercase tracking-wider font-bold text-[10px] sm:text-xs transition-editorial"
        >
          SHOP NOW
        </a>

        {/* Close Icon Button */}
        <button
          onClick={hideBanner}
          className="hover:text-primary-300 transition-editorial p-1 cursor-pointer flex-none"
          aria-label="Close Announcement Banner"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
