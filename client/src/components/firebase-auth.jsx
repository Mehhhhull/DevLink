import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithRedirect, signInWithPopup, getRedirectResult, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function FirebaseAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user: backendUser, setUser: setAuthUser, refresh } = useAuth();

  // Check for redirect result on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await processFirebaseUser(result.user);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        setError(error.message || "Sign in failed");
      }
    };

    handleRedirectResult();
  }, []);

  const processFirebaseUser = async (firebaseUser) => {
    try {
      setLoading(true);
      
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
        navigate('/'); // Fixed: redirect to root instead of /dashboard
      }
    } catch (error) {
      console.error('Process Firebase user error:', error);
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      // Try popup first, fallback to redirect
      try {
        const result = await signInWithPopup(auth, provider);
        if (result && result.user) {
          await processFirebaseUser(result.user);
        }
      } catch (popupError) {
        // If popup is blocked or fails, use redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
          console.log('Popup blocked, using redirect...');
          await signInWithRedirect(auth, provider);
          return; // Don't set loading to false here as redirect will handle it
        } else {
          throw popupError;
        }
      }
    } catch (signInError) {
      console.error('Sign in error:', signInError);
      setError(signInError.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      // Clear backend session first
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear auth state
      setAuthUser(null);
      
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
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 transition text-white rounded-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </>
      ) : (
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      )}
      {error && (
        <div className="text-xs text-rose-300 max-w-xs">
          {error}
          {error.includes('popup-blocked') && (
            <div className="mt-1">
              <button 
                onClick={() => setError("")}
                className="text-indigo-400 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
