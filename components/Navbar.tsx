"use client";

import React from "react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

interface NavbarProps {
  user: any; // Ideally use the correct type, e.g., `User | null`
}

const Navbar = ({ user }: NavbarProps) => {
  let displayName = "";
  if (user) {
    displayName = user.email.replace(/@.*/, "");
  }
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>AI Music Playlist Generator 🎵</Link>
          <div className="flex items-center gap-2"></div>
        </div>
        <div className="flex gap-5 items-center font-semibold">
          {user ? (
            <div className="flex gap-8 items-center font-semibold">
              <span>Welcome, {displayName} </span>
              <button onClick={signOutAction}>Sign Out</button>
            </div>
          ) : (
            <>
              <Link href="/sign-in">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
