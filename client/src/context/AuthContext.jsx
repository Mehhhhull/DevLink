import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not authed

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const res = await fetch("/api/auth/profile", { credentials: "include" });
      if (!res.ok) {
        console.log('Profile fetch failed:', res.status);
        setUser(null);
        return;
      }
      const data = await res.json();
      console.log('Profile fetched successfully:', data.email);
      setUser(data);
    } catch (e) {
      console.error('Profile fetch error:', e);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      // Clear backend session
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      
      // Clear frontend state
      clearAuthState();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      clearAuthState();
    }
  };

  const clearAuthState = () => {
    console.log('Clearing auth state');
    setUser(null);
  };

  const forceRefresh = async () => {
    console.log('Force refreshing auth state');
    setUser(undefined); // Set to loading
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refresh: fetchProfile, clearAuthState, forceRefresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
