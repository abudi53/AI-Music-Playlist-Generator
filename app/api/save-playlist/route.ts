// app/api/save-playlist/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface Playlist {
  name: string;
  tracks: string[];
}

export async function POST(req: NextRequest) {
  console.log("Hello from save-playlist/route.ts");

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
    const { name, tracks } = reqBody as Playlist;

    if (!name || !tracks || !Array.isArray(tracks)) {
      return NextResponse.json(
        { error: "Invalid playlist data" },
        { status: 400 }
      );
    }

    // Save the playlist to Supabase
    const { error: insertError } = await supabase
      .from("Playlists")
      .insert([{ name, tracks, user_id: user.id }]);

    if (insertError) {
      console.error("Error saving playlist to Supabase:", insertError);
      return NextResponse.json(
        { error: "Failed to save playlist to Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Playlist saved successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving playlist:", error);
    return NextResponse.json(
      { error: "Failed to save playlist" },
      { status: 500 }
    );
  }
}
