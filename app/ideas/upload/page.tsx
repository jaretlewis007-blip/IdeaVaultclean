// app/ideas/upload/page.tsx
"use client";

import { useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadIdeaPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    router.push("/signin");
    return null;
  }

  const submitIdea = async () => {
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);

    try {
      const ref = collection(db, "ideas");

      await addDoc(ref, {
        title,
        description,
        owner: user.uid,
        createdAt: serverTimestamp(),
      });

      router.push("/ideas"); // go back to ideas list
    } catch (err) {
      console.error("Error uploading idea:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Upload New Idea</h1>
      <p className="text-gray-400">Share your idea securely inside IdeaVault.</p>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Idea Title</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            placeholder="e.g. AI-powered tutoring app"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Description</label>
          <textarea
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white h-40"
            placeholder="Describe your idea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submitIdea}
          disabled={submitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Upload Idea"}
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/ideas")}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Back to Ideas
      </button>
    </div>
  );
}
