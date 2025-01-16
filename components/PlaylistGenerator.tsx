"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { generatePlaylist, savePlaylist } from "@/utils/gemini";

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
}

const PlaylistGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [playlist, setPlaylist] = useState<Playlist | null>(null); // Changed to single playlist
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const user = supabase.auth.getUser();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) throw new Error("User not authenticated.");
      const token = data.session.access_token;

      const generatedSongArtistPairs = await generatePlaylist(prompt, token);

      const generatedPlaylist: Playlist = {
        id: `playlist-${Date.now()}`, // Generate a unique ID
        name: `Playlist based on "${prompt}"`, // Or a more descriptive name
        tracks: generatedSongArtistPairs.map(
          (item) => `${item.song} by ${item.artist}`
        ), // Combine all songs and artists
      };

      setPlaylist(generatedPlaylist); // Set the single playlist
    } catch (err: any) {
      setError(err.message || "An error occurred while generating playlists.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!playlist) {
      alert("No playlist to save.");
      return;
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) throw new Error("User not authenticated.");
      const token = data.session.access_token;

      await savePlaylist(
        { name: playlist.name, tracks: playlist.tracks },
        token
      );
      alert("Playlist saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to save playlist.");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="border p-2 w-full"
        />
      </div>
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Playlist"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {playlist && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span>{playlist.name}</span>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
          <ul className="ml-4 mt-1">
            {playlist.tracks.map((track, index) => (
              <li key={index}>{track}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;
