"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById("collections");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center bg-gray-50 overflow-hidden py-32 rounded-b-[48px] z-10 isolate">
      {/* Full-Bleed Background Image directly placed under section */}
      <img 
        src="/Herosection.png"
        alt="THUNNAL Collection Drop 04 Background"
        className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center opacity-90 z-0 pointer-events-none"
      />
      {/* Left-to-right off-white gradient overlay restricted to the left 30% */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50 via-[30%] to-transparent z-10 pointer-events-none"></div>

      {/* Decorative Malayalam Background Typography Artwork */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-end pointer-events-none select-none z-10 w-1/2 overflow-hidden px-8 sm:px-16">
        <h2 className="font-malayalam font-bold text-[28vw] opacity-[0.04] leading-none whitespace-nowrap text-black">
          ത
        </h2>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-8 sm:px-12 relative z-20">
        {/* Text Content aligned to the left */}
        <div className="max-w-2xl flex flex-col items-start text-left">
          <span className="text-xs sm:text-sm font-bold text-primary-700 tracking-[0.3em] uppercase mb-4 animate-pulse">
            THUNNAL LABS // VOLUME 04
          </span>
          
          <h1 className="font-display font-extrabold text-clamp-hero leading-[0.95] tracking-tight mb-6 text-text-primary max-w-2xl">
            Where Apple meets <span className="text-brand-gradient">Malayalam</span> Typography.
          </h1>
          
          <p className="font-sans text-base sm:text-lg text-text-secondary leading-relaxed mb-10 max-w-xl">
            Introducing Drop 04. An editorial collision of contemporary silhouette styling, high-contrast typography, and handwoven kasavu stitching from the heart of Kerala. Decoupled, headless, and pure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button variant="primary" onClick={handleScrollToProducts}>
              DISCOVER THE COLLECTION
            </Button>
            <Button variant="secondary" onClick={() => alert("Manifesto page is in development.")}>
              EXPLORE THE STORY
            </Button>
          </div>
        </div>
      </div>

      {/* Featured label overlay at the bottom-right of the full bleed hero */}
      <div className="absolute bottom-8 right-8 z-20 text-right hidden sm:block">
        <p className="text-[10px] tracking-widest uppercase font-bold text-primary-700">FEATURING</p>
        <h3 className="text-sm font-bold tracking-wider text-text-primary uppercase mt-0.5">KASAVU TEXTILES & LINENS</h3>
      </div>
      
      {/* Dynamic Screen Size Typography Scaling helper */}
      <style jsx global>{`
        .text-clamp-hero {
          font-size: clamp(2.8rem, 6.5vw, 5.2rem);
        }
      `}</style>
    </section>
  );
}
