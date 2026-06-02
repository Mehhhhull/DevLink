import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";

export default function FirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

      const backendUser = await backendResponse.json().catch(()=>null);

      setUser(firebaseUser);

      if (backendUser && backendUser.onboardingCompleted === false) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (signInError) {
      setError(signInError.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      await signOut(auth);
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
    } catch (logoutError) {
      setError(logoutError.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-3">
      {user ? (
        <>
          <span className="text-sm text-slate-100">
            {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 transition text-white rounded-md active:scale-95"
          >
            Logout
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
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </div>
  );
}
