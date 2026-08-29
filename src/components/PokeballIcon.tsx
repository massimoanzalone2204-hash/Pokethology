export const PokeballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Top Dome Gradient */}
      <radialGradient id="pokeball-top" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="45%" stopColor="#ef4444" />
        <stop offset="85%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>

      {/* Bottom Dome Gradient */}
      <radialGradient id="pokeball-bottom" cx="40%" cy="75%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f1f5f9" />
        <stop offset="85%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </radialGradient>

      {/* Button Metallic Bevel */}
      <linearGradient id="pokeball-btn-ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>

      {/* Button Inner Glow */}
      <radialGradient id="pokeball-btn-inner" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </radialGradient>

      {/* Inner Shadow / Vignette */}
      <radialGradient id="pokeball-shadow" cx="50%" cy="50%" r="50%">
        <stop offset="80%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
      </radialGradient>
    </defs>

    {/* Outer Shell Rim / Shadow */}
    <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#020617" strokeWidth="1.5" />

    {/* Bottom Half (White) */}
    <path d="M 3 50 A 47 47 0 0 0 97 50 Z" fill="url(#pokeball-bottom)" />

    {/* Top Half (Red) */}
    <path d="M 3 50 A 47 47 0 0 1 97 50 Z" fill="url(#pokeball-top)" />

    {/* Top Gloss Arc Reflection */}
    <path 
      d="M 12 44 A 43 43 0 0 1 88 44 A 45 42 0 0 0 12 44 Z" 
      fill="white" 
      fillOpacity="0.35" 
    />
    <ellipse cx="34" cy="22" rx="14" ry="7" transform="rotate(-25 34 22)" fill="white" fillOpacity="0.45" />

    {/* Central Seam Band */}
    <rect x="2.5" y="46" width="95" height="8" fill="#0f172a" stroke="#020617" strokeWidth="0.5" />

    {/* Sphere Vignette Overlay for 3D depth */}
    <circle cx="50" cy="50" r="47" fill="url(#pokeball-shadow)" pointerEvents="none" />

    {/* Outer Center Ring (Black Housing) */}
    <circle cx="50" cy="50" r="16" fill="#0f172a" stroke="#020617" strokeWidth="1.5" />

    {/* Metallic Button Bezel */}
    <circle cx="50" cy="50" r="12" fill="url(#pokeball-btn-ring)" />

    {/* Button Inner Core */}
    <circle cx="50" cy="50" r="8.5" fill="url(#pokeball-btn-inner)" stroke="#475569" strokeWidth="0.75" />

    {/* Center Lens Specular Accent */}
    <circle cx="48" cy="48" r="3" fill="#ffffff" fillOpacity="0.9" />
  </svg>
);
