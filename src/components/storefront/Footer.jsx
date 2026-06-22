"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }
    
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSuccess(true);
    setEmail("");
    
    // Auto reset success state after 5 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <footer className="bg-bg-primary border-t border-divider py-16 bg-editorial-grid relative z-10">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Newsletter Box */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <img 
              src="/logo.png" 
              alt="THUNNAL Logo" 
              className="h-20 sm:h-24 w-auto object-contain mb-4"
            />
            
            <p className="font-sans text-sm text-text-secondary leading-relaxed max-w-sm mb-2">
              Subscribe to receive notification of upcoming drop schedules, limited collections lookbooks, and brand journals.
            </p>

            {success ? (
              <div className="flex items-center gap-2 text-primary-700 font-bold text-sm py-3 px-6 bg-primary-50 dark:bg-primary-950/20 rounded-full animate-fade-in w-full max-w-sm justify-center border border-primary-100">
                <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>JOURNAL SUBSCRIPTION ACTIVATED</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="waiting-list" className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  error={error}
                  className="bg-bg-primary/50"
                  aria-label="Email address"
                />
                <Button type="submit" variant="primary" className="flex-none">
                  SUBSCRIBE
                </Button>
              </form>
            )}
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h4 className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-4">Collections</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><a href="/#collections" className="hover:text-text-primary transition-editorial">Drop 04 / Winter</a></li>
                <li><a href="/#collections" className="hover:text-text-primary transition-editorial">Drop 03 / Autumn</a></li>
                <li><a href="/#collections" className="hover:text-text-primary transition-editorial">Archive Lookbook</a></li>
                <li><a href="/#story" className="hover:text-text-primary transition-editorial">Sizing Guidelines</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-4">Customer Care</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><a href="/#care" className="hover:text-text-primary transition-editorial">Stitch Care Guide</a></li>
                <li><a href="/#faq" className="hover:text-text-primary transition-editorial">Drop FAQs</a></li>
                <li><a href="/#returns" className="hover:text-text-primary transition-editorial">Returns & Exchanges</a></li>
                <li><a href="/#contact" className="hover:text-text-primary transition-editorial">Contact Studio</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-4">Studio Journal</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-editorial">Instagram</a></li>
                <li><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-editorial">Pinterest</a></li>
                <li><a href="/#privacy" className="hover:text-text-primary transition-editorial">Privacy Policy</a></li>
                <li><a href="/#terms" className="hover:text-text-primary transition-editorial">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom info */}
        <div className="pt-8 border-t border-divider flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} THUNNAL. Decoupled and handcrafted. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-text-secondary opacity-60">
            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">Shopify Storefront Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
