export const PokeballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Base Outer Black Ring Border */}
    <circle cx="100" cy="100" r="92" fill="#1a1a1a" />

    {/* Top Red Hemisphere */}
    <path 
      d="M 22 100 A 78 78 0 0 1 178 100 Z" 
      fill="#e52521" 
    />

    {/* Bottom White Hemisphere */}
    <path 
      d="M 22 100 A 78 78 0 0 0 178 100 Z" 
      fill="#ffffff" 
    />

    {/* Center Horizontal Black Band */}
    <rect x="20" y="93" width="160" height="14" fill="#1a1a1a" />

    {/* Central Black Ring */}
    <circle cx="100" cy="100" r="32" fill="#1a1a1a" />

    {/* Central White Button Core */}
    <circle cx="100" cy="100" r="19" fill="#ffffff" />
  </svg>
);
