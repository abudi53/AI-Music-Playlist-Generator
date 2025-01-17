"use client";

import React from "react";
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

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
}

interface Props {
  playlists: Playlist[];
}

const SavedPlaylists: React.FC<Props> = ({ playlists }) => {
  if (!playlists || playlists.length === 0) {
    return <div>No saved playlists yet.</div>;
  }

  return (
    <div>
      <h2 className="text-center text-3xl mb-8">Saved Playlists</h2>
      <ul className="mt-4 flex flex-wrap gap-4 place-content-center">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="mb-2">
            <Card className="w-96 h-96 overflow-auto">
              <CardHeader>
                <CardTitle>{playlist.name}</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
            {/* <div className="flex justify-between items-center">
                <span>{playlist.name}</span>
              </div>
              <ul className="ml-4 mt-1">
                {playlist.tracks.map((track, index) => (
                  <li key={index}>{track}</li>
                ))}
              </ul>
            </Card> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPlaylists;
