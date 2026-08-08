import React, { useState } from 'react';
import { Ability } from '../types';
import { cn } from '../lib/utils';
import { Zap, Sparkles, Shield, Copy, Check } from 'lucide-react';

interface AbilitiesSectionProps {
  abilities: Ability[];
  isLightMode: boolean;
  sounds?: any;
}

export const AbilitiesSection: React.FC<AbilitiesSectionProps> = ({
  abilities,
  isLightMode,
  sounds
}) => {
  const [copiedAbility, setCopiedAbility] = useState<string | null>(null);

  const handleCopy = (ability: Ability) => {
    navigator.clipboard.writeText(`${ability.name.toUpperCase()} (${ability.is_hidden ? 'Hidden Ability' : 'Ability'}): ${ability.description}`);
    setCopiedAbility(ability.name);
    try { sounds?.scan?.(); } catch (_) {}
    setTimeout(() => setCopiedAbility(null), 2000);
  };

  return (
    <div className={cn(
      "backdrop-blur-xl rounded-2xl p-5 sm:p-6 border shadow-xl relative overflow-hidden transition-all",
      isLightMode
        ? "bg-white/95 border-slate-200"
        : "bg-slate-900/70 border-cyan-900/40"
    )}>
      {/* Header */}
      <div className={cn(
        "font-hud text-[13px] uppercase tracking-wider mb-4 pb-3 border-b flex items-center justify-between",
        isLightMode ? "text-cyan-900 border-slate-200" : "text-cyan-400 border-cyan-900/40"
      )}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Abilities</span>
        </div>
      </div>

      {/* Ability Cards Container */}
      <div className="space-y-3">
        {abilities && abilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {abilities.map((a, i) => {
              const isCopied = copiedAbility === a.name;

              return (
                <div
                  key={`${a.name}-${i}`}
                  className={cn(
                    "p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between",
                    a.is_hidden
                      ? isLightMode
                        ? "bg-purple-50/50 border-purple-200/90"
                        : "bg-purple-950/20 border-purple-800/50"
                      : isLightMode
                        ? "bg-slate-50 border-slate-200"
                        : "bg-slate-950/60 border-cyan-900/40"
                  )}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={cn(
                        "text-[12px] sm:text-[13px] font-hud uppercase tracking-wider font-bold leading-tight",
                        a.is_hidden
                          ? isLightMode ? "text-purple-900" : "text-purple-300"
                          : isLightMode ? "text-cyan-900" : "text-cyan-300"
                      )}>
                        {a.name.replace(/-/g, ' ')}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(a)}
                          onMouseEnter={() => sounds?.hover?.()}
                          title="Copy Ability"
                          className={cn(
                            "p-1 rounded-md border text-[10px] transition-all cursor-pointer",
                            isCopied
                              ? "bg-emerald-500 text-white border-emerald-400"
                              : isLightMode
                                ? "bg-white text-slate-500 border-slate-200 hover:text-slate-800"
                                : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-cyan-300"
                          )}
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>

                        <span className={cn(
                          "text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1",
                          a.is_hidden
                            ? isLightMode
                              ? "bg-purple-100 text-purple-800 border-purple-300"
                              : "bg-purple-950 text-purple-300 border-purple-700/60"
                            : isLightMode
                              ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                              : "bg-cyan-950 text-cyan-300 border-cyan-800/60"
                        )}>
                          {a.is_hidden ? <Sparkles className="w-2.5 h-2.5 text-purple-400" /> : <Shield className="w-2.5 h-2.5 text-cyan-400" />}
                          {a.is_hidden ? "Hidden" : `Ability ${i + 1}`}
                        </span>
                      </div>
                    </div>

                    {/* Description Text */}
                    <p className={cn(
                      "text-[11px] sm:text-[12px] leading-relaxed font-sans font-medium mt-1",
                      isLightMode ? "text-slate-700" : "text-slate-300"
                    )}>
                      {a.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center rounded-xl border border-dashed border-slate-700/50">
            <p className={cn("text-[11px] font-bold uppercase font-hud", isLightMode ? "text-slate-400" : "text-cyan-500")}>
              No abilities data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
