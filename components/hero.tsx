export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
          Elevate your day with some good{" "}
          <span className="font-bold">Music</span>🎵
        </p>
      </div>
      <div className="flex gap-8 justify-center items-center">
        <a
          className="font-bold hover:underline"
          rel="noopener noreferrer"
          href="/playlists"
        >
          Generate Playlist
        </a>
        <a className="font-bold hover:underline">Check your saved playlists</a>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
