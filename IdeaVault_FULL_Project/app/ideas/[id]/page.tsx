"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return;

      try {
        const ref = doc(db, "ideas", id as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setIdea(snap.data());
        }
      } catch (error) {
        console.error("Error loading idea:", error);
      }

      setLoading(false);
    };

    fetchIdea();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!idea) return <div className="p-6">Idea not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>

      <p className="text-gray-700 mb-6">{idea.description}</p>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p><strong>Category:</strong> {idea.category}</p>
        <p><strong>Created By:</strong> {idea.userEmail}</p>
      </div>
    </div>
  );
}
