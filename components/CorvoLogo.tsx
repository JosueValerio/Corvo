import React from 'react';

interface CorvoLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showText?: boolean; // Kept for compatibility, though always text now
}

export const CorvoLogo: React.FC<CorvoLogoProps> = ({ className = "", variant = 'light' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const accentColor = variant === 'light' ? 'text-indigo-300' : 'text-primary';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="flex flex-col">
        <h1 className={`font-sans font-bold text-2xl leading-none tracking-tight ${textColor}`}>
          Corvo <span className={accentColor}>Marketing</span>
        </h1>
      </div>
    </div>
  );
};