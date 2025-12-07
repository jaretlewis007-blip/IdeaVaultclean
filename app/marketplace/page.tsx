"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketplace = async () => {
      try {
        const ref = collection(db, "marketplace");
        const snap = await getDocs(ref);

        const results = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<MarketplaceItem, "id">),
        }));

        setItems(results);
      } catch (error) {
        console.error("Marketplace load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplace();
  }, []);

  if (loading) return <p className="p-6">Loading marketplace...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <p className="text-gray-400">
        Browse services, products, and business opportunities.
      </p>

      {/* Grid of marketplace items */}
      {items.length === 0 ? (
        <p className="text-gray-500">No marketplace items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 p-4 rounded-lg border border-neutral-700 hover:border-yellow-500 transition"
            >
              {/* Image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              {/* Title */}
              <h2 classname="text-xl font-semibold">{item.title}</h2>

              {/* Category */}
              {item.category && (
                <p className="text-sm text-gray-400 mt-1">
                  Category: {item.category}
                </p>
              )}

              {/* Description */}
              <p className="text-gray-300 mt-2 line-clamp-3">
                {item.description}
              </p>

              {/* Price */}
              {item.price !== undefined && (
                <p className="text-yellow-400 font-bold mt-3">
                  ${item.price}
                </p>
              )}

              {/* View button */}
              <Link
                href={`/marketplace/${item.id}`}
                className="block mt-4 bg-yellow-500 hover:bg-yellow-600 text-black text-center py-2 rounded font-semibold"
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
