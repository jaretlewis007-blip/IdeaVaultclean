"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function UserProfilePage() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;

      try {
        const ref = doc(db, "users", uid as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser(snap.data());
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }

      setLoading(false);
    };

    fetchUser();
  }, [uid]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      <div className="bg-gray-100 p-4 rounded-lg space-y-2">
        <p><strong>Name:</strong> {user.name || "No name provided"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined:</strong> {user.createdAt ? user.createdAt.toString() : "N/A"}</p>
      </div>
    </div>
  );
}
