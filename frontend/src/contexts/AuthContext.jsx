// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error (maybe RLS):", error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Unexpected profile fetch error:", err);
      setProfile(null);
    }
  };
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setUser(session?.user ?? null);

          // Don't block on profile; render children even if profile fails
          fetchProfile(session?.user ?? null).finally(() => {
            if (isMounted) setLoading(false);
          });
        }
      } catch (err) {
        console.error("Error during initAuth:", err);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const { subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        setUser(session?.user ?? null);
        fetchProfile(session?.user ?? null).finally(() => {
          if (isMounted) setLoading(false);
        });
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    signUp: (email, password, metadata) =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: metadata.fullName, role: metadata.role },
        },
      }),
    login: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    logout: () => supabase.auth.signOut(),
  };

  // Always render children; show loading overlay instead of blocking render
  return (
    <AuthContext.Provider value={value}>
      {children}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
          Loading...
        </div>
      )}
    </AuthContext.Provider>
  );
};
