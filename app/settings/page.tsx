"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Settings
  useEffect(() => {
    const load = async () => {
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
        console.error("Settings load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) return <p className="p-6">Loading settings...</p>;

  // SAVE SETTINGS
  const save = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const ref = doc(db, "users", user.uid);

      await updateDoc(ref, {
        name,
        bio,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Settings update error:", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-6">

        {/* NAME */}
        <div>
          <label className="text-gray-300 mb-1 block">Name</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded w-full text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* BIO */}
        <div>
          <label className="text-gray-300 mb-1 block">Bio</label>
          <textarea
            className="bg-neutral-800 border border-neutral-700 p-2 rounded w-full text-white h-32"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* BACK */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-neutral-800 border border-neutral-600 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Cancel
      </button>
    </div>
  );
}
