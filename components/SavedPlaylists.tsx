// app/saved-playlists/components/SavedPlaylistsComponent.tsx
"use client";

import React from "react";

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
      <h2>Saved Playlists</h2>
      <ul className="mt-4">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{playlist.name}</span>
            </div>
            <ul className="ml-4 mt-1">
              {playlist.tracks.map((track, index) => (
                <li key={index}>{track}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPlaylists;
