"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

// ------------ TYPES ------------
interface Idea {
  id: string;
  title?: string;
  description?: string;
  ndaCount?: number; // <-- FIXED: property optional
  [key: string]: any;
}

export default function CreatorProfilePage() {
  const user = auth.currentUser;

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalNDA: 0,
    trendingIdeas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdeas = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "ideas"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);
        const data: Idea[] = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setIdeas(data);

        const totalIdeas = data.length;
        const totalNDA = data.reduce(
          (sum, idea) => sum + (idea.ndaCount ?? 0),
          0
        );
        const trendingIdeas = data.filter(
          (idea) => (idea.ndaCount ?? 0) >= 5
        ).length;

        setStats({
          totalIdeas,
          totalNDA,
          trendingIdeas,
        });
      } catch (err) {
        console.error("Creator Profile Error:", err);
      }

      setLoading(false);
    };

    loadIdeas();
  }, [user]);

  if (loading) return <div className="p-6">Loading your profile…</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Creator Profile</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBox title="Total Ideas" value={stats.totalIdeas} />
        <StatBox title="Total NDAs" value={stats.totalNDA} />
        <StatBox title="Trending Ideas (5+ NDAs)" value={stats.trendingIdeas} />
      </div>

      {/* Ideas */}
      <section>
        <h2 className="text-2xl font-bold mt-4">Your Ideas</h2>
        {ideas.length === 0 ? (
          <p className="text-gray-500 mt-2">No ideas found.</p>
        ) : (
          <ul className="space-y-3 mt-3">
            {ideas.map((idea) => (
              <li key={idea.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="font-bold">{idea.title}</p>
                <p>{idea.description}</p>
                <p className="text-sm mt-2 text-gray-600">
                  NDAs Signed: {idea.ndaCount ?? 0}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatBox({ title, value }: any) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <h3 className="font-bold">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
