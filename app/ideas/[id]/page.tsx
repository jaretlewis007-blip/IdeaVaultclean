// app/ideas/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

interface IdeaRecord {
  title: string;
  description: string;
  fileUrl?: string;
  ownerId?: string;
  createdAt?: any;
}

export default function IdeaDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const user = auth.currentUser;

  const [idea, setIdea] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdea = async () => {
      try {
        const ref = doc(db, "ideas", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setIdea(snap.data() as IdeaRecord);
        } else {
          setIdea(null);
        }
      } catch (err) {
        console.error("Error loading idea:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIdea();
  }, [id]);

  if (loading) return <p className="p-6">Loading idea...</p>;

  if (!idea) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Idea Not Found</h1>
        <p className="text-gray-400">This idea doesn't exist or was removed.</p>

        <button
          onClick={() => router.push("/ideas")}
          className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded font-semibold"
        >
          Back to Ideas
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this idea?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "ideas", id));
      router.push("/ideas");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete idea.");
    }
  };

  const isOwner = idea.ownerId === user?.uid;

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <button
        onClick={() => router.push("/ideas")}
        className="text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-6">

        {/* FILE PREVIEW */}
        {idea.fileUrl && (
          <img
            src={idea.fileUrl}
            alt="Idea File"
            className="w-full h-64 object-cover rounded border border-neutral-700"
          />
        )}

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{idea.title}</h1>

        {/* DESCRIPTION */}
        <p className="text-gray-300 whitespace-pre-line">{idea.description}</p>

        {/* DATE */}
        {idea.createdAt && (
          <p className="text-gray-500 text-sm">
            Created: {idea.createdAt?.toDate?.().toLocaleDateString?.() ?? ""}
          </p>
        )}

        {/* NDA NOTICE */}
        <div className="bg-neutral-800 border border-neutral-600 p-4 rounded text-gray-300 text-sm">
          <strong className="text-yellow-400">NDA Protected:</strong>  
          This idea is automatically protected by the IdeaVault NDA system.  
          Unauthorized copying or sharing is strictly prohibited.
        </div>

        {/* OWNER BUTTONS */}
        {isOwner && (
          <div className="space-y-4 pt-4">
            <button
              onClick={() => router.push(`/ideas/edit/${id}`)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded font-semibold"
            >
              Edit Idea
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
            >
              Delete Idea
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
