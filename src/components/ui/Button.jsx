import React from "react";

export function Button({ 
  children, 
  variant = "primary", 
  className = "", 
  onClick, 
  type = "button",
  disabled = false,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-sans font-medium min-h-[48px] px-8 py-3 rounded-full transition-editorial focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide";
  
  const variants = {
    primary: "bg-brand-gradient text-white shadow-soft hover:shadow-elevated hover:-translate-y-0.5",
    secondary: "bg-transparent border border-primary-700 text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:-translate-y-0.5",
    secondaryWhite: "bg-transparent border border-white text-white hover:bg-white/10 hover:-translate-y-0.5",
    ghost: "bg-transparent text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
