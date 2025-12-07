// app/ideas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface IdeaRecord {
  id: string;
  title: string;
  description: string;
  owner: string;
  createdAt?: any;
}

export default function IdeasListPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const ref = collection(db, "ideas");
        const q = query(ref, orderBy("createdAt", "desc"));

        const snap = await getDocs(q);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as IdeaRecord),
        }));

        setIdeas(list);
      } catch (err) {
        console.error("Error loading ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading ideas...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Ideas</h1>
      <p className="text-gray-400">Browse ideas created across IdeaVault.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.length === 0 ? (
          <p className="text-gray-400">No ideas posted yet.</p>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => router.push(`/ideas/${idea.id}`)}
              className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
            >
              <h2 className="text-xl font-semibold">{idea.title}</h2>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {idea.description}
              </p>
              <div className="text-gray-500 text-xs mt-3">
                Added: {idea.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Button to Create a New Idea */}
      <button
        onClick={() => router.push("/ideas/upload")}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold mt-6"
      >
        + New Idea
      </button>
    </div>
  );
}
