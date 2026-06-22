"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { searchProducts } from "@/lib/shopify/client";

export function Header() {
  const router = useRouter();
  const { toggleCart, bannerVisible, searchOpen, setSearchOpen } = useUIStore();
  const getCartCount = useCartStore((state) => state.getCartCount);
  const { user, logout, initializeAuth } = useAuthStore();
  const cartCount = getCartCount();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef(null);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const collectionRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 44) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (searchOpen) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMenuHovered(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setMenuHovered(false);
    }, 200); // 200ms grace period to transition cursor
  };

  const handleLinkMouseEnter = (index, ref) => {
    if (searchOpen) return;
    if (ref.current && navRef.current) {
      const linkRect = ref.current.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
      setHoveredIndex(index);
    }
  };

  const handleLinkMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchOpen &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target) &&
        !e.target.closest('[aria-label="Search"]') &&
        !e.target.closest('[aria-label="Close Search"]')
      ) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen, setSearchOpen]);

  // Handle Escape key to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  // Autofocus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchClick = () => {
    if (searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
    setSearchOpen(!searchOpen);
  };

  // Sync sliding indicator to current hover states or keep it active on Collection when dropdown is open
  useEffect(() => {
    if (menuHovered && collectionRef.current && navRef.current) {
      const collectionRect = collectionRef.current.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: collectionRect.left - navRect.left,
        width: collectionRect.width,
        opacity: 1,
      });
      setHoveredIndex(2); // Collection is index 2
    } else if (!menuHovered && hoveredIndex === null) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [menuHovered, hoveredIndex]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    if (isHome) {
      e.preventDefault();
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 w-[92%] max-w-[850px] ${
          isScrolled || !bannerVisible ? "top-4" : "top-[56px]"
        }`}
      >
        {/* Floating Pill Container */}
        <div
          className={`flex items-center justify-between w-full rounded-full border bg-bg-primary/90 backdrop-blur-md transition-all duration-500 shadow-soft ${
            isScrolled ? "py-2 px-6 border-divider" : "py-3 px-8 border-divider/50"
          }`}
        >
          {/* Left: Brand Logo */}
          <a href="/" className="flex items-center select-none flex-none">
            <img 
              src="/logo.png" 
              alt="THUNNAL Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-editorial hover:scale-102"
            />
          </a>

          {/* Center: Navigation / Search Input */}
          <div className="relative flex-1 flex items-center justify-center mx-2 sm:mx-4 h-[44px] overflow-hidden">
            {/* Center: Navigation Links with sliding background capsule animation */}
            <nav 
              ref={navRef}
              className={`relative flex items-center gap-0.5 sm:gap-2 text-[10px] sm:text-sm font-sans tracking-wider transition-all duration-300 ${
                searchOpen ? "opacity-0 pointer-events-none translate-y-2 scale-95" : "opacity-100 pointer-events-auto translate-y-0 scale-100"
              }`}
            >
              {/* Sliding backdrop capsule */}
              <div
                className={`absolute h-[36px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none ${
                  hoveredIndex === 2 ? "bg-primary-50" : "bg-gray-100"
                }`}
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {/* Link 0: Home */}
              <a
                ref={homeRef}
                href="/"
                onClick={(e) => handleNavClick(e, "top")}
                className={`px-3 sm:px-4 py-2 rounded-full uppercase font-semibold transition-colors duration-300 relative z-10 ${
                  hoveredIndex === 0 ? "text-primary-700" : "text-text-primary"
                }`}
                onMouseEnter={(e) => handleLinkMouseEnter(0, homeRef)}
                onMouseLeave={handleLinkMouseLeave}
              >
                Home
              </a>

              {/* Link 1: About */}
              <a 
                ref={aboutRef}
                href="/#story" 
                onClick={(e) => handleNavClick(e, "story")}
                className={`px-3 sm:px-4 py-2 rounded-full uppercase font-semibold transition-colors duration-300 relative z-10 ${
                  hoveredIndex === 1 ? "text-primary-700" : "text-text-primary"
                }`}
                onMouseEnter={(e) => handleLinkMouseEnter(1, aboutRef)}
                onMouseLeave={handleLinkMouseLeave}
              >
                About
              </a>

              {/* Link 2: Collection */}
              <a 
                ref={collectionRef}
                href="/#collections"
                onClick={(e) => handleNavClick(e, "collections")}
                className={`px-3 sm:px-4 py-2 rounded-full uppercase font-semibold transition-colors duration-300 relative z-10 cursor-pointer select-none ${
                  hoveredIndex === 2 || menuHovered ? "text-primary-700" : "text-text-primary"
                }`}
                onMouseEnter={() => {
                  handleMouseEnter();
                  handleLinkMouseEnter(2, collectionRef);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                  handleLinkMouseLeave();
                }}
              >
                Collection
              </a>
            </nav>

            {/* Inline Search Input */}
            <div 
              className={`absolute inset-0 flex items-center gap-2 max-w-[450px] mx-auto w-full transition-all duration-300 ${
                searchOpen ? "opacity-100 pointer-events-auto translate-y-0 scale-100" : "opacity-0 pointer-events-none -translate-y-2 scale-95"
              }`}
            >
              <svg className="w-4 h-4 text-text-secondary flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, fabrics, or collections..."
                className="w-full bg-transparent border-none text-xs sm:text-sm font-sans text-text-primary focus:outline-none placeholder:text-gray-400 font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800/40 rounded-full text-text-secondary flex-none"
                  aria-label="Clear Search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-none text-text-primary">
            <button 
              className={`hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-all duration-300 cursor-pointer flex items-center justify-center p-2 rounded-full ${
                searchOpen ? "text-primary-700 bg-gray-100 dark:bg-zinc-800/40" : ""
              }`}
              onClick={handleSearchClick}
              aria-label={searchOpen ? "Close Search" : "Search"}
            >
              {searchOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
            
            <div className="relative group">
              <button 
                className="hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-all duration-300 cursor-pointer flex items-center justify-center p-2 rounded-full relative"
                onClick={() => router.push("/account")}
                aria-label="Account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-zinc-900" />
                )}
              </button>

              {user && (
                <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-bg-primary/95 backdrop-blur-md border border-divider shadow-elevated rounded-2xl p-4 min-w-[180px] text-xs flex flex-col gap-2.5">
                    <div className="border-b border-divider pb-2">
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Logged In</p>
                      <p className="font-bold text-text-primary truncate">{user.firstName || "Customer"}</p>
                    </div>
                    <button 
                      onClick={() => router.push("/account")}
                      className="text-left hover:text-primary-700 font-bold transition-colors cursor-pointer"
                    >
                      My Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="text-left text-gray-500 hover:text-primary-700 font-bold transition-colors cursor-pointer border-t border-divider pt-2 mt-0.5"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleCart}
              className="relative hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-all duration-300 cursor-pointer flex items-center justify-center p-2 rounded-full"
              aria-label="Open Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[15px] h-3.5 px-0.5 text-[8px] font-bold text-white bg-primary-700 rounded-full animate-scale-up">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        <div
          ref={searchDropdownRef}
          className={`absolute left-1/2 w-full max-w-[820px] pt-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
            searchOpen && searchQuery.trim() !== ""
              ? "opacity-100 pointer-events-auto" 
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            transform: `translateX(-50%) ${searchOpen && searchQuery.trim() !== "" ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)'}`,
          }}
        >
          <div className="bg-bg-primary/95 backdrop-blur-md border border-divider rounded-2xl p-4 sm:p-6 shadow-elevated text-sans max-h-[400px] overflow-y-auto">
            {isSearching ? (
              <div className="flex flex-col gap-3 py-4">
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex-none"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex-none"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Products ({searchResults.length})
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.map((product) => {
                    const price = product.variants?.edges?.[0]?.node?.price;
                    const imageUrl = product.images?.edges?.[0]?.node?.url || "/placeholder.png";
                    return (
                      <a
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors duration-200 group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-divider/50 bg-gray-50 flex-none relative">
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-text-primary uppercase truncate group-hover:text-primary-700 transition-colors duration-200">
                            {product.title}
                          </h4>
                          <p className="text-xs text-text-secondary truncate mt-0.5">
                            {product.description}
                          </p>
                        </div>
                        <div className="text-right flex-none">
                          <p className="text-xs sm:text-sm font-bold text-primary-700">
                            {price ? `$${parseFloat(price.amount).toFixed(2)}` : "N/A"}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-text-secondary">
                  No results found for <span className="font-semibold text-text-primary">"{searchQuery}"</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Try searching for <span className="text-primary-600 font-medium">"Kasavu"</span>, <span className="text-primary-600 font-medium">"Trousers"</span>, or <span className="text-primary-600 font-medium">"Jacket"</span>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Mega Menu Dropdown */}
        <div
          className={`absolute left-1/2 w-full max-w-[820px] pt-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
            menuHovered 
              ? "opacity-100 pointer-events-auto" 
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            transform: `translateX(-50%) ${menuHovered ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)'}`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-bg-primary/95 backdrop-blur-md border border-divider rounded-2xl p-6 md:p-8 shadow-elevated grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-sans">
            <div>
              <h4 className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-3">TOPS</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Kasavu Shirts</span>
                  </a>
                </li>
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Oversized Tees</span>
                  </a>
                </li>
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Woven Linen</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-3">OUTERWEAR</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Chore Jackets</span>
                  </a>
                </li>
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Textured Kimonos</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-3">BOTTOMS</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Mundu Trousers</span>
                  </a>
                </li>
                <li>
                  <a href="/#collections" className="hover:text-text-primary transition-all duration-300 inline-flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">Relaxed Linen</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg flex flex-col justify-between border border-primary-100">
              <div>
                <h5 className="text-[10px] font-bold text-primary-700 tracking-widest uppercase mb-1">New Arrivals</h5>
                <p className="text-[11px] text-text-secondary leading-normal">Explore traditional craftsmanship blended with editorial cuts.</p>
              </div>
              <a href="/#collections" className="text-[10px] font-bold text-primary-700 underline tracking-wider uppercase mt-2 block hover:text-primary-800">
                Shop Drop 04
              </a>
            </div>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from going under the floating header on load (disabled on home page for full-bleed hero) */}
      {!isHome && (
        <div className={bannerVisible ? "h-28" : "h-16"} />
      )}
    </>
  );
}
