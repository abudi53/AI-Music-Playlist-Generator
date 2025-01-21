"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface AuthContextType {
  //   session: Session | null;
  //   isLoading: boolean;
  //   signOut: () => Promise<void>;
  //   signIn: (formData: FormData) => Promise<void>;
  user: User | null; // Update the type to User | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  //   session: null,
  //   isLoading: true,
  //   signOut: async () => {},
  //   signIn: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null); // Explicitly type the state
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => subscription.unsubscribe(); // Clean up the subscription
//   }, []);

//   //   const signIn = async (
//   //     provider: "google" | "github" | "email" | "password"
//   //   ) => {
//   //     setIsLoading(true);
//   //     if (provider === "email" || provider === "password") {
//   //       // Handle email/password sign-in separately
//   //       console.error(
//   //         "Email/password sign-in not directly supported in this example. Implement separately."
//   //       );
//   //       return;
//   //     }
//   //     await supabase.auth.signInWithOAuth({ provider });
//   //     setIsLoading(false);
//   //   };
//   const signIn = async (formData: FormData) => {
//     setIsLoading(true);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     // if (error) {
//     //   return encodedRedirect("error", "/sign-in", error.message);
//     // }

//     setIsLoading(false);
//   };

//   const signOut = async () => {
//     setIsLoading(true);
//     await supabase.auth.signOut();
//     setIsLoading(false);
//   };

//   const value: AuthContextType = {
//     session,
//     isLoading,
//     signIn,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);
// // app/auth/callback/route.ts
