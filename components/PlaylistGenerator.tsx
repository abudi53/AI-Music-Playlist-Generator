"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { generatePlaylist, savePlaylist } from "@/utils/gemini";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import SpotifyIcon from "@/components/icons/spotify.svg";
import YoutubeIcon from "@/components/icons/youtube.svg";
interface Playlist {
  id: string;
  name: string;
  tracks: {
    song: string;
    artist: string;
    links: {
      youtube?: string;
      spotify?: string;
    };
  }[];
}

const PlaylistGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [playlist, setPlaylist] = useState<Playlist | null>(null); // Changed to single playlist
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  const supabase = createClient();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.getSession();
      const token = data?.session?.access_token || ""; //
      const generatedSongArtistPairs = await generatePlaylist(prompt, token);

      const generatedPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name: prompt,
        tracks: generatedSongArtistPairs.map((item) => ({
          song: item.song,
          artist: item.artist,
          links: item.links,
        })),
      };

      setPlaylist(generatedPlaylist); // Set the single playlist
    } catch (err: any) {
      setError(err.message || "An error occurred while generating playlists.");
    } finally {
      setLoading(false);
    }
  };

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!playlist) {
      toast({
        title: "No playlist to save.",
        description: "Please generate a playlist first.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSaving(true);
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) throw new Error("User not authenticated.");
      const token = data.session.access_token;

      await savePlaylist(
        { name: playlist.name, tracks: playlist.tracks },
        token
      );
      toast({
        title: "Playlist saved successfully!",
        description: "You can check your saved playlists here.",
        action: (
          <ToastAction
            altText="View"
            onClick={() => router.push("/saved-playlists")} // Use router.push for navigation
          >
            View
          </ToastAction>
        ),
      });
    } catch (err: any) {
      toast({
        title: "Failed to save playlist.",
        description:
          err.message || "An error occurred while saving the playlist.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
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
          <div className="flex justify-between items-center mb-3">
            <span>{playlist.name}</span>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
          <Table className="w-full mt-4">
            <TableCaption>Generated Playlist</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Song</TableHead>
                <TableHead className="text-center">Artist</TableHead>
                <TooltipProvider>
                  <TableHead className="text-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <TooltipContent>
                          Sometimes links may not work.
                        </TooltipContent>
                        Links
                      </TooltipTrigger>
                    </Tooltip>
                  </TableHead>
                </TooltipProvider>
                {/* <TableHead className="text-center">Links</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlist.tracks.map((track, index) => {
                console.log("track", track);
                return (
                  <TableRow key={index}>
                    <TableCell>{track.song}</TableCell>
                    <TableCell className="text-center">
                      {track.artist}
                    </TableCell>
                    <TableCell className="text-center flex items-center gap-3 h-full">
                      {track.links?.youtube && (
                        <a
                          href={track.links.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <YoutubeIcon width="32" height="32" fill="#FF0000" />
                        </a>
                      )}
                      {track.links?.spotify && (
                        <a
                          href={track.links.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <SpotifyIcon width="32" height="32" fill="#1DB954" />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;
