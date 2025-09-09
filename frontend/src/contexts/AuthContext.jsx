import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import {
  loginUser as apiLogin,
  signupUser as apiSignup,
  getUserProfile,
  updateUserProfile as apiUpdateProfile,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // This is the single source of truth for fetching the user's profile.
  const fetchProfile = async () => {
    try {
      const { data } = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  // --- REFACTORED useEffect HOOKS ---

  // Effect 1: Handles the initial session check and stops the main loading screen.
  // It's only responsible for determining if a user is logged in.
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false); // Stop the main loading screen immediately after checking.
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Effect 2: Fetches the user's profile data *after* the user's auth state is known.
  // This runs separately and does not block the main application from rendering.
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      // Clear profile when the user logs out
      setProfile(null);
    }
  }, [user]); // This hook runs only when the `user` object changes.

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password);
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    // The onAuthStateChange listener will handle setting the user and triggering the profile fetch.
    return { user: data.user };
  };

  const signup = async (email, password, profileData) => {
    const { data } = await apiSignup(email, password, profileData);
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    // The listener will handle the rest.
    return { user: data.user };
  };

  const logout = () => supabase.auth.signOut();

  // A single function to update the global state after a profile change.
  const updateGlobalProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const value = {
    user,
    profile,
    loading,
    login,
    signup,
    logout,
    updateGlobalProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
