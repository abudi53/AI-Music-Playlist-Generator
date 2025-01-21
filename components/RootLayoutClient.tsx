// app/components/RootLayoutClient.tsx
"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import BongoCat from "@/components/bongoCat/dist/BongoCat";

interface Props {
  children: React.ReactNode;
}

const RootLayoutClient: React.FC<Props> = ({ children }) => {
  // const { isLoading } = useAuth();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center overflow-y-auto">
          <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>
          <footer className="w-full flex items-center justify-center border-t mx-auto mt-auto text-center text-xs gap-8 py-16">
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
          <BongoCat />
        </div>
      </main>
      <Toaster />
    </ThemeProvider>
  );
};

export default RootLayoutClient;
