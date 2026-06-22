"use client";

import React, { useEffect, useState, useRef } from "react";
import { shopifyFetch } from "@/lib/shopify/client";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

export function ProductScroll() {
  const [products, setProducts] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const { setCartOpen } = useUIStore();

  useEffect(() => {
    async function fetchProducts() {
      const response = await shopifyFetch({
        query: `
          query GetProducts {
            products(first: 8) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  images(first: 2) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        availableForSale
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `
      });
      if (response?.data?.products?.edges) {
        setProducts(response.data.products.edges.map(edge => edge.node));
      }
    }

    fetchProducts();
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollWidth = container.scrollWidth - container.clientWidth;
    if (scrollWidth <= 0) return;
    
    const progress = (container.scrollLeft / scrollWidth) * 100;
    setScrollProgress(progress);
  };

  const handleQuickAdd = (product, variant, size) => {
    addToCart({
      variantId: variant.id,
      title: product.title,
      price: variant.price.amount,
      currencyCode: variant.price.currencyCode,
      image: product.images.edges[0]?.node?.url || "/products/placeholder.png",
      handle: product.handle,
      size: size,
      quantity: 1
    });
    // Open the cart automatically
    setCartOpen(true);
  };

  return (
    <section id="collections" className="py-24 bg-bg-secondary border-y border-divider">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-primary-700 tracking-[0.25em] uppercase block mb-2">
              Discover Catalog
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-text-primary uppercase">
              Curated Collections
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-sans tracking-widest text-text-secondary uppercase select-none">
            <span>Swipe to explore</span>
            <svg className="w-4 h-4 animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Horizontal scroll snap wrapper */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto overflow-y-hidden pb-10 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const primaryImage = product.images?.edges?.[0]?.node?.url;
            const hoverImage = product.images?.edges?.[1]?.node?.url || primaryImage;
            const price = product.variants?.edges?.[0]?.node?.price;

            return (
              <div 
                key={product.id}
                className="flex-none w-[280px] sm:w-[320px] snap-align-start group relative bg-bg-primary border border-divider/60 rounded-md overflow-hidden transition-editorial shadow-soft hover:shadow-elevated"
              >
                {/* Image Link */}
                <a 
                  href={`/products/${product.handle}`}
                  className="block relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                  {/* Primary view */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${primaryImage})` }}
                  >
                    {/* Visual fallback decoration if actual image is missing */}
                    {!primaryImage && (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100/40 dark:bg-primary-950/10">
                        <span className="font-malayalam text-8xl text-primary-300/30">ത</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Secondary Hover view */}
                  {hoverImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      style={{ backgroundImage: `url(${hoverImage})` }}
                    />
                  )}
                </a>

                {/* Quick-add Size Drawer overlay (placed outside anchor to ensure semantic valid HTML) */}
                <div className="absolute inset-x-0 top-0 aspect-[4/5] pointer-events-none z-20 flex flex-col justify-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/85 via-black/60 to-transparent flex flex-col justify-end pt-12 pointer-events-auto">
                    <span className="text-[10px] font-bold text-primary-400 tracking-widest uppercase mb-2 text-center">
                      Quick Add Size
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {product.variants?.edges?.map((edge) => {
                        const variant = edge.node;
                        return (
                          <button
                            key={variant.id}
                            disabled={!variant.availableForSale}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickAdd(product, variant, variant.title);
                            }}
                            className={`min-w-[40px] h-10 px-2 rounded-full text-xs font-bold uppercase transition-editorial tracking-wider border ${
                              variant.availableForSale
                                ? "bg-white text-black border-white hover:bg-primary-700 hover:text-white hover:border-primary-700 cursor-pointer"
                                : "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
                            }`}
                          >
                            {variant.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Product Detail Info Link */}
                <a 
                  href={`/products/${product.handle}`}
                  className="p-5 flex flex-col gap-2 relative z-10 bg-bg-primary block hover:no-underline"
                >
                  <span className="text-[10px] font-bold tracking-widest text-primary-700 uppercase">
                    DROP EXCLUSIVE
                  </span>
                  
                  <div className="flex justify-between items-start">
                    <h3 className="font-sans font-semibold text-sm sm:text-base text-text-primary group-hover:text-primary-600 transition-editorial truncate pr-4">
                      {product.title}
                    </h3>
                    <span className="font-mono text-sm font-bold text-text-primary">
                      {price ? `$${parseFloat(price.amount).toFixed(0)}` : "$00"}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </a>
              </div>
            );
          })}
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full max-w-[400px] h-[3px] bg-divider rounded-full mx-auto relative overflow-hidden mt-6">
          <div 
            className="absolute left-0 top-0 h-full bg-primary-700 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
      
      {/* Horizontal bounce animation styling */}
      <style jsx global>{`
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1.2s infinite;
        }
      `}</style>
    </section>
  );
}
