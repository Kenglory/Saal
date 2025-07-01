'use client';

import { useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { getRouteForUser } from '@/lib/getRouteForUser';


export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const path = getRouteForUser(user.uid);     
      router.push(path);
    }
  }, [user, loading, router]);

useEffect(() => {
  if (!loading && user) {
    console.log("✅ USER LOGGATO:", user); // 👈 aggiungi qui
    const path = getRouteForUser(user.uid);
    router.push(path);
  }
}, [user, loading, router]);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Errore nel login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Login con Google</h1>
      <button
        onClick={loginWithGoogle}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Accedi con Google
      </button>
    </div>
  );
}