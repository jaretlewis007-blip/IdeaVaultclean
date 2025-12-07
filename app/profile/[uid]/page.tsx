"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function UserProfile() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const ref = doc(db, "users", uid as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser(snap.data());
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }

      setLoading(false);
    }

    loadUser();
  }, [uid]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!user) return <p className="p-10">User not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{user.name}</h1>

      <div className="bg-neutral-800 p-4 rounded-lg">
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Joined: {user.createdAt?.toDate().toLocaleString()}</p>
      </div>
    </div>
  );
}
