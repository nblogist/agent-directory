export default function RadarLogo({ size = 'w-8 h-8' }: { size?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="radar-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--theme-primary, #6d5cff)"/>
          <stop offset="100%" stopColor="#3713ec"/>
        </linearGradient>
        <linearGradient id="radar-sweep" x1="50%" y1="50%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--theme-primary, #6d5cff)" stopOpacity="0"/>
          <stop offset="100%" stopColor="var(--theme-primary, #6d5cff)" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Radar rings */}
      <circle cx="16" cy="16" r="14" fill="none" stroke="var(--theme-primary, #6d5cff)" strokeWidth="1" opacity="0.2"/>
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="var(--theme-primary, #6d5cff)" strokeWidth="1" opacity="0.35"/>
      <circle cx="16" cy="16" r="5" fill="none" stroke="var(--theme-primary, #6d5cff)" strokeWidth="1" opacity="0.5"/>
      {/* Sweep */}
      <path d="M16 16 L16 2 A14 14 0 0 1 29 11 Z" fill="url(#radar-sweep)"/>
      {/* Center dot */}
      <circle cx="16" cy="16" r="2.2" fill="url(#radar-g)"/>
      {/* Blips */}
      <circle cx="23" cy="8" r="1.8" fill="var(--theme-primary, #6d5cff)" opacity="0.9"/>
      <circle cx="8" cy="13" r="1.4" fill="var(--theme-primary, #6d5cff)" opacity="0.6"/>
      <circle cx="25" cy="20" r="1.1" fill="var(--theme-primary, #6d5cff)" opacity="0.4"/>
    </svg>
  );
}
