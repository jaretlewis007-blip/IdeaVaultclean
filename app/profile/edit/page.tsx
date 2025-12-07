// app/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setRole(data.role || "");
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

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  const saveChanges = async () => {
    setSaving(true);

    try {
      const ref = doc(db, "users", user.uid);

      await updateDoc(ref, {
        name,
        role,
        bio,
      });

      router.push(`/profile/${user.uid}`);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-10 max-w-xl">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-5">
        {/* NAME */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Name</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
          />
        </div>

        {/* ROLE */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Role</label>
          <select
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="creator">Creator</option>
            <option value="vendor">Vendor</option>
            <option value="investor">Investor</option>
            <option value="lawyer">Lawyer</option>
            <option value="ceo">CEO</option>
          </select>
        </div>

        {/* BIO */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Bio</label>
          <textarea
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white h-40"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveChanges}
          disabled={saving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => router.push(`/profile/${user.uid}`)}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Cancel
      </button>
    </div>
  );
}
