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

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
}

interface Props {
  playlists: Playlist[];
}

const SavedPlaylists: React.FC<Props> = ({ playlists: initialPlaylists }) => {
  const supabase = createClient();
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);

  const { toast } = useToast();

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
    <div>
      <h2 className="text-center text-3xl mb-8">Saved Playlists</h2>
      <ul className="mt-4 flex flex-wrap gap-4 place-content-center">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="mb-2">
            <Card className="max-w-96 h-96 overflow-auto">
              <CardHeader className="sticky top-0 bg-inherit z-10">
                <CardTitle>{playlist.name}</CardTitle>
              </CardHeader>
              <CardContent className="h-64 w-11/12">
                <Table className="w-full mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Song</TableHead>
                      <TableHead className="text-center">Artist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playlist.tracks.map((track, index) => {
                      const [song, artist] = track.split(" by ");
                      return (
                        <TableRow key={index}>
                          <TableCell>{song}</TableCell>
                          <TableCell className="text-center">
                            {artist}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Button
                  onClick={() => handleDelete(playlist.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded ml-auto mt-4 mb-4"
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
