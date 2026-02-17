"use client";

import { useState, useCallback } from "react";
import { Loader2, Sparkles, Gamepad2, Terminal } from "lucide-react";
import { GameCard, Game } from "@/components/GameCard";
import { GameSandbox } from "@/components/GameSandbox";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [isGeneratingList, setIsGeneratingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameHtml, setGameHtml] = useState<string | null>(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [loadingGameId, setLoadingGameId] = useState<string | null>(null);

  const generateGames = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingList(true);
    setListError(null);
    setGames([]);
    setSelectedGame(null);
    setGameHtml(null);
    setGameError(null);

    try {
      const res = await fetch("/api/generate-games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate games");
      setGames(data.games || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setListError(message);
    } finally {
      setIsGeneratingList(false);
    }
  };

  const loadGame = useCallback(
    async (game: Game) => {
      setSelectedGame(game);
      setGameHtml(null);
      setGameError(null);
      setIsLoadingGame(true);
      setLoadingGameId(game.id);

      try {
        const res = await fetch("/api/generate-game-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game, originalPrompt: prompt }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to generate game");
        setGameHtml(data.html);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setGameError(message);
      } finally {
        setIsLoadingGame(false);
        setLoadingGameId(null);
      }
    },
    [prompt]
  );

  const handleRegenerate = () => {
    if (selectedGame) loadGame(selectedGame);
  };

  const handleClose = () => {
    setSelectedGame(null);
    setGameHtml(null);
    setGameError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateGames();
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#e0e0e0] flex flex-col font-mono">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.5) 2px, rgba(0,255,65,0.5) 4px)",
        }}
      />

      {/* Header */}
      <header className="border-b-2 border-[#00ff41]/30 bg-[#050505] px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#00ff41] flex items-center justify-center shadow-[0_0_10px_#00ff41]">
              <Gamepad2 className="w-4 h-4 text-[#00ff41]" />
            </div>
            <div>
              <h1
                className="text-[#00ff41] text-lg font-bold uppercase tracking-[0.2em] leading-none"
                style={{ textShadow: "0 0 10px #00ff41" }}
              >
                PIXEL FORGE
              </h1>
              <p className="text-[#444] text-[10px] uppercase tracking-widest">
                AI Mini Game Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#333] uppercase tracking-widest">
            <Terminal className="w-3 h-3" />
            <span>Powered by Ideavo</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full px-6 py-6 gap-6">
        {/* Prompt input */}
        <div className="border-2 border-[#1a1a1a] bg-[#070707] p-4">
          <label className="block text-[10px] text-[#00ff41] uppercase tracking-widest mb-2">
            &gt; Enter Game Theme / Prompt
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-3 text-[#00ff41] text-sm leading-none">
                &gt;_
              </span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. space invaders with a twist, underwater adventure, zombie survival..."
                rows={2}
                className="w-full bg-[#0a0a0a] border border-[#222] text-[#e0e0e0] placeholder-[#333] text-sm px-3 py-2 pl-10 resize-none focus:outline-none focus:border-[#00ff41]/60 transition-all"
              />
            </div>
            <button
              onClick={generateGames}
              disabled={isGeneratingList || !prompt.trim()}
              className="px-5 py-2 bg-[#00ff41]/10 border-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-xs flex items-center gap-2 self-stretch"
              style={{ textShadow: "0 0 8px #00ff41" }}
            >
              {isGeneratingList ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGeneratingList ? "Generating..." : "Generate"}
            </button>
          </div>
          <p className="text-[#333] text-[10px] mt-2 uppercase tracking-wider">
            Press Enter to generate &bull; Shift+Enter for new line
          </p>
        </div>

        {/* Error state */}
        {listError && (
          <div className="border border-[#ff4444]/50 bg-[#ff4444]/5 px-4 py-3 text-[#ff4444] text-xs uppercase tracking-wider">
            &#9888; {listError}
          </div>
        )}

        {/* Games list + sandbox */}
        {games.length > 0 && (
          <div
            className="flex gap-4"
            style={{ minHeight: "calc(100vh - 280px)" }}
          >
            {/* Games list */}
            <div className="w-72 flex-shrink-0 flex flex-col gap-1 overflow-y-auto">
              <p className="text-[10px] text-[#444] uppercase tracking-widest mb-1 px-1">
                &gt; {games.length} Games Generated
              </p>
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isSelected={selectedGame?.id === game.id}
                  isLoading={loadingGameId === game.id}
                  onClick={loadGame}
                />
              ))}
            </div>

            {/* Sandbox */}
            <div className="flex-1 min-w-0">
              <GameSandbox
                game={selectedGame}
                htmlCode={gameHtml}
                isLoading={isLoadingGame}
                error={gameError}
                onRegenerate={handleRegenerate}
                onClose={handleClose}
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {games.length === 0 && !isGeneratingList && !listError && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-center font-mono">
              <div className="text-6xl mb-6 opacity-30">&#128126;</div>
              <p className="text-[#333] text-sm uppercase tracking-widest mb-2">
                [ NO GAMES LOADED ]
              </p>
              <p className="text-[#222] text-xs">
                Enter a theme above and press Generate
              </p>
              <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                  "space shooter with power-ups",
                  "wizard dungeon crawler",
                  "retro platformer with coins",
                  "snake game in a maze",
                  "asteroid dodge game",
                  "brick breaker fantasy",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-1 border border-[#1a1a1a] text-[#333] hover:border-[#00ff41]/40 hover:text-[#00ff41]/70 text-[10px] uppercase tracking-wider transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isGeneratingList && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-center font-mono">
              <Loader2 className="w-8 h-8 text-[#00ff41] animate-spin mx-auto mb-4" />
              <p
                className="text-[#00ff41] text-sm uppercase tracking-widest mb-1"
                style={{ textShadow: "0 0 8px #00ff41" }}
              >
                Thinking up games...
              </p>
              <p className="text-[#333] text-xs">
                AI is brainstorming ideas based on your prompt
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
