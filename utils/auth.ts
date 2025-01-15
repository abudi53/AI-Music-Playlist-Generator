// utils/auth.ts
import { createClient } from "@/utils/supabase/client";

export const signOut = async (router: any) => {
  const supabase = createClient();

  try {
    await supabase.auth.signOut();
    // Redirect to the sign-in page after successful sign-out
    router.push("/");
  } catch (error) {
    console.error("Error signing out:", error);
    // Handle the error (e.g., display an error message)
  }
};
