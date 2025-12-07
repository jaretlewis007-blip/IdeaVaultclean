// app/profile/[uid]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  bio?: string;
  createdAt?: any;
}

export default function UserProfilePage() {
  const { uid } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!uid) return;

      try {
        const ref = doc(db, "users", uid as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser({
            id: snap.id,
            ...snap.data(),
          } as UserProfile);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [uid]);

  if (loading) {
    return <p className="p-6">Loading profile…</p>;
  }

  if (!user) {
    return <p className="p-6">Profile not found.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{user.name || "Unnamed User"}</h1>

      <p className="text-gray-300">Email: {user.email}</p>
      <p className="text-gray-300">Role: {user.role || "N/A"}</p>

      {user.bio && (
        <p className="text-gray-400 mt-4">Bio: {user.bio}</p>
      )}

      {user.createdAt && (
        <p className="text-gray-500 text-sm">
          Joined: {user.createdAt.toDate?.().toLocaleString?.() || "N/A"}
        </p>
      )}
    </div>
  );
}
