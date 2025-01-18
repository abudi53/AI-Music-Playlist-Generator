import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SavedPlaylists from "@/components/SavedPlaylists";

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
}

export default async function savedPlaylists() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch saved playlists
  const { data: playlists, error } = await supabase
    .from("Playlists")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved playlists:", error);
    return <div>Error fetching saved playlists.</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <SavedPlaylists playlists={playlists || []} />
    </div>
  );
}
