"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function IdeaDetails() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIdea() {
      if (!id) return;

      try {
        const ref = doc(db, "ideas", id as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setIdea(snap.data());
        }
      } catch (err) {
        console.error("Error loading idea:", err);
      }

      setLoading(false);
    }

    fetchIdea();
  }, [id]);

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (!idea) return <p className="text-center p-10">Idea not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
      <p className="text-gray-300 mb-6">{idea.description}</p>

      <div className="p-4 bg-neutral-800 rounded-lg">
        <p className="text-sm text-gray-400">Posted by: {idea.ownerEmail}</p>
      </div>
    </div>
  );
}
