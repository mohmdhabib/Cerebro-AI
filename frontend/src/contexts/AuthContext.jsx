import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { loginUser } from "../services/api"; // Import the loginUser function

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function checks if there's an active session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // This listener updates the user state when auth state changes (e.g., on logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // UPDATED LOGIN FUNCTION
  const login = async (email, password) => {
    // Call our Flask backend to log in
    const { data } = await loginUser(email, password);

    // After getting the session from our backend, set it in the Supabase client
    const { error } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token, // Make sure your backend returns this!
    });

    if (error) throw error;

    setUser(data.user);
    return { user: data.user, error: null };
  };

  const logout = () => supabase.auth.signOut();

  const value = {
    user,
    login,
    logout,
    loading,
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
