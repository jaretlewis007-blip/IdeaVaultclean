// app/ideas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt?: any;
}

export default function IdeasListPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdeas = async () => {
      if (!user) {
        router.push("/signin");
        return;
      }

      try {
        const ref = collection(db, "ideas");
        const q = query(ref, where("ownerId", "==", user.uid));
        const snap = await getDocs(q);

        const data: Idea[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Idea),
        }));

        setIdeas(data);
      } catch (err) {
        console.error("Error loading ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, [user, router]);

  if (loading) {
    return <p className="p-6">Loading your ideas...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Ideas</h1>

      <button
        onClick={() => router.push("/ideas/create")}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
      >
        + Add New Idea
      </button>

      {ideas.length === 0 ? (
        <p className="text-gray-400">You have no ideas yet.</p>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => router.push(`/ideas/${idea.id}`)}
              className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
            >
              <h2 className="text-xl font-bold">{idea.title}</h2>
              <p className="text-gray-400">{idea.description}</p>

              {idea.createdAt && (
                <p className="text-gray-500 text-sm mt-2">
                  Created: {idea.createdAt.toDate?.().toLocaleString?.()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
