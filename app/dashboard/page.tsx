// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

interface UserRecord {
  name?: string;
  role?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as UserRecord;
          setProfile(data);

          // Auto-redirect based on role
          if (data.role === "creator") router.push("/creatorhub");
          else if (data.role === "vendor") router.push("/vendorhub");
          else if (data.role === "investor") router.push("/investorhub");
          else if (data.role === "lawyer") router.push("/lawyerhub");
          else if (data.role === "ceo") router.push("/ceohub");
        }
      } catch (err) {
        console.error("Error loading dashboard profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  // If profile not found: show message
  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-gray-400">Please complete your profile setup.</p>

        <button
          onClick={() => router.push("/profile/edit")}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded font-semibold"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  // Fallback UI if role doesn't redirect automatically
  return (
    <div className="p-6 space-y-5">
      <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
      <p className="text-gray-400">Redirecting you to your hub...</p>
    </div>
  );
}
