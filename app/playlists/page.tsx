import React from "react";
import PlaylistGenerator from "@/components/PlaylistGenerator";

const Playlists: React.FC = () => {
  return (
    <div className="container mx-auto p-4 h-full">
      <h1 className="text-3xl text-center font-bold mb-2">
        Generate Your Music Playlist
      </h1>
      <p className="text-lg text-center mb-2 w-full max-w-md mx-auto">
        How are you feeling today? A singer, album, or maybe a movie or tv
        series you liked.
      </p>
      <PlaylistGenerator />
    </div>
  );
};

export default Playlists;
