"use client";

import React, { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    quote: "THUNNAL delivers a completely unique aesthetic. The blend of minimalist Apple-inspired layout and traditional Malayalam typography makes each piece feel like wearable art.",
    author: "Aadithya K.",
    role: "Verified Purchaser",
  },
  {
    quote: "The raw cotton Mundu trousers are incredibly comfortable and beautifully tailored. You can feel the premium weight and craftsmanship of the weavers in every single stitch.",
    author: "Miriam S.",
    role: "Editorial Stylist",
  },
  {
    quote: "Headless checkout was instantaneous. The website loading speeds are incredible, and the product collection scroll layout is so satisfying to navigate.",
    author: "Gautham R.",
    role: "Tech Lead & Designer",
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      className="py-24 bg-bg-secondary border-t border-divider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-8 flex flex-col items-center">
        <span className="text-xs font-bold text-primary-700 tracking-[0.25em] uppercase mb-8">
          Social Proof
        </span>
        
        {/* Testimonial slider viewport */}
        <div className="w-full max-w-3xl min-h-[180px] flex items-center justify-center relative overflow-hidden mb-10">
          {TESTIMONIALS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ${
                  isActive 
                    ? "opacity-100 translate-y-0 relative" 
                    : "opacity-0 translate-y-4 pointer-events-none absolute"
                }`}
              >
                {/* Large Decorative Quotes Symbol */}
                <span className="font-malayalam text-6xl text-primary-300/40 select-none leading-none mb-4">
                  “
                </span>
                
                <blockquote className="font-sans text-lg sm:text-xl font-medium leading-relaxed text-text-primary max-w-2xl px-4">
                  {item.quote}
                </blockquote>
                
                <cite className="not-italic mt-6 flex flex-col items-center gap-0.5">
                  <span className="font-sans font-bold text-sm text-text-primary">
                    {item.author}
                  </span>
                  <span className="text-[10px] tracking-widest text-primary-700 uppercase font-semibold">
                    {item.role}
                  </span>
                </cite>
              </div>
            );
          })}
        </div>

        {/* Dot Pagination indicators */}
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex 
                  ? "bg-primary-700 w-5" 
                  : "bg-divider hover:bg-primary-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
