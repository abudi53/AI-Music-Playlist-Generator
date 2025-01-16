// app/components/RootLayoutClient.tsx
"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Props {
  children: React.ReactNode;
}

const RootLayoutClient: React.FC<Props> = ({ children }) => {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data?.session);
    };

    checkAuth();

    supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session); // triggers re-render
    });
  }, [supabase]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={"/"}>AI Music Playlist Generator</Link>
                <div className="flex items-center gap-2"></div>
              </div>
              <div className="flex gap-5 items-center font-semibold">
                {isLoggedIn ? (
                  <button onClick={signOutAction}>Sign Out</button>
                ) : (
                  <>
                    <Link href="/sign-in">Sign In</Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    </ThemeProvider>
  );
};

export default RootLayoutClient;
