import React from 'react';

interface ArcLogoProps {
  size?: number;
  className?: string;
  color?: string;
}

export const ArcLogo: React.FC<ArcLogoProps> = ({
  size = 28,
  className = '',
  color = '#1E2AEB',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill={color} />
      {/* Arc signature interconnected geometric layers */}
      <path
        d="M16 6L7 12.5L16 19L25 12.5L16 6Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M7 16L16 22.5L25 16"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 19.5L16 26L25 19.5"
        stroke="#00E5FF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
