"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { HourBanner } from "@/components/storefront/HourBanner";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, addAddress, updateAddress, deleteAddress, initializeAuth, isInitialized } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState("orders"); // orders, addresses, settings
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  // Address Form State
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("India");
  const [zip, setZip] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/account/login");
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-primary items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-700" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddress1(addr.address1);
    setCity(addr.city);
    setProvince(addr.province || "");
    setCountry(addr.country || "India");
    setZip(addr.zip);
    setShowAddressForm(true);
  };

  const handleCancelAddress = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddress1("");
    setCity("");
    setProvince("");
    setCountry("India");
    setZip("");
    setAddressError("");
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError("");
    setAddressLoading(true);

    if (!address1 || !city || !zip) {
      setAddressError("Please fill in address, city, and zip code.");
      setAddressLoading(false);
      return;
    }

    const addressPayload = { address1, city, province, country, zip };
    let res;

    if (editingAddressId) {
      res = await updateAddress(editingAddressId, addressPayload);
    } else {
      res = await addAddress(addressPayload);
    }

    setAddressLoading(false);
    if (res.success) {
      handleCancelAddress();
    } else {
      setAddressError(res.error || "Failed to save address.");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <HourBanner />
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-32 md:py-40">
        {/* Editorial Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-divider pb-6 mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-primary-700 tracking-widest uppercase mb-1">
              Storefront Account
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              ഹലോ, {user.firstName || "Customer"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-text-secondary">
              Logged in as: <strong className="text-text-primary">{user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-divider hover:border-primary-500 hover:text-primary-700 text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 lg:border-r border-divider pb-4 lg:pb-0 lg:pr-6 whitespace-nowrap">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition-all duration-300 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-primary-50 text-primary-700 dark:bg-zinc-900"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-900/50 text-text-secondary"
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition-all duration-300 cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-primary-50 text-primary-700 dark:bg-zinc-900"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-900/50 text-text-secondary"
              }`}
            >
              Address Book ({user.addresses?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition-all duration-300 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-primary-50 text-primary-700 dark:bg-zinc-900"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-900/50 text-text-secondary"
              }`}
            >
              Profile Settings
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight mb-4">Past Orders</h2>
                
                {!user.orders || user.orders.length === 0 ? (
                  <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-divider/60 rounded-3xl p-10 text-center">
                    <p className="text-text-secondary text-sm mb-4">No order records found in this account.</p>
                    <button
                      onClick={() => router.push("/#collections")}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 text-white text-xs font-bold shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer active:scale-95"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-divider/60 rounded-3xl p-6 shadow-soft hover:border-divider transition-all duration-300"
                      >
                        {/* Order info summary */}
                        <div className="flex flex-wrap items-center justify-between border-b border-divider pb-4 mb-4 gap-2">
                          <div>
                            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">
                              Order ID
                            </p>
                            <h3 className="text-sm font-extrabold text-primary-800">
                              #{order.orderNumber}
                            </h3>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">
                              Date Placed
                            </p>
                            <p className="text-xs font-semibold text-text-primary">
                              {formatDate(order.processedAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">
                              Total
                            </p>
                            <p className="text-xs font-bold text-text-primary">
                              ${parseFloat(order.totalPrice.amount || "0").toFixed(2)} {order.totalPrice.currencyCode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.financialStatus === "PAID"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700"
                            }`}>
                              {order.financialStatus}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.fulfillmentStatus === "DELIVERED"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                                : order.fulfillmentStatus === "IN_TRANSIT"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 animate-pulse"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {order.fulfillmentStatus?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Order Line Items */}
                        <div className="space-y-4">
                          {order.lineItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-14 h-16 rounded-xl border border-divider overflow-hidden bg-gray-50 flex-none relative">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold truncate text-text-primary uppercase tracking-wide">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-text-secondary font-medium">
                                  Size: {item.variantTitle || "Default"} | Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right flex-none">
                                <p className="text-xs font-bold text-text-primary">
                                  ${parseFloat(item.price || "0").toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold tracking-tight">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold transition-all duration-300 cursor-pointer shadow-soft active:scale-95 flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Address
                    </button>
                  )}
                </div>

                {/* Inline Address Book Form */}
                {showAddressForm && (
                  <div className="bg-white/80 dark:bg-zinc-900/80 border border-primary-500/20 rounded-3xl p-6 mb-6 shadow-soft animate-scale-up">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700 mb-4">
                      {editingAddressId ? "Modify Shipping Address" : "Register Shipping Address"}
                    </h3>

                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="address1" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                          Street Address
                        </label>
                        <input
                          id="address1"
                          type="text"
                          required
                          value={address1}
                          onChange={(e) => setAddress1(e.target.value)}
                          placeholder="e.g. 123 Main St, Floor 4"
                          className="w-full px-4 py-2.5 rounded-xl border border-divider text-xs bg-bg-primary/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Kochi"
                            className="w-full px-4 py-2.5 rounded-xl border border-divider text-xs bg-bg-primary/50"
                          />
                        </div>
                        <div>
                          <label htmlFor="province" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            State / Province
                          </label>
                          <input
                            id="province"
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            placeholder="e.g. Kerala"
                            className="w-full px-4 py-2.5 rounded-xl border border-divider text-xs bg-bg-primary/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="country" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            Country
                          </label>
                          <input
                            id="country"
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="e.g. India"
                            className="w-full px-4 py-2.5 rounded-xl border border-divider text-xs bg-bg-primary/50"
                          />
                        </div>
                        <div>
                          <label htmlFor="zip" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            Zip / Postal Code
                          </label>
                          <input
                            id="zip"
                            type="text"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="e.g. 682018"
                            className="w-full px-4 py-2.5 rounded-xl border border-divider text-xs bg-bg-primary/50"
                          />
                        </div>
                      </div>

                      {addressError && (
                        <div className="p-3 rounded-xl bg-primary-50 text-[11px] text-primary-700 font-semibold">
                          {addressError}
                        </div>
                      )}

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleCancelAddress}
                          className="px-4 py-2 rounded-full border border-divider hover:bg-gray-50 text-xs font-bold transition-all duration-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addressLoading}
                          className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 shadow-soft"
                        >
                          {addressLoading ? "Saving Address..." : "Save Address"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Addresses Grid */}
                {!user.addresses || user.addresses.length === 0 ? (
                  <div className="bg-white/60 dark:bg-zinc-900/60 border border-divider/60 rounded-3xl p-8 text-center text-text-secondary text-sm">
                    No shipping addresses registered yet. Add one above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => {
                      const isDefault = user.defaultAddress?.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          className={`bg-white/60 dark:bg-zinc-900/60 border rounded-3xl p-5 relative transition-all duration-300 shadow-soft ${
                            isDefault ? "border-primary-500/40 bg-gradient-to-tr from-white to-primary-50/10" : "border-divider/60"
                          }`}
                        >
                          {isDefault && (
                            <span className="absolute top-4 right-4 bg-primary-700 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest">
                              DEFAULT
                            </span>
                          )}

                          <p className="text-xs font-bold text-text-primary mb-1">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                            {addr.address1}
                            {addr.city && `, ${addr.city}`}
                            {addr.province && `, ${addr.province}`}
                            {addr.country && `, ${addr.country}`}
                            {addr.zip && ` - ${addr.zip}`}
                          </p>

                          <div className="flex gap-4 border-t border-divider/60 pt-3">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors cursor-pointer"
                            >
                              Edit details
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-xs font-bold text-gray-500 hover:text-primary-700 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-divider/60 rounded-3xl p-6 shadow-soft">
                <h2 className="text-xl font-bold tracking-tight mb-4">Profile details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">First Name</label>
                    <p className="px-4 py-2.5 bg-bg-primary/50 border border-divider rounded-xl text-xs font-bold text-text-primary">
                      {user.firstName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Last Name</label>
                    <p className="px-4 py-2.5 bg-bg-primary/50 border border-divider rounded-xl text-xs font-bold text-text-primary">
                      {user.lastName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Email Address</label>
                    <p className="px-4 py-2.5 bg-bg-primary/50 border border-divider rounded-xl text-xs font-bold text-text-primary">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Phone Number</label>
                    <p className="px-4 py-2.5 bg-bg-primary/50 border border-divider rounded-xl text-xs font-bold text-text-primary">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-divider">
                  <h3 className="text-sm font-bold mb-2">Shopify Connection Status</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    This account is structured using the Shopify Storefront customer schema. Real-time updates, security rules, and customer orders are mapped natively to Shopify GraphQL payloads.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-zinc-800 text-[10px] font-bold text-primary-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Headless Mock Active (Ahoor OAuth Enabled)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
