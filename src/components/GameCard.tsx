"use client";

import { Gamepad2, Loader2 } from "lucide-react";

export interface Game {
  id: string;
  name: string;
  description: string;
  genre: string;
  icon: string;
}

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  isLoading: boolean;
  onClick: (game: Game) => void;
}

export function GameCard({ game, isSelected, isLoading, onClick }: GameCardProps) {
  return (
    <button
      onClick={() => onClick(game)}
      className={`
        w-full text-left p-4 border-2 transition-all duration-150 cursor-pointer
        font-mono relative group
        ${isSelected
          ? "border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_12px_#00ff41]"
          : "border-[#333] bg-[#0a0a0a] hover:border-[#00ff41]/60 hover:bg-[#00ff41]/5 hover:shadow-[0_0_8px_#00ff41]/40"
        }
      `}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Pixel corner decorations */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-60" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-60" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-60" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-60" />

      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{game.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`text-sm font-bold uppercase tracking-wider truncate ${isSelected ? "text-[#00ff41]" : "text-[#e0e0e0]"}`}>
              {game.name}
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 border border-[#ff00ff]/50 text-[#ff00ff] uppercase tracking-widest flex-shrink-0">
              {game.genre}
            </span>
          </div>
          <p className="text-xs text-[#888] leading-relaxed line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Loader2 className="w-5 h-5 text-[#00ff41] animate-spin" />
        </div>
      )}

      {isSelected && !isLoading && (
        <div className="absolute right-2 bottom-2">
          <Gamepad2 className="w-3 h-3 text-[#00ff41]" />
        </div>
      )}
    </button>
  );
}
