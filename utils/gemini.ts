import axios from "axios";

interface SongArtistPair {
  song: string;
  artist: string;
}

export const generatePlaylist = async (
  prompt: string,
  token: string
): Promise<SongArtistPair[]> => {
  const response = await axios.post(
    "/api/generate-playlist",
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to generate playlist");
  }

  return response.data; // Return the array of SongArtistPair directly
};

export const savePlaylist = async (
  playlist: { name: string; tracks: string[] },
  token: string
): Promise<void> => {
  const response = await axios.post("/api/save-playlist", playlist, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 201) {
    throw new Error(response.data.error || "Failed to save playlist");
  }
};
