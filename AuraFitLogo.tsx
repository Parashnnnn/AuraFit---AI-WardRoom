import React from 'react';

interface AuraFitLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'color';
}

export const AuraFitLogo: React.FC<AuraFitLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showTagline = false,
}) => {
  const sizeMap = {
    xs: { icon: 22, text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 30, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 42, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 56, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm' },
    hero: { icon: 110, text: 'text-5xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official AuraFit Hanger-A Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Aura Silk Gradient */}
            <linearGradient id="auraGradientMain" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="35%" stopColor="#D8B4FE" />
              <stop offset="70%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>

            {/* Top Swatch Gradient */}
            <linearGradient id="auraGradientTop" x1="60" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#F9A8D4" />
              <stop offset="65%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>

            {/* Shadow Depth Gradient */}
            <linearGradient id="auraGradientShadow" x1="40" y1="60" x2="140" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B0764" />
              <stop offset="50%" stopColor="#581C87" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>

            {/* Sparkle Gradient */}
            <linearGradient id="sparkleGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D8B4FE" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="softAuraGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background subtle hanger shadow outline */}
          <path
            d="M 105 18 C 114 18, 122 26, 122 36 C 122 46, 114 52, 107 57 C 98 63, 62 86, 32 108 C 22 116, 22 124, 30 128 C 38 132, 70 128, 92 122"
            stroke="url(#auraGradientShadow)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Lower Crossbar Arc */}
          <path
            d="M 32 120 C 65 125, 140 125, 185 120 C 192 119, 195 124, 190 128 C 160 148, 110 135, 75 136"
            stroke="url(#auraGradientMain)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Outer Left Hanger / 'A' Leg */}
          <path
            d="M 108 22 C 118 22, 122 30, 118 40 C 115 48, 106 54, 98 62 L 48 145 C 44 152, 54 158, 62 150 L 98 90"
            stroke="url(#auraGradientShadow)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Main Flowing Ribbon 'A' - Dramatic Silk Swirl */}
          <path
            d="M 106 20 C 116 20, 122 28, 118 38 C 113 50, 100 62, 94 75 C 80 102, 60 140, 52 154 C 48 160, 56 166, 64 158 C 76 142, 96 110, 108 94 C 118 80, 128 92, 134 110 C 144 138, 156 156, 178 152 C 186 150, 188 142, 180 138 C 160 128, 146 95, 130 65 C 122 50, 116 38, 106 20 Z"
            fill="url(#auraGradientTop)"
            filter="url(#softAuraGlow)"
          />

          {/* Highlights & Center Bridge of 'A' */}
          <path
            d="M 70 124 C 95 116, 122 120, 138 126 C 144 128, 140 134, 132 133 C 112 130, 88 128, 70 132 Z"
            fill="url(#auraGradientMain)"
          />

          {/* Four-Point Twinkle Star 1 (Top Right) */}
          <path
            d="M 158 35 Q 158 48 145 48 Q 158 48 158 61 Q 158 48 171 48 Q 158 48 158 35 Z"
            fill="url(#sparkleGrad)"
            filter="url(#softAuraGlow)"
          />

          {/* Four-Point Twinkle Star 2 (Smaller) */}
          <path
            d="M 174 58 Q 174 65 167 65 Q 174 65 174 72 Q 174 65 181 65 Q 174 65 174 58 Z"
            fill="url(#sparkleGrad)"
          />

          {/* Botanical Violet Leaves / Branch Accent (Right Side) */}
          <g transform="translate(142, 70) rotate(-10)" opacity="0.95">
            {/* Stem */}
            <path
              d="M 10 45 C 18 30, 28 18, 42 12 C 48 10, 48 16, 42 22 C 28 36, 18 55, 12 62"
              stroke="url(#auraGradientMain)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Top Leaf */}
            <path
              d="M 28 16 C 36 6, 46 2, 48 4 C 50 12, 42 22, 34 24 Z"
              fill="url(#auraGradientTop)"
            />
            {/* Mid Leaf */}
            <path
              d="M 20 28 C 30 20, 40 20, 42 24 C 42 32, 32 38, 24 36 Z"
              fill="url(#auraGradientMain)"
            />
            {/* Low Leaf */}
            <path
              d="M 14 42 C 22 36, 32 38, 34 44 C 32 50, 22 52, 16 48 Z"
              fill="url(#auraGradientShadow)"
            />
            {/* Curled leaf tip */}
            <path
              d="M 44 14 C 52 18, 52 28, 44 32 C 40 34, 38 30, 42 26 Z"
              fill="url(#auraGradientMain)"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-display font-bold tracking-[0.16em] uppercase text-current leading-none ${currentSize.text}`}
          >
            AURAFIT
          </span>
          {showTagline && (
            <span
              className={`font-sans tracking-wide text-neutral-500 dark:text-neutral-400 mt-1 uppercase text-[10px] font-medium leading-none ${currentSize.sub}`}
            >
              Your Closet's Best Friend
            </span>
          )}
        </div>
      )}
    </div>
  );
};
