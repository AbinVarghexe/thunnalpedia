"use client";

import React, { useState, useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUIStore();
  
  const cartItems = useCartStore((state) => state.cartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const triggerCheckout = useCartStore((state) => state.triggerCheckout);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const isUpdating = useCartStore((state) => state.isUpdating);

  useEffect(() => {
    if (cartOpen && typeof initializeCart === 'function') {
      initializeCart();
    }
  }, [cartOpen, initializeCart]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    
    if (promoCode.toUpperCase() === "KERALA10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code.");
      setPromoApplied(false);
    }
  };

  const finalSubtotal = getCartTotal();
  const discount = promoApplied ? finalSubtotal * 0.1 : 0;
  const total = finalSubtotal - discount;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-bg-primary border-l border-divider shadow-elevated z-50 transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-malayalam font-bold text-lg text-primary-700">തു</span>
            <h2 className="font-display font-extrabold text-lg uppercase tracking-wider text-text-primary">
              Shopping Cart
            </h2>
            {isUpdating && (
              <span className="w-4 h-4 rounded-full border-2 border-primary-700 border-t-transparent animate-spin ml-2"></span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:text-primary-700 transition-editorial text-text-secondary cursor-pointer"
            aria-label="Close Cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <span className="font-malayalam text-7xl text-primary-200/50">ത</span>
              <p className="font-sans text-sm text-text-secondary uppercase tracking-widest font-semibold">
                Your cart is empty
              </p>
              <Button variant="secondary" className="mt-2" onClick={() => setCartOpen(false)}>
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.variantId} 
                className="flex gap-4 pb-6 border-b border-divider/60 last:border-0 last:pb-0"
              >
                {/* Product thumbnail */}
                <div 
                  className="w-20 h-24 bg-gray-100 dark:bg-gray-800 rounded bg-cover bg-center flex-none border border-divider"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-sans font-bold text-sm text-text-primary uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        disabled={isUpdating}
                        className="text-xs text-text-secondary hover:text-primary-600 transition-editorial cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <p className="text-xs text-text-secondary mt-1 uppercase font-semibold">
                      Size: <span className="text-primary-700">{item.size}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-divider rounded-full h-8 px-1">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        disabled={isUpdating}
                        className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={isUpdating}
                        className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-text-primary">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions summary */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-divider bg-bg-secondary space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <Input
                placeholder="PROMO CODE (e.g. KERALA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="h-10 text-xs py-2 px-4"
                error={promoError}
                disabled={promoApplied}
              />
              <Button 
                type="submit" 
                variant="secondary" 
                className="h-10 min-h-0 text-xs px-4 py-2 flex-none whitespace-nowrap"
                disabled={promoApplied}
              >
                {promoApplied ? "APPLIED" : "APPLY"}
              </Button>
            </form>

            <div className="space-y-2.5 pt-2 text-sm font-sans">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">${finalSubtotal.toFixed(2)}</span>
              </div>
              
              {promoApplied && (
                <div className="flex justify-between text-primary-700 font-semibold">
                  <span>Promo Discount (10%)</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="uppercase text-[10px] tracking-widest font-bold text-primary-700 bg-primary-50 dark:bg-primary-950/20 px-2.5 py-0.5 rounded">
                  Complementary
                </span>
              </div>
              
              <div className="border-t border-divider my-2" />
              
              <div className="flex justify-between text-base font-bold text-text-primary">
                <span>Total Due</span>
                <span className="font-mono font-black">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full mt-4" 
              onClick={triggerCheckout}
              disabled={isUpdating}
            >
              {isUpdating ? "SYNCING..." : "PROCEED TO SECURE CHECKOUT"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
