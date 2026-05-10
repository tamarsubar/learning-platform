import React from 'react';

interface RobotProps {
  size?: number;
  className?: string;
}

const Robot: React.FC<RobotProps> = ({ size = 120, className = '' }) => (
  <svg
    width={size}
    height={Math.round(size * 1.3)}
    viewBox="0 0 120 156"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`robot-float ${className}`}
  >
    {/* Antenna */}
    <line x1="60" y1="8" x2="60" y2="22" stroke="#7c6dfa" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="60" cy="6" r="5" fill="#ffe566"/>
    <circle cx="60" cy="6" r="2.5" fill="#ffb800"/>
    {/* Head */}
    <rect x="22" y="22" width="76" height="56" rx="14" fill="#1c2035" stroke="#7c6dfa" strokeWidth="1.5"/>
    {/* Eyes */}
    <rect x="32" y="36" width="22" height="16" rx="6" fill="#0d0f1a"/>
    <rect x="66" y="36" width="22" height="16" rx="6" fill="#0d0f1a"/>
    <rect x="34" y="38" width="18" height="12" rx="4" fill="#7c6dfa" opacity="0.9"/>
    <rect x="68" y="38" width="18" height="12" rx="4" fill="#7c6dfa" opacity="0.9"/>
    <circle cx="38" cy="41" r="2" fill="white" opacity="0.7"/>
    <circle cx="72" cy="41" r="2" fill="white" opacity="0.7"/>
    {/* Mouth */}
    <rect x="38" y="62" width="44" height="8" rx="4" fill="#0d0f1a"/>
    <rect x="40" y="64" width="8" height="4" rx="2" fill="#7c6dfa"/>
    <rect x="52" y="64" width="8" height="4" rx="2" fill="#ffe566"/>
    <rect x="64" y="64" width="8" height="4" rx="2" fill="#7c6dfa"/>
    <rect x="76" y="64" width="4" height="4" rx="2" fill="#ffe566"/>
    {/* Ears */}
    <circle cx="22" cy="50" r="6" fill="#141728" stroke="#7c6dfa" strokeWidth="1.5"/>
    <circle cx="98" cy="50" r="6" fill="#141728" stroke="#7c6dfa" strokeWidth="1.5"/>
    <circle cx="22" cy="50" r="2" fill="#7c6dfa"/>
    <circle cx="98" cy="50" r="2" fill="#7c6dfa"/>
    {/* Neck */}
    <rect x="50" y="78" width="20" height="10" rx="4" fill="#141728" stroke="#2a2f4a" strokeWidth="1"/>
    {/* Body */}
    <rect x="18" y="88" width="84" height="52" rx="14" fill="#1c2035" stroke="#7c6dfa" strokeWidth="1.5"/>
    {/* Chest */}
    <rect x="32" y="98" width="56" height="32" rx="8" fill="#141728"/>
    <circle cx="48" cy="108" r="7" fill="#0d0f1a" stroke="#7c6dfa" strokeWidth="1"/>
    <circle cx="48" cy="108" r="4" fill="#7c6dfa" opacity="0.8"/>
    <rect x="62" y="103" width="20" height="4" rx="2" fill="#ffe566" opacity="0.7"/>
    <rect x="62" y="111" width="14" height="4" rx="2" fill="#7c6dfa" opacity="0.6"/>
    <rect x="62" y="119" width="17" height="4" rx="2" fill="#7c6dfa" opacity="0.4"/>
    {/* Arms */}
    <rect x="0" y="90" width="20" height="38" rx="10" fill="#1c2035" stroke="#2a2f4a" strokeWidth="1.5"/>
    <rect x="100" y="90" width="20" height="38" rx="10" fill="#1c2035" stroke="#2a2f4a" strokeWidth="1.5"/>
    <circle cx="10" cy="132" r="8" fill="#141728" stroke="#7c6dfa" strokeWidth="1.5"/>
    <circle cx="110" cy="132" r="8" fill="#141728" stroke="#7c6dfa" strokeWidth="1.5"/>
    {/* Legs */}
    <rect x="32" y="138" width="22" height="16" rx="8" fill="#141728" stroke="#2a2f4a" strokeWidth="1"/>
    <rect x="66" y="138" width="22" height="16" rx="8" fill="#141728" stroke="#2a2f4a" strokeWidth="1"/>
    <rect x="28" y="150" width="30" height="6" rx="3" fill="#7c6dfa" opacity="0.7"/>
    <rect x="62" y="150" width="30" height="6" rx="3" fill="#7c6dfa" opacity="0.7"/>
  </svg>
);

export default Robot;