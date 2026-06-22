import React from "react";

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  error = "",
  id,
  ...props
}) {
  return (
    <div className="flex flex-col w-full gap-1">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full min-h-[48px] px-6 py-3 bg-bg-secondary border ${error ? 'border-primary-500' : 'border-divider'} rounded-full font-sans text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-primary-500 transition-editorial text-base ${className}`}
        {...props}
      />
      {error && (
        <span className="px-4 text-xs font-medium text-primary-600 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
}
