"use client";

import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "How do THUNNAL drops work?",
    answer: "THUNNAL operates on a limited drop release schedule. Each drop features a curated capsule collection of handwoven clothing. Once a drop sells out or the timer countdown expires, the collection is locked. Subscribing to our Studio Journal guarantees early access notifications before public drops go live."
  },
  {
    question: "What is Kasavu and where are the garments crafted?",
    answer: "Kasavu is the traditional gold-threaded border weave native to Kerala. All THUNNAL garments are handwoven and tailored in Kerala, India by local weavers. We combine centuries-old handloom techniques with modern, geometric silhouettes to preserve traditional craft while styling for contemporary contexts."
  },
  {
    question: "How do I care for handwoven cotton and linen garments?",
    answer: "To preserve the natural textures and the gold-threaded borders, we recommend hand washing cold with a mild, eco-friendly detergent. Do not wring or bleach. Lay flat to dry in the shade. Warm iron on the reverse side if necessary."
  },
  {
    question: "Do you ship worldwide and what is the return policy?",
    answer: "Yes, we offer complementary express worldwide shipping. Orders are processed within 24 hours and shipped via express courier. Due to the limited nature of our drops, size exchanges and returns are accepted within 14 days of delivery, provided the garment is unworn and tags remain attached."
  },
  {
    question: "How can I find my correct size?",
    answer: "Detailed sizing tables are available on each product details page. Our garments are cut in relaxed, comfortable fits. If you prefer a more tailored, narrow silhouette, you may select one size down. For a modern, oversized editorial drape, select your regular size."
  }
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-bg-primary border-t border-divider relative z-10">
      <div className="max-w-[1440px] mx-auto px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary-700 tracking-[0.25em] uppercase block mb-2">
            Have Questions?
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-primary uppercase">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordions List */}
        <div className="w-full max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className="border border-divider rounded-xl overflow-hidden mb-4 bg-bg-secondary/40 backdrop-blur-xs transition-editorial hover:border-gray-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left text-sm sm:text-base font-sans font-bold text-text-primary uppercase cursor-pointer hover:bg-gray-50/50 transition-editorial"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.question}</span>
                  <span className="text-primary-700 font-mono text-lg font-bold flex-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-divider p-6 bg-white/20" : "max-h-0"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
