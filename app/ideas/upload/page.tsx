// app/ideas/upload/page.tsx
"use client";

import { useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function UploadIdeaPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    router.push("/signin");
    return null;
  }

  const storage = getStorage();

  const handleUpload = async () => {
    if (!title.trim()) return alert("Title is required.");
    if (!description.trim()) return alert("Description is required.");

    setUploading(true);

    try {
      let fileUrl = "";

      // Upload file (optional)
      if (file) {
        const fileRef = ref(storage, `ideas/${user.uid}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      // Save idea to Firestore
      await addDoc(collection(db, "ideas"), {
        ownerId: user.uid,
        title,
        description,
        fileUrl,
        createdAt: serverTimestamp(),
      });

      router.push("/ideas");
    } catch (err) {
      console.error("Idea upload error:", err);
      alert("Failed to upload idea. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Upload New Idea</h1>
      <p className="text-gray-400">
        All ideas are automatically protected under the IdeaVault NDA System.
      </p>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-6">

        {/* TITLE */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Idea Title</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            placeholder="Example: Smart Coffee Sleeve"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Description</label>
          <textarea
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white h-40"
            placeholder="Explain your idea in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Upload File (Optional)</label>
          <input
            type="file"
            className="text-gray-300"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Submit Idea"}
        </button>
      </div>

      {/* Cancel */}
      <button
        onClick={() => router.push("/ideas")}
        className="bg-neutral-800 border border-neutral-600 py-2 px-4 rounded hover:bg-neutral-700"
      >
        Cancel
      </button>
    </div>
  );
}
