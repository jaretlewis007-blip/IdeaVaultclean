// app/profile/[uid]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

interface UserRecord {
  name?: string;
  email?: string;
  role?: string;
  bio?: string;
  createdAt?: any;
}

export default function ViewProfilePage({ params }: { params: { uid: string } }) {
  const router = useRouter();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", params.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data() as UserRecord);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [params.uid]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Profile Not Found</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 max-w-2xl">
      <h1 className="text-3xl font-bold">{profile.name}</h1>

      <div className="space-y-2 text-gray-300">
        <p><span className="font-semibold">Email:</span> {profile.email}</p>
        <p><span className="font-semibold">Role:</span> {profile.role}</p>
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {profile.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
        </p>
      </div>

      {/* Bio */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
        <h2 className="text-xl font-semibold mb-3">Bio</h2>
        <p className="text-gray-300 whitespace-pre-line">
          {profile.bio || "No bio added."}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
        >
          Back
        </button>

        {/* Show Edit button for owner ONLY */}
        {user.uid === params.uid && (
          <button
            onClick={() => router.push("/profile/edit")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
