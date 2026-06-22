"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/Button";
import { FAQ } from "@/components/storefront/FAQ";

const MATERIAL_MAP = {
  "kasavu-shirt-metallic-gold": [
    { title: "Handwoven Kasavu", desc: "Traditional gold-threaded borders sourced from local handloom cooperatives." },
    { title: "Organic Cotton", desc: "Naturally grown, unbleached, and breathable raw cotton fibers." },
    { title: "Handspun Yarn", desc: "Spun by hand to create organic slub textures and structural durability." },
    { title: "Eco Dyes", desc: "Colored using plant-based organic pigments and safe washes." }
  ],
  "mundu-trousers-raw-cotton": [
    { title: "Overlapping Waist", desc: "Asymmetric front wrap mimicking the traditional Kerala Mundu drape." },
    { title: "Slub Cotton", desc: "Raw handspun ivory cotton with natural slub yarn imperfections." },
    { title: "Gold Kasavu Selvedge", desc: "A thin metallic border lining the interior overlap seam." },
    { title: "Reinforced Seams", desc: "Stitched with heavy organic thread for high-wear reliability." }
  ],
  "malabar-utility-jacket": [
    { title: "Double-Weave Texture", desc: "Heavyweight double-weave cotton fabric offering wind and light rain protection." },
    { title: "Indigo Piping", desc: "Stitch-framed with hand-dyed Malabar indigo cloth piping." },
    { title: "Magnetic Collapse", desc: "Hidden high-strength magnets along front placket for quick closure." },
    { title: "Utility Mount", desc: "Rear tool/canteen loops and cargo front pocket partitions." }
  ],
  "nilavilakku-oversized-tee": [
    { title: "280gsm Cotton", desc: "Ultra-heavyweight combed organic cotton for structured drop shoulder drape." },
    { title: "Cinnabar Graphic", desc: "Screen printed with natural mineral pigments representing the Kerala lamp." },
    { title: "Reinforced Ribbing", desc: "Thick double-stitch ribbed collar prevents stretching over time." },
    { title: "Carbon Black Wash", desc: "Eco-washed with pumice stone for a subtle, pre-worn vintage texture." }
  ]
};

const MOCK_REVIEWS = [
  {
    name: "Daniel S.",
    date: "March 12, 2026",
    rating: 5,
    fit: "True to size / Size Ordered: M",
    text: "The quality exceeded my expectations. Lightweight but feels durable. Perfect for daily wear."
  },
  {
    name: "Anjali R.",
    date: "March 10, 2026",
    rating: 5,
    fit: "Slightly oversized / Size Ordered: S",
    text: "Love the design and pockets. I wish it was slightly more fitted, but overall very comfortable."
  },
  {
    name: "Michael T.",
    date: "March 8, 2026",
    rating: 5,
    fit: "True to size / Size Ordered: L",
    text: "Super functional. The pockets actually make sense and the material feels premium."
  },
  {
    name: "Sarah M.",
    date: "March 5, 2026",
    rating: 5,
    fit: "Relaxed Fit / Size Ordered: M",
    text: "Perfect layering piece. Works with almost everything in my wardrobe."
  },
  {
    name: "Kevin J.",
    date: "March 2, 2026",
    rating: 4,
    fit: "True to size / Size Ordered: XL",
    text: "Great everyday vest. Light and breathable, but still structured."
  }
];

