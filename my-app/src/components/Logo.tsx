'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ 
  className = '', 
  size = 'md', 
  showText = true,
  variant = 'dark'
}: LogoProps) {
  const dimensions = {
    sm: { container: 28, icon: 16 },
    md: { container: 36, icon: 20 },
    lg: { container: 48, icon: 28 },
  };

  const { container, icon } = dimensions[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Icon */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: container, height: container }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-slate-800" />
        
        {/* Inner highlight */}
        <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-teal-400/20 to-transparent" />
        
        {/* Slide layers icon */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          className="absolute inset-0 m-auto"
          style={{ width: icon, height: icon }}
        >
          {/* Bottom slide */}
          <rect 
            x="3" y="10" width="18" height="10" 
            rx="1.5" 
            fill="rgba(255,255,255,0.3)"
          />
          {/* Middle slide */}
          <rect 
            x="4" y="7" width="16" height="9" 
            rx="1.5" 
            fill="rgba(255,255,255,0.5)"
          />
          {/* Top slide */}
          <rect 
            x="5" y="4" width="14" height="8" 
            rx="1.5" 
            fill="white"
          />
          {/* Accent line */}
          <rect 
            x="7" y="7" width="6" height="1.5" 
            rx="0.75" 
            fill="#14B8A6"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`font-bold tracking-tight ${textColor} ${
          size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl'
        }`}>
          SlideTheory
        </span>
      )}
    </div>
  );
}

/* 
 * Compact logo for small spaces (just the icon)
 */
export function LogoIcon({ 
  className = '', 
  size = 32 
}: { 
  className?: string; 
  size?: number;
}) {
  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-slate-800" />
      
      {/* Inner highlight */}
      <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-teal-400/20 to-transparent" />
      
      {/* Slide layers icon */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none"
        className="absolute inset-0 m-auto"
        style={{ width: size * 0.55, height: size * 0.55 }}
      >
        <rect x="3" y="10" width="18" height="10" rx="1.5" fill="rgba(255,255,255,0.3)" />
        <rect x="4" y="7" width="16" height="9" rx="1.5" fill="rgba(255,255,255,0.5)" />
        <rect x="5" y="4" width="14" height="8" rx="1.5" fill="white" />
        <rect x="7" y="7" width="6" height="1.5" rx="0.75" fill="#14B8A6" />
      </svg>
    </div>
  );
}

/*
 * Animated logo for loading states
 */
export function LogoAnimated({ 
  className = '', 
  size = 48 
}: { 
  className?: string; 
  size?: number;
}) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-slate-800 animate-pulse" />
      
      {/* Slide layers with stagger animation */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none"
        className="absolute inset-0 m-auto"
        style={{ width: size * 0.5, height: size * 0.5 }}
      >
        <rect x="3" y="10" width="18" height="10" rx="1.5" fill="rgba(255,255,255,0.3)">
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="4" y="7" width="16" height="9" rx="1.5" fill="rgba(255,255,255,0.5)">
          <animate attributeName="opacity" values="0.5;0.7;0.5" dur="2s" repeatCount="indefinite" begin="0.2s" />
        </rect>
        <rect x="5" y="4" width="14" height="8" rx="1.5" fill="white">
          <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" begin="0.4s" />
        </rect>
        <rect x="7" y="7" width="6" height="1.5" rx="0.75" fill="#14B8A6" />
      </svg>
    </div>
  );
}
