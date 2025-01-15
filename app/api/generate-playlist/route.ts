import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SongArtistPair {
  song: string;
  artist: string;
}

export async function POST(req: NextRequest) {
  console.log("Hello from generate-playlist/route.ts");

  const supabase = await createClient();

  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify JWT token with Supabase
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const reqBody = await req.json();
    const { prompt } = reqBody;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const geminiPrompt: string = `Generate a JSON array of songs based on the following: ${prompt}. Each object in the array should have a "song" key containing the song title and an "artist" key containing the artist's name. Return ONLY the JSON.`;

    const geminiResponse = await model.generateContent(geminiPrompt);
    let text = geminiResponse.response.text();

    // Use a regular expression to extract the JSON
    const jsonMatch = text.match(/(\[.*\]|\{.*\})/s); // Matches JSON arrays or objects

    if (jsonMatch) {
      text = jsonMatch[0]; // Use the first match
    }

    let songs: SongArtistPair[];
    try {
      songs = JSON.parse(text);
      // Basic validation: Ensure it's an array of objects with the correct keys
      if (
        !Array.isArray(songs) ||
        songs.some(
          (item) => typeof item !== "object" || !item.song || !item.artist
        )
      ) {
        console.error("Invalid song data format from Gemini:", songs);
        return NextResponse.json(
          { error: "Invalid song data format from Gemini" },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error("Error parsing Gemini response:", error, text);
      return NextResponse.json(
        { error: "Error parsing song data from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json(songs, { status: 200 });
  } catch (error: any) {
    console.error("Error generating songs:", error);
    return NextResponse.json(
      { error: "Failed to generate songs" },
      { status: 500 }
    );
  }
}
