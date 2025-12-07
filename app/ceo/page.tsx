"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface PostRecord {
  id: string;
  title?: string;
  description?: string;
  type?: string; // FIX ADDED
  ownerId?: string;
  createdAt?: any;
}

export default function CEOHub() {
  const router = useRouter();
  const user = auth.currentUser;

  const [allPosts, setAllPosts] = useState<PostRecord[]>([]);
  const [investorOffers, setInvestorOffers] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    router.push("/signin");
    return null;
  }

  useEffect(() => {
    const loadAll = async () => {
      try {
        const snap = await getDocs(collection(db, "projects"));
        const results = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Partial<PostRecord>),
        }));

        setAllPosts(results);

        // Filter by type (SAFE now)
        setInvestorOffers(results.filter((p) => p.type === "investor"));
      } catch (err) {
        console.error("CEOHub error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  if (loading) return <p className="p-6">Loading CEO Hub...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">CEO Hub</h1>

      <div className="bg-neutral-900 border border-neutral-700 rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Investor Offers</h2>

        {investorOffers.length === 0 ? (
          <p className="text-gray-400">No investor offers found.</p>
        ) : (
          investorOffers.map((offer) => (
            <div
              key={offer.id}
              className="border border-neutral-700 p-4 rounded mb-3 bg-neutral-800"
            >
              <h3 className="font-semibold">{offer.title}</h3>
              <p className="text-gray-400">{offer.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
