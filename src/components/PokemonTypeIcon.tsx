import React from 'react';
import { cn } from '../lib/utils';

export interface PokemonTypeIconProps {
  type: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showShadow?: boolean;
}

// Crisp official vector icons for all Pokémon types
export const PokemonTypeIcon: React.FC<PokemonTypeIconProps> = ({
  type,
  size = 'md',
  className,
  showShadow = true,
}) => {
  const normalizedType = (type || 'normal').toLowerCase().trim();

  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const renderIconContent = () => {
    switch (normalizedType) {
      case 'fire':
        return (
          <path
            d="M12 2C10.5 4.5 9 6.5 9 9C9 9.5 9.2 10.1 9.4 10.6C8.2 9.8 7.5 8.4 7.5 7C5.5 9 4.5 11.5 4.5 14C4.5 18.1 7.9 21.5 12 21.5C16.1 21.5 19.5 18.1 19.5 14C19.5 9.5 15.5 5.5 12 2ZM12 19C10.1 19 8.5 17.4 8.5 15.5C8.5 14.1 9.3 12.8 10.5 12.2C10.5 13.5 11.5 14.5 12.8 14.5C13.5 14.5 14.2 14.1 14.5 13.5C15.1 14.2 15.5 15 15.5 16C15.5 17.7 13.9 19 12 19Z"
            fill="currentColor"
          />
        );
      case 'water':
        return (
          <path
            d="M12 2.5C12 2.5 5 11 5 15.5C5 19.4 8.1 22.5 12 22.5C15.9 22.5 19 19.4 19 15.5C19 11 12 2.5 12 2.5ZM12 20C9.5 20 7.5 18 7.5 15.5C7.5 13.1 9.6 9.4 12 6C14.4 9.4 16.5 13.1 16.5 15.5C16.5 18 14.5 20 12 20Z"
            fill="currentColor"
          />
        );
      case 'grass':
        return (
          <path
            d="M12 3C8 3 4 7 4 12C4 16 7 19.5 11 20.8V22H13V19C17 18 20 14.5 20 10C20 6 16 3 12 3ZM12 17C9.2 17 7 14.8 7 12C7 9.8 9.5 7.5 12 5.5C14.5 7.5 17 9.8 17 12C17 14.8 14.8 17 12 17ZM12 15C13.7 15 15 13.7 15 12C15 10.7 13.7 9 12 8C10.3 9 9 10.7 9 12C9 13.7 10.3 15 12 15Z"
            fill="currentColor"
          />
        );
      case 'electric':
        return (
          <path
            d="M13.5 2L4.5 13H11L9.5 22L19.5 10.5H13L13.5 2Z"
            fill="currentColor"
          />
        );
      case 'ice':
        return (
          <path
            d="M11 2H13V6.2L16 4.5L17 6.2L13.9 8L17.5 10.1L16.5 11.8L13 9.8V14.2L16.5 12.2L17.5 13.9L13.9 16L17 17.8L16 19.5L13 17.8V22H11V17.8L8 19.5L7 17.8L10.1 16L6.5 13.9L7.5 12.2L11 14.2V9.8L7.5 11.8L6.5 10.1L10.1 8L7 6.2L8 4.5L11 6.2V2Z"
            fill="currentColor"
          />
        );
      case 'fighting':
        return (
          <path
            d="M19.5 9.5C19.5 7.5 17.5 6 15 6C14.5 6 14.1 6.1 13.7 6.3C13.2 4.9 11.7 4 10 4C8.6 4 7.4 4.7 6.7 5.7C6.2 5.3 5.6 5 5 5C3.3 5 2 6.3 2 8C2 9.1 2.6 10 3.5 10.5C3.2 11.1 3 11.8 3 12.5C3 15.5 5.5 19 9.5 20.5V22H14.5V19.5C17.5 18 19.5 15 19.5 12C19.5 11.1 19.2 10.2 18.7 9.5C19.2 9.5 19.5 9.5 19.5 9.5ZM13 17.5H11V10H13V17.5ZM9 16.5H7V10.5H9V16.5ZM17 15H15V10.5H17V15Z"
            fill="currentColor"
          />
        );
      case 'poison':
        return (
          <path
            d="M12 2C7.5 2 4 5.5 4 10C4 13.5 6.2 16.5 9.5 17.5V20C9.5 21.1 10.4 22 11.5 22H12.5C13.6 22 14.5 21.1 14.5 20V17.5C17.8 16.5 20 13.5 20 10C20 5.5 16.5 2 12 2ZM8.5 8.5C9.3 8.5 10 9.2 10 10C10 10.8 9.3 11.5 8.5 11.5C7.7 11.5 7 10.8 7 10C7 9.2 7.7 8.5 8.5 8.5ZM15.5 8.5C16.3 8.5 17 9.2 17 10C17 10.8 16.3 11.5 15.5 11.5C14.7 11.5 14 10.8 14 10C14 9.2 14.7 8.5 15.5 8.5ZM13 16H11V14H13V16Z"
            fill="currentColor"
          />
        );
      case 'ground':
        return (
          <path
            d="M2 19L5 7H19L22 19H2ZM7.5 9L5.5 17H18.5L16.5 9H7.5ZM12 11L14 15H10L12 11Z"
            fill="currentColor"
          />
        );
      case 'flying':
        return (
          <path
            d="M12 3C8 6 3 10 2 15C5 14 8 13.5 11 14C7 16 4 19 3 21C7 20 12 18 16 14C19 11 21 7 22 3C18 4 14 4.5 12 3Z"
            fill="currentColor"
          />
        );
      case 'psychic':
        return (
          <path
            d="M12 4.5C6.5 4.5 2 12 2 12C2 12 6.5 19.5 12 19.5C17.5 19.5 22 12 22 12C22 12 17.5 4.5 12 4.5ZM12 17C9.2 17 7 14.8 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17ZM12 9.5C10.6 9.5 9.5 10.6 9.5 12C9.5 13.4 10.6 14.5 12 14.5C13.4 14.5 14.5 13.4 14.5 12C14.5 10.6 13.4 9.5 12 9.5Z"
            fill="currentColor"
          />
        );
      case 'bug':
        return (
          <path
            d="M12 2C9.5 2 7.5 3.8 7.1 6.2L4 4.5L3 6.2L6.1 7.9C6 8.6 6 9.3 6 10H3V12H6C6 13.2 6.3 14.4 6.8 15.4L3.5 17.3L4.5 19L7.8 17.1C9 18.9 10.4 20 12 20C13.6 20 15 18.9 16.2 17.1L19.5 19L20.5 17.3L17.2 15.4C17.7 14.4 18 13.2 18 12H21V10H18C18 9.3 18 8.6 17.9 7.9L21 6.2L20 4.5L16.9 6.2C16.5 3.8 14.5 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 12C14.2 12 16 13.8 16 16H8C8 13.8 9.8 12 12 12Z"
            fill="currentColor"
          />
        );
      case 'rock':
        return (
          <path
            d="M12 2L3 8L6 20L18 22L21 9L12 2ZM12 5.2L17.5 9.5L15.5 18.5L8.5 17.2L6.2 9L12 5.2Z"
            fill="currentColor"
          />
        );
      case 'ghost':
        return (
          <path
            d="M12 2.5C7 2.5 4 6.5 4 12V21.5L7 19L9.5 21.5L12 19L14.5 21.5L17 19L20 21.5V12C20 6.5 17 2.5 12 2.5ZM9 9.5C9.8 9.5 10.5 10.2 10.5 11C10.5 11.8 9.8 12.5 9 12.5C8.2 12.5 7.5 11.8 7.5 11C7.5 10.2 8.2 9.5 9 9.5ZM15 9.5C15.8 9.5 16.5 10.2 16.5 11C16.5 11.8 15.8 12.5 15 12.5C14.2 12.5 13.5 11.8 13.5 11C13.5 10.2 14.2 9.5 15 9.5ZM12 17C10.3 17 9 15.7 9 15H15C15 15.7 13.7 17 12 17Z"
            fill="currentColor"
          />
        );
      case 'dragon':
        return (
          <path
            d="M12 2C8 2 4.5 4.5 3 8C4.5 8 6.5 9 8 11C6.5 12 4 12.5 2 12C3 16 6 19.5 10 21C11.5 19 13.5 18 16 18C15 20 15.5 21.5 16.5 22C19.5 20.5 21.5 17 22 13C20 13.5 18 13 16.5 11.5C18.5 10 20.5 9 22 9C20.5 5 16.5 2 12 2ZM12 7C13.7 7 15 8.3 15 10C15 11.7 13.7 13 12 13C10.3 13 9 11.7 9 10C9 8.3 10.3 7 12 7Z"
            fill="currentColor"
          />
        );
      case 'dark':
        return (
          <path
            d="M14.5 2.5C8.7 2.5 4 7.2 4 13C4 18.8 8.7 23.5 14.5 23.5C17.7 23.5 20.6 22 22.4 19.7C16.8 19.5 12.5 14.8 12.5 9.5C12.5 6.6 13.7 4 15.6 2.6C15.2 2.5 14.9 2.5 14.5 2.5Z"
            fill="currentColor"
          />
        );
      case 'steel':
        return (
          <path
            d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2ZM12 5.5L17.5 8.5V15.5L12 18.5L6.5 15.5V8.5L12 5.5ZM12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9Z"
            fill="currentColor"
          />
        );
      case 'fairy':
        return (
          <path
            d="M12 2L14.5 8.5L21.5 9.5L16.5 14.5L18 21.5L12 18L6 21.5L7.5 14.5L2.5 9.5L9.5 8.5L12 2ZM12 6.5L10.5 10.5L6.5 11L9.5 14L8.5 18L12 16L15.5 18L14.5 14L17.5 11L13.5 10.5L12 6.5Z"
            fill="currentColor"
          />
        );
      case 'stellar':
        return (
          <path
            d="M12 2L14 8.5L20.5 6.5L16.5 12L22 14.5L15.5 16.5L17.5 23L12 18.5L6.5 23L8.5 16.5L2 14.5L7.5 12L3.5 6.5L10 8.5L12 2Z"
            fill="currentColor"
          />
        );
      case 'normal':
      default:
        return (
          <path
            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 18C8.7 18 6 15.3 6 12C6 8.7 8.7 6 12 6C15.3 6 18 8.7 18 12C18 15.3 15.3 18 12 18ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z"
            fill="currentColor"
          />
        );
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        currentSize,
        "inline-block shrink-0 transition-transform select-none",
        showShadow && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
        className
      )}
      aria-hidden="true"
    >
      {renderIconContent()}
    </svg>
  );
};

