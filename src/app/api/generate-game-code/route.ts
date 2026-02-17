import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyApc6DiahomoIqwzBVNywfoT23QAKtpnvY");

export async function POST(req: NextRequest) {
  try {
    const { game, originalPrompt } = await req.json();

    if (!game || !game.name) {
      return NextResponse.json({ error: "Game data is required" }, { status: 400 });
    }

  

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an expert game developer. Create a fully working, complete, standalone HTML5 game.

Game to create:
- Name: ${game.name}
- Description: ${game.description}
- Genre: ${game.genre}
- Original theme: ${originalPrompt}

Requirements:
1. Return ONLY the complete HTML document. No markdown. No explanation. No code fences.
2. The game must be fully self-contained in a single HTML file with embedded CSS and JavaScript.
3. Include a visible score display, game over screen, and restart button.
4. The game must be immediately playable - no loading required.
5. Use CSS pixel fonts or monospace fonts for a retro feel.
6. The canvas or game area should fill most of the viewport (min 90vh height).
7. Include clear on-screen instructions for controls.
8. Make the game fun, engaging, and fully functional - not just a skeleton.
9. Handle keyboard events properly (arrow keys, WASD, spacebar as appropriate).
10. Add sound effects using the Web Audio API (beeps, boops - simple synthesized sounds).
11. The game must work perfectly inside a sandboxed iframe (no external dependencies, no localStorage, no cookies).

Create the complete, playable game now:`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    // Strip markdown code fences if present
    let htmlCode = text.trim();
    if (htmlCode.startsWith("```html")) {
      htmlCode = htmlCode.replace(/^```html\n?/, "").replace(/\n?```$/, "");
    } else if (htmlCode.startsWith("```")) {
      htmlCode = htmlCode.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    // Basic validation
    if (!htmlCode.includes("<html") && !htmlCode.includes("<!DOCTYPE")) {
      return NextResponse.json(
        { error: "AI did not return valid HTML" },
        { status: 500 }
      );
    }

    return NextResponse.json({ html: htmlCode });
  } catch (error: unknown) {
    console.error("Error generating game code:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate game code: ${message}` },
      { status: 500 }
    );
  }
}
