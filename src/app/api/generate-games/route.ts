import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

   

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a creative game designer. Based on the user's prompt, generate exactly 6 unique mini game ideas that can be implemented as browser-based HTML5/Canvas games.

For each game, provide:
1. A short catchy name (max 4 words)
2. A brief description (1-2 sentences)
3. A genre tag (e.g. "Puzzle", "Action", "Arcade", "Platformer", "Strategy", "Shooter")
4. An emoji icon that represents the game

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "games": [
    {
      "id": "game-1",
      "name": "Game Name",
      "description": "Brief description of the game.",
      "genre": "Arcade",
      "icon": "🎮"
    }
  ]
}

User prompt: "${prompt}"`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse game ideas from AI response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Error generating games:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate games: ${message}` },
      { status: 500 }
    );
  }
}
