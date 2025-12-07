"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

interface UserData {
  id: string;
  uid?: string;      // <-- FIX: Make uid optional so TypeScript allows it
  role?: string;
  [key: string]: any;
}

export default function CEOHubPage() {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [isCEO, setIsCEO] = useState(false);

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [investorOffers, setInvestorOffers] = useState<any[]>([]);
  const [vendorPosts, setVendorPosts] = useState<any[]>([]);
  const [creatorPosts, setCreatorPosts] = useState<any[]>([]);
  const [lawyerPosts, setLawyerPosts] = useState<any[]>([]);
  const [ndas, setNdas] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // ====================
        // LOAD USERS
        // ====================
        const snap = await getDocs(collection(db, "users"));
        const users: UserData[] = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Find the current user safely
        const current = users.find((u) => u.uid === user.uid);

        if (!current || current.role !== "ceo") {
          setIsCEO(false);
          setLoading(false);
          return;
        }

        setIsCEO(true);

        // ====================
        // LOAD POSTS
        // ====================
        const postsSnap = await getDocs(collection(db, "posts"));
        const posts = postsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setAllPosts(posts);
        setInvestorOffers(posts.filter((p) => p.type === "investor"));
        setVendorPosts(posts.filter((p) => p.type === "vendor"));
        setCreatorPosts(posts.filter((p) => p.type === "creator"));
        setLawyerPosts(posts.filter((p) => p.type === "lawyer"));

        // ====================
        // LOAD NDAs
        // ====================
        const ndaSnap = await getDocs(collection(db, "nda"));
        const ndaList = ndaSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setNdas(ndaList);

      } catch (err) {
        console.error("CEOHub Error:", err);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!isCEO)
    return <div className="p-6 text-red-600 text-xl font-bold">Access Denied — CEO Only.</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold">CEO Hub</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatBox title="Total Posts" value={allPosts.length} />
        <StatBox title="Investor Offers" value={investorOffers.length} />
        <StatBox title="Vendor Posts" value={vendorPosts.length} />
        <StatBox title="NDAs Generated" value={ndas.length} />
      </div>

      <Section title="Investor Offers" items={investorOffers} />
      <Section title="Vendor Posts" items={vendorPosts} />
      <Section title="Creator Posts" items={creatorPosts} />
      <Section title="Lawyer Posts" items={lawyerPosts} />
      <Section title="NDA Documents" items={ndas} idOnly />
    </div>
  );
}

// ==========================
// COMPONENTS
// ==========================

function StatBox({ title, value }: any) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="font-bold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  );
}

function Section({ title, items, idOnly = false }: any) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item: any) => (
            <li key={item.id} className="p-4 bg-gray-200 rounded-lg">
              {idOnly ? (
                <p><strong>ID:</strong> {item.id}</p>
              ) : (
                <>
                  <p><strong>{item.title}</strong></p>
                  <p>{item.description}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
