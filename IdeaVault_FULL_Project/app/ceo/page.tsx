"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// ---------- TYPES ----------
interface Post {
  id: string;
  type?: string;
  [key: string]: any;
}

interface NDA {
  id: string;
  [key: string]: any;
}

export default function CEOHubPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [investorOffers, setInvestorOffers] = useState<Post[]>([]);
  const [vendorPosts, setVendorPosts] = useState<Post[]>([]);
  const [creatorPosts, setCreatorPosts] = useState<Post[]>([]);
  const [lawyerPosts, setLawyerPosts] = useState<Post[]>([]);
  const [ndas, setNdas] = useState<NDA[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------- LOAD POSTS ----------
  useEffect(() => {
    const loadAll = async () => {
      try {
        // Retrieve posts
        const postsSnap = await getDocs(collection(db, "posts"));
        const posts: Post[] = postsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setAllPosts(posts);

        // Filter based on type — SAFE with optional chaining
        setInvestorOffers(posts.filter((p) => p.type === "investor"));
        setVendorPosts(posts.filter((p) => p.type === "vendor"));
        setCreatorPosts(posts.filter((p) => p.type === "creator"));
        setLawyerPosts(posts.filter((p) => p.type === "lawyer"));

        // Retrieve NDAs
        const ndSnap = await getDocs(collection(db, "nda"));
        const ndaList: NDA[] = ndSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setNdas(ndaList);
      } catch (err) {
        console.error("CEOHub loading error:", err);
      }

      setLoading(false);
    };

    loadAll();
  }, []);

  if (loading) return <div className="p-6">Loading CEO Hub...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-4">CEO Hub</h1>

      {/* TOTAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold">Total Posts</h2>
          <p className="text-2xl">{allPosts.length}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold">Investor Offers</h2>
          <p className="text-2xl">{investorOffers.length}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold">Vendor Posts</h2>
          <p className="text-2xl">{vendorPosts.length}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold">NDAs Generated</h2>
          <p className="text-2xl">{ndas.length}</p>
        </div>
      </div>

      {/* INVESTOR OFFERS */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Investor Offers</h2>
        {investorOffers.length === 0 && (
          <p className="text-gray-500">No investor offers yet.</p>
        )}
        <ul className="space-y-2">
          {investorOffers.map((p) => (
            <li key={p.id} className="p-4 bg-gray-200 rounded-lg">
              <p><strong>{p.title}</strong></p>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* VENDOR POSTS */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Vendor Posts</h2>
        {vendorPosts.length === 0 && (
          <p className="text-gray-500">No vendor posts yet.</p>
        )}
        <ul className="space-y-2">
          {vendorPosts.map((p) => (
            <li key={p.id} className="p-4 bg-gray-200 rounded-lg">
              <p><strong>{p.title}</strong></p>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CREATOR POSTS */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Creator Posts</h2>
        {creatorPosts.length === 0 && (
          <p className="text-gray-500">No creator posts yet.</p>
        )}
        <ul className="space-y-2">
          {creatorPosts.map((p) => (
            <li key={p.id} className="p-4 bg-gray-200 rounded-lg">
              <p><strong>{p.title}</strong></p>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* LAWYER POSTS */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Lawyer Posts</h2>
        {lawyerPosts.length === 0 && (
          <p className="text-gray-500">No lawyer posts yet.</p>
        )}
        <ul className="space-y-2">
          {lawyerPosts.map((p) => (
            <li key={p.id} className="p-4 bg-gray-200 rounded-lg">
              <p><strong>{p.title}</strong></p>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* NDA LIST */}
      <section>
        <h2 className="text-2xl font-bold mb-2">NDA Documents</h2>
        {ndas.length === 0 && (
          <p className="text-gray-500">No NDAs generated yet.</p>
        )}
        <ul className="space-y-2">
          {ndas.map((n) => (
            <li key={n.id} className="p-4 bg-gray-200 rounded-lg">
              <p><strong>NDA ID:</strong> {n.id}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
