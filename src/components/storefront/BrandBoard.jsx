"use client";

import React from "react";

export function BrandBoard() {
  return (
    <section id="story" className="py-24 bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-12">
          <span className="text-xs font-bold text-primary-700 tracking-[0.25em] uppercase block mb-2">
            Brand Ethos
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-primary uppercase">
            The Brand Board
          </h2>
        </div>

        {/* Asymmetric CSS Grid Moodboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[650px]">
          {/* Tile 1: Large Lifestyle Collage Frame */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-md group bg-primary-100 dark:bg-primary-950/20 p-8 flex flex-col justify-between min-h-[350px] border border-divider/40">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-primary-200/40 dark:to-primary-950/10 group-hover:scale-103 transition-editorial pointer-events-none" />
            
            {/* Massive background Malayalam character */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-malayalam font-bold text-[24vw] text-primary-200/30 dark:text-primary-800/10 select-none pointer-events-none z-0">
              ക
            </div>
            
            <div className="relative z-10 self-start">
              <span className="text-[10px] font-bold tracking-widest text-primary-700 bg-white/80 dark:bg-black/40 px-3 py-1.5 rounded-full uppercase">
                Artisanal Indigo
              </span>
            </div>

            <div className="relative z-10 self-end max-w-sm text-left">
              <h3 className="font-display font-black text-2xl uppercase mb-2 tracking-wide text-text-primary">
                Stitched Poetry
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Every thread is spun with purpose. Decoupled stitching lines reflect structural geometric alignment, designed to elevate raw cotton textiles.
              </p>
            </div>
          </div>

          {/* Tile 2: Cultural Quote Board */}
          <div className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-md group bg-primary-900 text-white p-8 flex flex-col justify-center border border-primary-800 shadow-soft">
            <span className="font-malayalam font-bold text-lg text-primary-300 mb-4 select-none">
              തുന്നലുകളിൽ ഒളിപ്പിച്ച കവിത.
            </span>
            <p className="font-sans text-xs tracking-widest leading-relaxed uppercase text-primary-100">
              "The poetry hidden inside stitches."
            </p>
            <div className="absolute bottom-4 right-6 w-12 h-12 rounded-full border border-white/5 flex items-center justify-center font-malayalam text-xl text-primary-400">
              തു
            </div>
          </div>

          {/* Tile 3: Ambient textile weaving frame */}
          <div className="md:col-span-1 md:row-span-2 relative overflow-hidden rounded-md group bg-zinc-50 dark:bg-zinc-900/30 p-8 flex flex-col justify-between min-h-[350px] border border-divider/40">
            <div className="absolute inset-0 bg-editorial-grid opacity-80 group-hover:scale-105 transition-editorial pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">
                Material Focus
              </span>
              <h3 className="font-display font-extrabold text-lg uppercase text-text-primary">
                100% Organic Raw Linen
              </h3>
            </div>

            {/* Graphic weave detail */}
            <div className="my-auto py-8 flex justify-center relative">
              <div className="w-20 h-20 rounded-full border border-dashed border-primary-500/30 animate-spin" style={{ animationDuration: '20s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center font-malayalam text-4xl text-primary-500 font-bold">
                ര
              </div>
            </div>

            <div className="relative z-10 text-xs text-text-secondary leading-relaxed">
              Locally sourced. Eco-responsibly harvested. Cultivated with traditional organic routines by Malabar weavers.
            </div>
          </div>

          {/* Tile 4: Brand Manifesto CTA */}
          <div className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-md group bg-bg-secondary p-8 flex flex-col justify-between border border-divider/40">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-primary-700 uppercase">
                Ethical Fashion
              </span>
              <h3 className="font-display font-black text-xl uppercase text-text-primary">
                The Thunnal Manifesto
              </h3>
            </div>

            <button 
              onClick={() => alert("Our manifesto is undergoing copywriting.")}
              className="text-xs font-bold text-primary-700 underline tracking-wider uppercase text-left hover:text-primary-800 transition-editorial cursor-pointer"
            >
              READ MANIFESTO →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
