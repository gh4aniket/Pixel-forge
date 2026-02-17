"use client";

import { Loader2, RefreshCw, X } from "lucide-react";
import { Game } from "./GameCard";

interface GameSandboxProps {
  game: Game | null;
  htmlCode: string | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onClose: () => void;
}

export function GameSandbox({
  game,
  htmlCode,
  isLoading,
  error,
  onRegenerate,
  onClose,
}: GameSandboxProps) {
  if (!game) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#333] bg-[#050505] font-mono">
        <div className="text-center px-8">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-[#444] text-sm uppercase tracking-widest mb-1">
            [ SELECT A GAME ]
          </p>
          <p className="text-[#333] text-xs">
            Click any game card to load it in the sandbox
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-2 border-[#00ff41]/40 bg-[#050505] shadow-[0_0_20px_#00ff41]/10 w-[1200px] h-[800px]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#00ff41]/30 bg-[#0a0a0a]">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-lg">{game.icon}</span>
          <span className="text-[#00ff41] text-sm font-bold uppercase tracking-wider">
            {game.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 border border-[#ff00ff]/50 text-[#ff00ff] uppercase">
            {game.genre}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 border border-[#333] text-[#888] hover:border-[#00ff41]/60 hover:text-[#00ff41] text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            <RefreshCw className="w-3 h-3" />
            Regen
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-1 border border-[#333] text-[#888] hover:border-[#ff4444]/60 hover:text-[#ff4444] text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sandbox area */}
      <div className="flex-1 relative min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#050505]">
            <div className="font-mono text-center">
              <Loader2 className="w-8 h-8 text-[#00ff41] animate-spin mx-auto mb-4" />
              <p className="text-[#00ff41] text-sm uppercase tracking-widest mb-1">
                Generating game...
              </p>
              <p className="text-[#444] text-xs">
                AI is writing your game code
              </p>
              {/* Pixel loading bar */}
              <div className="mt-4 w-48 h-2 border border-[#333] mx-auto overflow-hidden">
                <div className="h-full bg-[#00ff41] animate-[loading-bar_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#050505]">
            <div className="font-mono text-center px-8">
              <div className="text-4xl mb-3">❌</div>
              <p className="text-[#ff4444] text-sm uppercase tracking-widest mb-2">
                Generation Failed
              </p>
              <p className="text-[#666] text-xs mb-4 max-w-sm">{error}</p>
              <button
                onClick={onRegenerate}
                className="px-4 py-2 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 text-xs uppercase tracking-widest font-mono transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {htmlCode && !isLoading && !error && (
          <iframe
            srcDoc={htmlCode}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title={`${game.name} game sandbox`}
          />
        )}
      </div>
    </div>
  );
}
