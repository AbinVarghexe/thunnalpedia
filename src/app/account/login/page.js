"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { HourBanner } from "@/components/storefront/HourBanner";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithAhoor, user, isLoading, error, initializeAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [ahoorLoading, setAhoorLoading] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setFormError(res.error || "Invalid credentials.");
    }
  };

  const handleAhoorLogin = async () => {
    setAhoorLoading(true);
    setFormError("");
    const res = await loginWithAhoor();
    setAhoorLoading(false);
    if (!res.success) {
      setFormError(res.error || "Ahoor sign in failed.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <HourBanner />
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-32 md:py-40 relative overflow-hidden">
        {/* Background grids / accents */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#E11D2E_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="w-full max-w-[460px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-divider/60 rounded-3xl p-8 md:p-10 shadow-elevated relative z-10 animate-fade-in">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-500 to-primary-800 bg-clip-text text-transparent mb-2">
              THUNNAL
            </h1>
            <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
              Sign In to Your Space
            </p>
          </div>

          {/* Social Sign In (Ahoor OAuth) */}
          <div className="mb-6">
            <button
              onClick={handleAhoorLogin}
              disabled={isLoading || ahoorLoading}
              className="w-full py-4 px-6 rounded-full border border-primary-500/20 hover:border-primary-500/50 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-zinc-950 dark:to-zinc-900 text-primary-700 hover:text-primary-800 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-soft hover:shadow-elevated disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {ahoorLoading ? (
                <svg className="animate-spin h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              )}
              {ahoorLoading ? "Connecting to Ahoor..." : "Continue with Ahoor"}
            </button>
          </div>

          <div className="relative flex py-3 items-center mb-6">
            <div className="flex-grow border-t border-divider/60"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-divider/60"></div>
          </div>

          {/* Core Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 rounded-2xl border border-divider bg-white/50 dark:bg-zinc-950/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm transition-all duration-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl border border-divider bg-white/50 dark:bg-zinc-950/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 text-sm transition-all duration-300"
              />
            </div>

            {(error || formError) && (
              <div className="p-4 rounded-2xl bg-primary-50 dark:bg-red-950/30 border border-primary-200/50 text-xs text-primary-700 dark:text-primary-400 font-semibold animate-shake">
                {formError || error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || ahoorLoading}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-bold text-sm transition-all duration-300 shadow-soft hover:shadow-elevated active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && !ahoorLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {isLoading && !ahoorLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Signup Switcher */}
          <div className="mt-8 text-center">
            <p className="text-xs text-text-secondary">
              New to THUNNAL?{" "}
              <button
                onClick={() => router.push("/account/signup")}
                className="font-bold text-primary-700 hover:text-primary-800 transition-colors duration-200 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
