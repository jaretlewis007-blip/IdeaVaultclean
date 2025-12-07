"use client";

import { useState } from "react";
import { auth, db } from "../../../firebase/config";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export default function EditProfile() {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setMessage("");

      // Update Firebase Auth displayName
      await updateProfile(user, {
        displayName: displayName,
      });

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName });

      setMessage("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>

      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-md">
        <form onSubmit={handleUpdate}>
          <label className="block mb-2 text-gray-300">Display Name</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}
