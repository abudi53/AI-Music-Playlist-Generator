import { Geist } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "../components/RootLayoutClient";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AI Music Playlist Generator",
  description: "AI Music Playlist Generator",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Navbar user={user} />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
