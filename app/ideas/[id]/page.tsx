// app/ideas/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

interface IdeaRecord {
  title: string;
  description: string;
  owner: string;
  createdAt?: any;
}

export default function IdeaDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = auth.currentUser;

  const [idea, setIdea] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdea = async () => {
      try {
        const ref = doc(db, "ideas", params.id);
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
  }, [params.id]);

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

  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold">{idea.title}</h1>

      {/* Meta */}
      <p className="text-gray-400 text-sm">
        Posted: {idea.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
      </p>

      {/* Description */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-300 leading-7 whitespace-pre-line">
          {idea.description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/ideas")}
          className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
        >
          Back to Ideas
        </button>

        {/* Only show edit if owner */}
        {idea.owner === user.uid && (
          <button
            onClick={() => router.push(`/ideas/edit/${params.id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
          >
            Edit Idea
          </button>
        )}
      </div>
    </div>
  );
}
