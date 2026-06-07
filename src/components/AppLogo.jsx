import React from 'react';

export default function AppLogo({ size = 24, className = '', color = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Heart Outline */}
      <path
        d="M12 20.8l-1.35-1.2C5.6 15.1 2.5 12.1 2.5 8.5C2.5 5.5 4.8 3.2 7.8 3.2c1.7 0 3.3.8 4.2 2.1c.9-1.3 2.5-2.1 4.2-2.1c3 0 5.3 2.3 5.3 5.3c0 3.6-3.1 6.6-8.15 11.1L12 20.8z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkline Line */}
      <path
        d="M8.5 12.5 L 11 15 L 14.5 11"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Start Dot (small) */}
      <circle cx="8.5" cy="12.5" r="0.75" fill={color} />
      {/* End Dot (larger) */}
      <circle cx="14.5" cy="11" r="1.3" fill={color} />
    </svg>
  );
}
