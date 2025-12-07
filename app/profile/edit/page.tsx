"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setName(data.name || "");
      }
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        name,
      });

      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }

    setSaving(false);
  }

  if (!userData) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <div className="space-y-4">
        <input
          className="w-full p-2 rounded bg-neutral-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-blue-600 py-2 rounded font-bold"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
