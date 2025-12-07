// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface UserProfile {
  name?: string;
  email?: string;
  role?: string;
  bio?: string;
  createdAt?: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        router.push("/signin");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, router]);

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-6">Profile not found.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="bg-neutral-800 p-4 rounded-lg space-y-2">
        <p className="text-gray-300">
          <span className="font-semibold">Name:</span> {profile.name}
        </p>

        <p className="text-gray-300">
          <span className="font-semibold">Email:</span> {profile.email}
        </p>

        <p className="text-gray-300">
          <span className="font-semibold">Role:</span> {profile.role}
        </p>

        {profile.bio && (
          <p className="text-gray-400">Bio: {profile.bio}</p>
        )}

        {profile.createdAt && (
          <p className="text-gray-500 text-sm">
            Joined: {profile.createdAt.toDate?.().toLocaleString?.()}
          </p>
        )}
      </div>

      <button
        onClick={() => router.push(`/profile/edit`)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Edit Profile
      </button>
    </div>
  );
}
