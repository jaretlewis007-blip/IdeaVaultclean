// app/ideas/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface IdeaRecord {
  title: string;
  description: string;
  owner: string;
}

export default function EditIdeaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = auth.currentUser;

  const [idea, setIdea] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load the idea first
  useEffect(() => {
    const loadIdea = async () => {
      try {
        const ref = doc(db, "ideas", params.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as IdeaRecord;

          // Only owner can edit
          if (data.owner !== user?.uid) {
            router.push(`/ideas/${params.id}`);
            return;
          }

          setIdea(data);
          setTitle(data.title);
          setDescription(data.description);
        } else {
          setIdea(null);
        }
      } catch (err) {
        console.error("Error loading idea:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadIdea();
  }, [params.id, user, router]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading idea...</p>;
  }

  if (!idea) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Idea Not Found</h1>
        <button
          onClick={() => router.push("/ideas")}
          className="mt-4 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
        >
          Back to Ideas
        </button>
      </div>
    );
  }

  const saveChanges = async () => {
    setSaving(true);

    try {
      const ref = doc(db, "ideas", params.id);
      await updateDoc(ref, {
        title,
        description,
      });

      router.push(`/ideas/${params.id}`);
    } catch (err) {
      console.error("Error saving idea:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Edit Idea</h1>
      <p className="text-gray-400">Modify your idea details.</p>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Idea Title</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Description</label>
          <textarea
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white h-40"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={saveChanges}
          disabled={saving}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push(`/ideas/${params.id}`)}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Cancel
      </button>
    </div>
  );
}
