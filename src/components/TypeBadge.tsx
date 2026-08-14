import React from 'react';
import { cn } from '../lib/utils';

export interface TypeBadgeProps {
  type: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const typeBadgeConfig: Record<string, { bg: string; text: string; border: string }> = {
  normal: { bg: 'from-[#D0D0B0] via-[#A8A878] to-[#686848]', text: 'text-white', border: 'border-[#3A3A28]' },
  fire: { bg: 'from-[#FFA868] via-[#F08030] to-[#9C3800]', text: 'text-white', border: 'border-[#501C00]' },
  water: { bg: 'from-[#98B8F8] via-[#6890F0] to-[#2048B0]', text: 'text-white', border: 'border-[#102458]' },
  electric: { bg: 'from-[#FFF078] via-[#F8D030] to-[#A88800]', text: 'text-[#2A1E00]', border: 'border-[#544400]' },
  grass: { bg: 'from-[#98E070] via-[#78C850] to-[#387818]', text: 'text-white', border: 'border-[#1C3C0C]' },
  ice: { bg: 'from-[#C0F8F8] via-[#98D8D8] to-[#409090]', text: 'text-[#083030]', border: 'border-[#204848]' },
  fighting: { bg: 'from-[#F05850] via-[#C03028] to-[#781008]', text: 'text-white', border: 'border-[#3C0804]' },
  poison: { bg: 'from-[#D868D8] via-[#A040A0] to-[#581858]', text: 'text-white', border: 'border-[#2C0C2C]' },
  ground: { bg: 'from-[#F0D888] via-[#E0C068] to-[#886818]', text: 'text-[#281C00]', border: 'border-[#44340C]' },
  flying: { bg: 'from-[#C8B8F8] via-[#A890F0] to-[#5838B8]', text: 'text-white', border: 'border-[#2C1C5C]' },
  psychic: { bg: 'from-[#FF88A8] via-[#F85888] to-[#A01040]', text: 'text-white', border: 'border-[#500820]' },
  bug: { bg: 'from-[#C8D838] via-[#A8B820] to-[#586800]', text: 'text-white', border: 'border-[#2C3400]' },
  rock: { bg: 'from-[#D8C058] via-[#B8A038] to-[#605008]', text: 'text-white', border: 'border-[#302804]' },
  ghost: { bg: 'from-[#8888C8] via-[#705898] to-[#382858]', text: 'text-white', border: 'border-[#1C142C]' },
  dragon: { bg: 'from-[#A880F8] via-[#7038F8] to-[#3800A0]', text: 'text-white', border: 'border-[#1C0050]' },
  dark: { bg: 'from-[#A08878] via-[#705848] to-[#382818]', text: 'text-white', border: 'border-[#1C140C]' },
  steel: { bg: 'from-[#D8D8E8] via-[#B8B8D0] to-[#606080]', text: 'text-white', border: 'border-[#303040]' },
  fairy: { bg: 'from-[#F8C8E0] via-[#EE99AC] to-[#984860]', text: 'text-white', border: 'border-[#4C2430]' },
  stellar: { bg: 'from-[#70E0FF] via-[#40A8FF] to-[#1040A0]', text: 'text-white', border: 'border-[#082050]' },
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, label, size = 'md', className }) => {
  const normalizedType = (type || 'normal').toLowerCase();
  const config = typeBadgeConfig[normalizedType] || typeBadgeConfig.normal;
  const displayLabel = (label || type || '').toUpperCase();

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[7px] sm:text-[8px]',
    sm: 'px-2 py-0.5 text-[8px] sm:text-[9.5px]',
    md: 'px-2.5 py-1 text-[9px] sm:text-[11px]',
    lg: 'px-3.5 py-1.5 text-[11px] sm:text-[13px]',
  }[size];

  return (
    <span
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center font-hud font-black uppercase tracking-wider rounded-[4px] border select-none shrink-0",
        "bg-gradient-to-b",
        config.bg,
        config.text,
        config.border,
        "shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.5)]",
        sizeClasses,
        className
      )}
    >
      {/* Top half glossy sheen (Gen 5 B/W iconic cartridge badge highlight) */}
      <span className="absolute top-0 inset-x-0 h-[48%] bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-[3px]" />
      <span className="relative z-10 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.95)]">{displayLabel}</span>
    </span>
  );
};
