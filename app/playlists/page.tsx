import React from "react";
import PlaylistGenerator from "@/components/PlaylistGenerator";

const Playlists: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Generate Your Music Playlist</h1>
      <PlaylistGenerator />
    </div>
  );
};

export default Playlists;