// Official Pokémon Damage Class / Category Badges (Physical, Special, Status)
export interface DamageClassIconProps {
  damageClass?: 'physical' | 'special' | 'status' | string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const DamageClassIcon: React.FC<DamageClassIconProps> = ({
  damageClass = 'physical',
  size = 'sm',
  className,
}) => {
  const norm = (damageClass || 'physical').toLowerCase();

  const sizeClasses = {
    xs: 'px-1 py-0.5 text-[6.5px] gap-0.5',
    sm: 'px-1.5 py-0.5 text-[7.5px] gap-1',
    md: 'px-2 py-0.5 text-[8.5px] gap-1',
  }[size];

  if (norm === 'special') {
    return (
      <span
        title="Special Attack"
        className={cn(
          "inline-flex items-center font-hud font-black uppercase tracking-wider rounded border shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
          "bg-gradient-to-r from-[#1B365D] via-[#2A4D8C] to-[#1B365D] border-[#4D7AD4]/60 text-[#D8E6FF]",
          sizeClasses,
          className
        )}
      >
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current shrink-0">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
        <span>SPE</span>
      </span>
    );
  }

  if (norm === 'status') {
    return (
      <span
        title="Status / Utility Move"
        className={cn(
          "inline-flex items-center font-hud font-black uppercase tracking-wider rounded border shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
          "bg-gradient-to-r from-[#4A4A4A] via-[#636363] to-[#4A4A4A] border-[#8C8C8C]/60 text-[#F0F0F0]",
          sizeClasses,
          className
        )}
      >
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current shrink-0">
          <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 4C14.2 4 16 5.8 16 8C16 10.2 14.2 12 12 12C9.8 12 8 13.8 8 16C8 18.2 9.8 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4Z" />
        </svg>
        <span>STA</span>
      </span>
    );
  }

  // Physical by default
  return (
    <span
      title="Physical Attack"
      className={cn(
        "inline-flex items-center font-hud font-black uppercase tracking-wider rounded border shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
        "bg-gradient-to-r from-[#8C281F] via-[#C93B2B] to-[#8C281F] border-[#FF6B59]/60 text-[#FFF0EE]",
        sizeClasses,
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current shrink-0">
        <path d="M12 2L14.5 8L21 6.5L17.5 12L22 15.5L15.5 16.5L16.5 22L12 17.5L7.5 22L8.5 16.5L2 15.5L6.5 12L3 6.5L9.5 8L12 2Z" />
      </svg>
      <span>PHY</span>
    </span>
  );
};
