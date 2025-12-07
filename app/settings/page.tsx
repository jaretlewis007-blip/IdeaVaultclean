// app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SettingsPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setRole(data.role || "");
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };

    loadData();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  const saveChanges = async () => {
    if (!user) return;
    setSaving(true);

    try:
    {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        name,
        role,
      });
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-400">Manage your profile & account settings.</p>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Display Name</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Role</label>
          <select
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="creator">Creator</option>
            <option value="vendor">Vendor</option>
            <option value="lawyer">Lawyer</option>
            <option value="investor">Investor</option>
            <option value="ceo">CEO</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={saveChanges}
          disabled={saving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded mt-3 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
