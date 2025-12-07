// app/ideas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

interface IdeaRecord {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  createdAt?: any;
}

export default function IdeasPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    router.push("/signin");
    return null;
  }

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const ref = collection(db, "ideas");
        const q = query(ref, where("ownerId", "==", user.uid));
        const snap = await getDocs(q);

        const results = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<IdeaRecord, "id">),
        }));

        setIdeas(results);
      } catch (err) {
        console.error("Error loading ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, [user]);

  if (loading) return <p className="p-6">Loading ideas...</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Ideas</h1>

        <button
          onClick={() => router.push("/ideas/upload")}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 text-black font-semibold rounded"
        >
          + New Idea
        </button>
      </div>

      {ideas.length === 0 ? (
        <div className="text-gray-400">
          <p>You haven't uploaded any ideas yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-neutral-900 p-5 rounded-lg border border-neutral-700 hover:border-yellow-500 transition"
            >
              {/* FILE PREVIEW */}
              {idea.fileUrl && (
                <img
                  src={idea.fileUrl}
                  alt="idea file"
                  className="w-full h-40 object-cover rounded mb-4 border border-neutral-700"
                />
              )}

              {/* TITLE */}
              <h2 className="text-xl font-semibold">{idea.title}</h2>

              {/* DESCRIPTION SNIPPET */}
              <p className="text-gray-400 mt-2 line-clamp-3">{idea.description}</p>

              {/* DATE */}
              {idea.createdAt && (
                <p className="text-gray-500 text-sm mt-2">
                  Created: {idea.createdAt?.toDate?.().toLocaleDateString?.() ?? ""}
                </p>
              )}

              {/* VIEW BUTTON */}
              <Link
                href={`/ideas/${idea.id}`}
                className="block mt-4 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-center py-2 rounded font-semibold"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