export default function ProductDetailsClient({ product, allProducts = [] }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const isUpdating = useCartStore((state) => state.isUpdating);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "Default");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [recentlyViewedHandles, setRecentlyViewedHandles] = useState([]);

  const primaryImage = product.images?.edges?.[selectedImageIndex]?.node?.url || product.images?.edges?.[0]?.node?.url;
  const price = product.variants?.edges?.[0]?.node?.price;

  // Track recently viewed products in localStorage
  useEffect(() => {
    if (product?.handle) {
      const viewed = JSON.parse(localStorage.getItem("thunnal_recently_viewed") || "[]");
      const updated = [product.handle, ...viewed.filter((h) => h !== product.handle)].slice(0, 6);
      localStorage.setItem("thunnal_recently_viewed", JSON.stringify(updated));
      setRecentlyViewedHandles(updated);
    }
  }, [product?.handle]);

  // Calculate discount percentage
  const originalPriceNum = product.originalPrice ? parseFloat(product.originalPrice) : 0;
  const priceNum = price ? parseFloat(price.amount) : 0;
  const discountPercent = originalPriceNum > priceNum ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100) : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }
    setSizeWarning(false);

    // Find the correct variant corresponding to selected size
    const matchedVariant = product.variants?.edges?.find(
      (edge) => edge.node.title.toUpperCase() === selectedSize.toUpperCase()
    )?.node;

    if (!matchedVariant) return;

    addToCart({
      variantId: matchedVariant.id,
      title: `${product.title} - ${selectedColor}`,
      price: matchedVariant.price.amount,
      currencyCode: matchedVariant.price.currencyCode,
      image: product.images?.edges?.[0]?.node?.url || "/products/placeholder.png",
      handle: product.handle,
      size: selectedSize,
      quantity: 1
    });

    setCartOpen(true);
  };

  const handleQuickAddRel = (relProduct) => {
    const defaultVariant = relProduct.variants?.edges?.[0]?.node;
    if (!defaultVariant) return;

    addToCart({
      variantId: defaultVariant.id,
      title: relProduct.title,
      price: defaultVariant.price?.amount || "0.00",
      currencyCode: defaultVariant.price?.currencyCode || "USD",
      image: relProduct.images?.edges?.[0]?.node?.url || "/products/placeholder.png",
      handle: relProduct.handle,
      size: "M", // Default fallback size for quick add
      quantity: 1
    });

    setCartOpen(true);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    if (sizeWarning) setSizeWarning(false);
  };

  // Recommendations: Other products excluding current
  const recommendedProducts = allProducts
    .filter((p) => p.handle !== product.handle)
    .slice(0, 5);

  // Recently Viewed: Match handles (excluding current product)
  const recentlyViewedProducts = allProducts
    .filter((p) => p.handle !== product.handle && recentlyViewedHandles.includes(p.handle))
    .slice(0, 5);

  const materials = MATERIAL_MAP[product.handle] || [
    { title: "Organic Sourcing", desc: "Sourced from eco-responsible, certified local agriculture." },
    { title: "Artisanal Stitching", desc: "Stitched and hand-detailed by skilled weavers in local studio cooperatives." },
    { title: "Premium Fibers", desc: "Hand-selected high-grade fibers for longevity and comfort." },
    { title: "Circular Finishing", desc: "Crafted with recyclable natural fibers and organic pigment dye washes." }
  ];

  return (
    <section className="py-12 bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-sans tracking-widest text-text-secondary uppercase mb-8 flex items-center gap-2">
          <a href="/" className="hover:text-primary-700 transition-editorial">Home</a>
          <span>/</span>
          <a href="/#collections" className="hover:text-primary-700 transition-editorial">Drop 04</a>
          <span>/</span>
          <span className="text-text-primary font-bold">{product.title}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Active Product Photo */}
            <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary rounded-lg border border-divider">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 hover:scale-103"
                style={{ backgroundImage: `url(${primaryImage})` }}
              >
                {!primaryImage && (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100/40">
                    <span className="font-malayalam text-9xl text-primary-300/35">ത</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Horizontal thumbnail strip */}
            {product.images?.edges?.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {product.images.edges.map((edge, idx) => {
                  const imgUrl = edge.node.url;
                  const isActive = idx === selectedImageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-none w-[70px] sm:w-[85px] aspect-[4/5] rounded-md overflow-hidden bg-bg-secondary border-2 transition-all duration-300 cursor-pointer ${
                        isActive ? "border-primary-700 scale-98 shadow-soft" : "border-divider/60 hover:border-gray-400"
                      }`}
                    >
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${imgUrl})` }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Purchase Form details */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            
            {/* Design Decorative Malayalam backdrop */}
            <div className="absolute right-0 top-0 font-malayalam font-bold text-[12vw] opacity-[0.02] text-primary-700 leading-none select-none pointer-events-none z-0">
              തു
            </div>

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-bold tracking-[0.25em] text-primary-700 uppercase">
                DROP EXCLUSIVE
              </span>
              
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight uppercase leading-tight">
                {product.title}
              </h1>

              {/* Stars Review meta */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-sans font-bold text-text-primary mt-0.5">
                  {product.rating || "4.8"}
                </span>
                <span className="text-xs font-sans text-text-secondary mt-0.5">
                  ({product.reviewCount || "1200"} Reviews)
                </span>
              </div>

              {/* Price Details with original crossed-out price */}
              <div className="flex items-baseline gap-3 mt-3">
                <p className="font-mono text-2xl font-bold text-text-primary">
                  {price ? `$${parseFloat(price.amount).toFixed(2)}` : "$0.00"}
                </p>
                {product.originalPrice && (
                  <>
                    <span className="font-mono text-sm text-text-secondary line-through">
                      ${parseFloat(product.originalPrice).toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase">
                      -{discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <hr className="border-divider" />

            {/* Description (with Show More/Less toggle) */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                Narrative
              </h3>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                {isDescExpanded 
                  ? product.description 
                  : `${product.description.slice(0, 140)}${product.description.length > 140 ? '...' : ''}`
                }
              </p>
              {product.description.length > 140 && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-xs font-bold text-primary-700 underline tracking-wider uppercase hover:text-primary-800 cursor-pointer block mt-1"
                >
                  {isDescExpanded ? "Show Less" : "Show More"}
                </button>
              )}
            </div>

            <hr className="border-divider" />

            {/* Color Swatch Picker */}
            {product.colors && (
              <div className="relative z-10 space-y-3">
                <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                  Color: <span className="text-text-primary font-bold">{selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => {
                    const isActive = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 cursor-pointer flex items-center justify-center ${
                          isActive 
                            ? "border-primary-700 ring-2 ring-primary-100 ring-offset-1" 
                            : "border-divider hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Select color ${color.name}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                  Select Size
                </h3>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-bold text-primary-700 underline tracking-wider uppercase hover:text-primary-800 cursor-pointer"
                >
                  View Size Guide
                </button>
              </div>

              <div className={`flex gap-3 p-1 rounded-lg transition-editorial ${sizeWarning ? "border border-primary-500/50 bg-primary-50/20" : ""}`}>
                {product.variants?.edges?.map((edge) => {
                  const variant = edge.node;
                  const isSelected = selectedSize === variant.title;
                  return (
                    <button
                      key={variant.id}
                      disabled={!variant.availableForSale}
                      onClick={() => handleSelectSize(variant.title)}
                      className={`min-w-[48px] h-12 rounded-full text-xs font-bold uppercase transition-editorial tracking-wider border flex items-center justify-center ${
                        !variant.availableForSale
                          ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed dark:bg-zinc-900/50"
                          : isSelected
                            ? "bg-primary-700 text-white border-primary-700 shadow-soft"
                            : "bg-white text-text-primary border-divider hover:border-primary-700 cursor-pointer"
                      }`}
                    >
                      {variant.title}
                    </button>
                  );
                })}
              </div>
              {sizeWarning && (
                <span className="text-[10px] font-bold text-primary-700 tracking-wider uppercase animate-pulse block mt-1">
                  Please select a size before adding to bag
                </span>
              )}
            </div>

            {/* Side-by-Side CTA Buttons */}
            <div className="flex gap-4 relative z-10 mt-2">
              <Button
                variant="primary"
                className="flex-1 h-14"
                onClick={handleAddToCart}
                disabled={isUpdating}
              >
                {isUpdating ? "SYNCING..." : "ADD TO BAG"}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 h-14 border border-divider hover:border-text-primary text-text-primary hover:bg-gray-50"
                onClick={() => alert("Studio stock finder is in development.")}
              >
                LOCATE IN STUDIO
              </Button>
            </div>

            <hr className="border-divider" />

            {/* Pair It With suggestions section */}
            {recommendedProducts.length > 0 && (
              <div className="relative z-10 space-y-4">
                <h3 className="text-xs font-bold tracking-wider text-text-secondary uppercase">
                  Pair It With
                </h3>
                
                <div className="flex flex-col gap-3">
                  {recommendedProducts.slice(0, 2).map((relProduct) => {
                    const relImage = relProduct.images?.edges?.[0]?.node?.url;
                    const relPrice = relProduct.variants?.edges?.[0]?.node?.price?.amount;
                    return (
                      <div 
                        key={relProduct.id} 
                        className="flex items-center gap-3 p-3 bg-bg-secondary border border-divider/60 rounded-lg hover:border-gray-300 transition-editorial"
                      >
                        <a href={`/products/${relProduct.handle}`} className="w-[60px] aspect-[4/5] rounded overflow-hidden flex-none bg-gray-100">
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${relImage})` }}
                          />
                        </a>
                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                          <a href={`/products/${relProduct.handle}`} className="font-sans font-semibold text-sm text-text-primary hover:text-primary-700 truncate block">
                            {relProduct.title}
                          </a>
                          <span className="font-mono text-xs text-text-secondary mt-0.5">
                            ${parseFloat(relPrice || "0").toFixed(0)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleQuickAddRel(relProduct)}
                          className="flex-none px-3 py-2 rounded-full text-[10px] font-bold bg-white hover:bg-primary-700 hover:text-white border border-divider hover:border-primary-700 uppercase transition-editorial cursor-pointer"
                        >
                          + ADD
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Detailed Zoom / Grid Close-ups (Similar to Reference Image, 2 columns with Text overlays) */}
        {product.lifestyleImages?.length > 0 && (
          <div className="my-16 space-y-6">
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-text-primary uppercase">
              Detailing & Craftsmanship
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-divider group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-103"
                  style={{ backgroundImage: `url(${product.lifestyleImages[0]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h4 className="font-display font-bold text-lg text-white uppercase mb-1">Weather-Ready Performance</h4>
                  <p className="text-[11px] text-gray-300 leading-normal max-w-sm">Designed to handle light rain and changing conditions with water-resistant finishes and durable construction.</p>
                </div>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-divider group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-103"
                  style={{ backgroundImage: `url(${product.lifestyleImages[1]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h4 className="font-display font-bold text-lg text-white uppercase mb-1">Functional Design</h4>
                  <p className="text-[11px] text-gray-300 leading-normal max-w-sm">Smart pocket systems and practical details keep your essentials organized wherever you go.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Materials Showcase Banner Section (Similar to Reference Image) */}
        <div className="my-16 p-8 md:p-12 rounded-2xl bg-bg-secondary border border-divider relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-editorial-grid opacity-20 pointer-events-none" />
          
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-text-primary uppercase mb-8 text-center relative z-10">
            Garment Fiber DNA
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-5xl relative z-10">
            {/* Left 2 callouts */}
            <div className="lg:col-span-4 flex flex-col gap-8 text-center lg:text-right">
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">{materials[0].title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{materials[0].desc}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">{materials[1].title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{materials[1].desc}</p>
              </div>
            </div>

            {/* Center Product Image callout */}
            <div className="lg:col-span-4 flex justify-center py-6">
              <div className="w-[180px] sm:w-[220px] aspect-[4/5] rounded-xl overflow-hidden shadow-elevated border border-divider animate-float bg-white">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.images?.edges?.[0]?.node?.url})` }}
                />
              </div>
            </div>

            {/* Right 2 callouts */}
            <div className="lg:col-span-4 flex flex-col gap-8 text-center lg:text-left">
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">{materials[2].title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{materials[2].desc}</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wide">{materials[3].title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{materials[3].desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Recommendations & Recently Viewed Section (Similar to Reference Image) */}
        <div className="my-16 border-t border-divider pt-12">
          {/* Tab Headers */}
          <div className="flex gap-8 border-b border-divider pb-4 mb-8">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`font-display font-extrabold text-lg sm:text-xl uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "recommendations" 
                  ? "text-primary-700 relative after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[3px] after:bg-primary-700" 
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              You May Also Like
            </button>
            <button
              onClick={() => setActiveTab("recentlyViewed")}
              className={`font-display font-extrabold text-lg sm:text-xl uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "recentlyViewed" 
                  ? "text-primary-700 relative after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[3px] after:bg-primary-700" 
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Recently Viewed
            </button>
          </div>

          {/* Tab Contents Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {activeTab === "recommendations" ? (
              recommendedProducts.slice(0, 4).map((relProduct) => {
                const relImage = relProduct.images?.edges?.[0]?.node?.url;
                const relHoverImage = relProduct.images?.edges?.[1]?.node?.url || relImage;
                const relPrice = relProduct.variants?.edges?.[0]?.node?.price;
                const relOrigPrice = relProduct.originalPrice;
                return (
                  <div key={relProduct.id} className="group flex flex-col border border-divider/60 rounded-lg overflow-hidden bg-bg-secondary hover:shadow-soft transition-editorial h-full justify-between">
                    <a href={`/products/${relProduct.handle}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-103"
                        style={{ backgroundImage: `url(${relImage})` }}
                      />
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 group-hover:scale-103 transition-all duration-700"
                        style={{ backgroundImage: `url(${relHoverImage})` }}
                      />
                    </a>
                    
                    <div className="p-4 bg-white border-t border-divider/40 space-y-2">
                      {/* Color dot swatches indicator */}
                      {relProduct.colors && (
                        <div className="flex gap-1.5 py-1">
                          {relProduct.colors.map((c) => (
                            <span 
                              key={c.name} 
                              className="w-2.5 h-2.5 rounded-full border border-divider" 
                              style={{ backgroundColor: c.hex }} 
                              title={c.name}
                            />
                          ))}
                        </div>
                      )}
                      
                      <a href={`/products/${relProduct.handle}`} className="font-sans font-semibold text-xs sm:text-sm text-text-primary hover:text-primary-700 truncate block">
                        {relProduct.title}
                      </a>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs sm:text-sm font-bold text-text-primary">
                          ${parseFloat(relPrice?.amount || "0").toFixed(0)}
                        </span>
                        {relOrigPrice && (
                          <span className="font-mono text-[10px] sm:text-xs text-text-secondary line-through">
                            ${parseFloat(relOrigPrice).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : recentlyViewedProducts.length > 0 ? (
              recentlyViewedProducts.slice(0, 4).map((relProduct) => {
                const relImage = relProduct.images?.edges?.[0]?.node?.url;
                const relHoverImage = relProduct.images?.edges?.[1]?.node?.url || relImage;
                const relPrice = relProduct.variants?.edges?.[0]?.node?.price;
                const relOrigPrice = relProduct.originalPrice;
                return (
                  <div key={relProduct.id} className="group flex flex-col border border-divider/60 rounded-lg overflow-hidden bg-bg-secondary hover:shadow-soft transition-editorial h-full justify-between">
                    <a href={`/products/${relProduct.handle}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-103"
                        style={{ backgroundImage: `url(${relImage})` }}
                      />
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 group-hover:scale-103 transition-all duration-700"
                        style={{ backgroundImage: `url(${relHoverImage})` }}
                      />
                    </a>
                    
                    <div className="p-4 bg-white border-t border-divider/40 space-y-2">
                      {/* Color dot swatches indicator */}
                      {relProduct.colors && (
                        <div className="flex gap-1.5 py-1">
                          {relProduct.colors.map((c) => (
                            <span 
                              key={c.name} 
                              className="w-2.5 h-2.5 rounded-full border border-divider" 
                              style={{ backgroundColor: c.hex }} 
                              title={c.name}
                            />
                          ))}
                        </div>
                      )}
                      
                      <a href={`/products/${relProduct.handle}`} className="font-sans font-semibold text-xs sm:text-sm text-text-primary hover:text-primary-700 truncate block">
                        {relProduct.title}
                      </a>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs sm:text-sm font-bold text-text-primary">
                          ${parseFloat(relPrice?.amount || "0").toFixed(0)}
                        </span>
                        {relOrigPrice && (
                          <span className="font-mono text-[10px] sm:text-xs text-text-secondary line-through">
                            ${parseFloat(relOrigPrice).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-12 bg-bg-secondary rounded-lg border border-divider">
                <p className="text-xs sm:text-sm text-text-secondary">No recently viewed items found. Explore other products in the drop first!</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Review Section (Similar to Reference Image) */}
        <div className="my-20 border-t border-divider pt-12">
          <div className="mb-8">
            <span className="text-xs font-bold text-primary-700 tracking-[0.25em] uppercase block mb-2">
              Studio Feedback
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary uppercase mb-2">
              Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
              Honest feedback from people who have integrated the THUNNAL drop items into their daily wardrobe, sharing their genuine experiences with stitching craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Left side: Rating summary */}
            <div className="space-y-6">
              <div className="bg-bg-secondary p-6 rounded-xl border border-divider flex flex-col gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-3xl text-text-primary">{product.rating || "4.87"}<span className="text-sm font-sans font-normal text-text-secondary"> out of 5</span></h3>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary">Based on {product.reviewCount || "323"} Reviews</p>
                </div>

                {/* Rating progress bars list */}
                <div className="space-y-2.5">
                  {[
                    { stars: 5, pct: 80 },
                    { stars: 4, pct: 12 },
                    { stars: 3, pct: 5 },
                    { stars: 2, pct: 2 },
                    { stars: 1, pct: 1 }
                  ].map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-text-secondary font-semibold">{bar.stars} stars</span>
                      <div className="flex-grow h-2 bg-divider rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.pct}%` }} />
                      </div>
                      <span className="w-8 text-text-secondary text-right font-semibold">{bar.pct}%</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => alert("Review posting functionality is in development.")}
                  variant="primary"
                  className="w-full mt-2 h-12 text-xs uppercase"
                >
                  Write a Review
                </Button>
              </div>
            </div>

            {/* Right side: Reviews list & uploaded images */}
            <div className="md:col-span-2 space-y-8">
              {/* Reviews with images */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-text-secondary uppercase">Reviews with images</h4>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.lifestyleImages?.map((url, idx) => (
                    <div key={idx} className="w-[80px] aspect-square rounded-lg border border-divider overflow-hidden bg-bg-secondary flex-none">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
                    </div>
                  ))}
                  <div className="w-[80px] aspect-square rounded-lg border border-divider overflow-hidden bg-bg-secondary flex-none flex items-center justify-center font-mono text-[10px] text-text-secondary font-bold">
                    + 12
                  </div>
                </div>
              </div>

              {/* Reviews Cards List */}
              <div className="divide-y divide-divider">
                {MOCK_REVIEWS.map((review, idx) => (
                  <div key={idx} className="py-6 first:pt-0 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="font-sans font-bold text-sm text-text-primary">{review.name}</span>
                        <p className="text-[10px] text-text-secondary">{review.date}</p>
                      </div>
                      
                      <div className="flex text-amber-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <span className="text-[10px] font-sans font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full uppercase inline-block">
                      {review.fit}
                    </span>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {review.text}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={() => alert("Thank you for your feedback.")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-divider hover:border-gray-400 bg-white text-[10px] font-bold text-text-primary uppercase transition-editorial cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.849 7.723c-.691.815-1.724 1.27-2.8 1.27H8.74c-1.03 0-1.974-.537-2.492-1.403L3.15 13.972a.75.75 0 0 1 .116-.925l2.42-2.42a1.5 1.5 0 0 1 1.06-.44h.027Z" />
                        </svg>
                        Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination buttons */}
              <div className="flex gap-1.5 justify-center pt-6">
                {[1, 2, 3, 4, 5, "...", 10].map((page, idx) => (
                  <button
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-editorial cursor-pointer ${
                      page === 1 
                        ? "bg-primary-700 text-white" 
                        : "hover:bg-gray-100 text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* trust Guarantee Banner block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-divider my-12 bg-bg-secondary rounded-lg">
          <div className="flex flex-col items-center text-center px-4 gap-2">
            <svg className="w-7 h-7 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 18.75h7.5M12 15.75h6.75m0 0H21a.75.75 0 0 0 .75-.75V9.75M21 9.75a3.75 3.75 0 0 0-3.75-3.75h-.75m-6 9v-9m-3 9v-9m0 0v-1.5a1.5 1.5 0 0 1 1.5-1.5h1.5A1.5 1.5 0 0 1 12 4.5v1.5m6 0v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1.5A1.5 1.5 0 0 0 15 4.5v1.5" />
            </svg>
            <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">Free Shipping</h4>
            <p className="text-xs text-text-secondary max-w-xs leading-relaxed">Enjoy complementary worldwide shipping on all drop orders.</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 gap-2 border-y md:border-y-0 md:border-x border-divider py-6 md:py-0">
            <svg className="w-7 h-7 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">30-Day Money-Back</h4>
            <p className="text-xs text-text-secondary max-w-xs leading-relaxed">Shop with absolute peace of mind with our returns policy.</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 gap-2">
            <svg className="w-7 h-7 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">Secure Checkout</h4>
            <p className="text-xs text-text-secondary max-w-xs leading-relaxed">Complete your transaction with bank-grade encryption protocols.</p>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-16">
          <FAQ />
        </div>

      </div>

      {/* Sizing Guidelines Modal overlay */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-bg-primary border border-divider rounded-2xl p-6 md:p-8 max-w-md w-[92%] shadow-elevated relative animate-scale-up text-sans">
            
            {/* Close trigger */}
            <button 
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-2 hover:bg-gray-100 rounded-full transition-editorial cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-display font-extrabold text-xl text-text-primary uppercase tracking-wide mb-2">
              Sizing Guidelines
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              Use this table to find your correct fit. All measurements are shown in inches. Fits true to size; for a relaxed visual shape, we recommend sizing up.
            </p>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-divider text-text-secondary font-bold">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Length</th>
                  <th className="py-2">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider font-mono text-text-primary font-semibold">
                <tr>
                  <td className="py-3 font-sans font-bold">S</td>
                  <td className="py-3">38" - 40"</td>
                  <td className="py-3">27.5"</td>
                  <td className="py-3">8.5"</td>
                </tr>
                <tr>
                  <td className="py-3 font-sans font-bold">M</td>
                  <td className="py-3">40" - 42"</td>
                  <td className="py-3">28.5"</td>
                  <td className="py-3">9.0"</td>
                </tr>
                <tr>
                  <td className="py-3 font-sans font-bold">L</td>
                  <td className="py-3">42" - 44"</td>
                  <td className="py-3">29.5"</td>
                  <td className="py-3">9.5"</td>
                </tr>
                <tr>
                  <td className="py-3 font-sans font-bold">XL</td>
                  <td className="py-3">44" - 46"</td>
                  <td className="py-3">30.5"</td>
                  <td className="py-3">10.0"</td>
                </tr>
              </tbody>
            </table>

            <Button
              onClick={() => setSizeGuideOpen(false)}
              variant="primary"
              className="w-full mt-6 h-12"
            >
              CLOSE GUIDE
            </Button>
          </div>
        </div>
      )}

      {/* Basic animations helper */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
