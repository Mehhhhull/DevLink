import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function FirebaseAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user: backendUser, setUser: setAuthUser, refresh } = useAuth();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const backendResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          firebaseUID: firebaseUser.uid,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Backend login failed");
      }

      const backendUser = await backendResponse.json();
      setAuthUser(backendUser);

      if (backendUser && backendUser.onboardingCompleted === false) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (signInError) {
      console.error('Sign in error:', signInError);
      setError(signInError.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      // Clear backend session
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Refresh auth state
      await refresh();
      
      navigate('/');
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
      setError(logoutError.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // Show auth state based on backend user
  const isAuthenticated = !!backendUser;

  return (
    <div className="inline-flex items-center gap-3">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-slate-100">
            {backendUser.username || backendUser.fullName || backendUser.email}
          </span>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 transition text-white rounded-md active:scale-95"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </>
      ) : (
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95"
        >
          {loading ? "Loading..." : "Sign in with Google"}
        </button>
      )}
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </div>
  );
}
