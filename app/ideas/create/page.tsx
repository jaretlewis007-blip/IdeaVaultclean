// app/ideas/create/page.tsx
"use client";

import { useState } from "react";
import { db, auth } from "../../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CreateIdeaPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/signin");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "ideas"), {
        title,
        description,
        ownerId: user.uid,
        ownerEmail: user.email,
        createdAt: serverTimestamp(),
      });

      router.push("/ideas");
    } catch (err) {
      console.error("Error creating idea:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Create a New Idea</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-300 mb-1">Title</label>
          <input
            type="text"
            className="w-full p-3 rounded bg-neutral-800 text-white border border-neutral-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter idea title..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full p-3 rounded bg-neutral-800 text-white border border-neutral-700 h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea..."
          />
        </div>

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Idea"}
        </button>
      </form>
    </div>
  );
}
