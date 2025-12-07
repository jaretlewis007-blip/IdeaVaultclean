// app/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load current user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        name,
        bio,
      });

      router.push(`/profile/${user.uid}`);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* Name */}
        <label className="flex flex-col">
          <span className="text-sm text-gray-300 mb-1">Name</span>
          <input
            className="p-2 rounded bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>

        {/* Bio */}
        <label className="flex flex-col">
          <span className="text-sm text-gray-300 mb-1">Bio</span>
          <textarea
            className="p-2 rounded bg-gray-800 text-white h-28"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
          />
        </label>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
