export const PokeballIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" stroke="black" strokeWidth="4" />
    <path d="M2 50 A 48 48 0 0 1 98 50" fill="#f87171" stroke="black" strokeWidth="4" />
    <rect x="2" y="48" width="96" height="4" fill="black" />
    <circle cx="50" cy="50" r="12" fill="white" stroke="black" strokeWidth="4" />
    <circle cx="50" cy="50" r="6" fill="white" stroke="black" strokeWidth="2" />
  </svg>
);
