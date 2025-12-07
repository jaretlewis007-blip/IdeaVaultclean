// app/marketplace/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface MarketplaceItem {
  title: string;
  description: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

export default function MarketplaceItemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const ref = doc(db, "marketplace", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setItem(snap.data() as MarketplaceItem);
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error("Error loading marketplace item:", err);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  if (loading) return <p className="p-6">Loading item...</p>;

  if (!item) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Item Not Found</h1>
        <p className="text-gray-400 mt-2">This listing does not exist.</p>

        <button
          onClick={() => router.push("/marketplace")}
          className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded font-semibold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <button
        onClick={() => router.push("/marketplace")}
        className="text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 max-w-3xl mx-auto space-y-6">
        {/* IMAGE */}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-64 object-cover rounded-lg border border-neutral-700"
          />
        )}

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{item.title}</h1>

        {/* CATEGORY */}
        {item.category && (
          <p className="text-sm text-gray-400">Category: {item.category}</p>
        )}

        {/* DESCRIPTION */}
        <p className="text-gray-300 whitespace-pre-line">{item.description}</p>

        {/* PRICE */}
        {item.price !== undefined && (
          <p className="text-yellow-400 font-bold text-xl">
            Price: ${item.price}
          </p>
        )}

        {/* CONTACT / BUY BUTTON */}
        <button
          onClick={() => alert("Contact seller feature coming soon!")}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold"
        >
          Contact Seller
        </button>
      </div>
    </div>
  );
}
