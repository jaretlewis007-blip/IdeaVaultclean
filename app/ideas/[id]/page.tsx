// app/ideas/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt?: any;
  ownerId?: string;
}

export default function IdeaDetails() {
  const { id } = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return;

      try {
        const ref = doc(db, "ideas", id as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setIdea({
            id: snap.id,
            ...snap.data(),
          } as Idea);
        }
      } catch (err) {
        console.error("Error loading idea:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading idea...</p>;
  }

  if (!idea) {
    return <p className="p-6">Idea not found.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{idea.title}</h1>
      <p className="text-gray-300">{idea.description}</p>
      {idea.createdAt && (
        <p className="text-gray-400 text-sm">
          Created: {idea.createdAt.toDate?.().toLocaleString?.() || "N/A"}
        </p>
      )}
    </div>
  );
}
