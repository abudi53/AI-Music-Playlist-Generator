// app/saved-playlists/components/SavedPlaylistsComponent.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface Props {
  playlists: Playlist[];
}

const SavedPlaylists: React.FC<Props> = ({ playlists: initialPlaylists }) => {
  const supabase = createClient();
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);

  const { toast } = useToast();
  console.log("playlists", playlists);

  const handleDelete = async (playlistId: string) => {
    try {
      const { error } = await supabase
        .from("Playlists")
        .delete()
        .eq("id", playlistId);

      if (error) {
        toast({
          title: "Failed to delete playlist.",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Playlist deleted successfully.",
        description: "Your playlist has been deleted.",
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.id !== playlistId)
      );
    } catch (error: any) {
      console.error("Error deleting playlist:", error);
      toast({
        title: "Failed to delete playlist.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!playlists || playlists.length === 0) {
    return <div>No saved playlists yet.</div>;
  }

  return (
    <div className={"flex flex-col items-center"}>
      <h2 className="text-center text-3xl mb-8">Saved Playlists</h2>
      <Link href="/playlists">
        <Button className="text-center">Or generate a new playlist...</Button>
      </Link>
      <ul className="mt-4 flex flex-wrap gap-4 place-content-center">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="mb-2 w-3/6">
            <Card className="h-96 overflow-auto flex items-center flex-col">
              <CardHeader className="sticky top-0 bg-inherit z-10 w-full text-center">
                <CardTitle>{playlist.name}</CardTitle>
              </CardHeader>
              <CardContent className="h-64 w-11/12">
                <Table className="w-full mt-4">
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
                      try {
                        const parsedTrack =
                          typeof track === "string" ? JSON.parse(track) : track;
                        return (
                          <TableRow key={index}>
                            <TableCell>{parsedTrack?.song}</TableCell>
                            <TableCell className="text-center">
                              {parsedTrack?.artist}
                            </TableCell>
                            <TableCell className="text-center flex items-center gap-3 h-full">
                              {parsedTrack?.links?.youtube && (
                                <a
                                  href={parsedTrack.links.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <YoutubeIcon
                                    width="32"
                                    height="32"
                                    fill="#FF0000"
                                  />
                                </a>
                              )}
                              {parsedTrack?.links?.spotify && (
                                <a
                                  href={parsedTrack.links.spotify}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <SpotifyIcon
                                    width="32"
                                    height="32"
                                    fill="#1DB954"
                                  />
                                </a>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      } catch (error: any) {
                        console.error("Error parsing track:", error);
                        return null;
                      }
                    })}
                  </TableBody>
                </Table>
                <Button
                  onClick={() => handleDelete(playlist.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-4 mb-4"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPlaylists;
