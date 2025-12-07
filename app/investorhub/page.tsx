// app/investorhub/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function InvestorHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [investorName, setInvestorName] = useState("");

  useEffect(() => {
    const loadInvestor = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setInvestorName(snap.data().name || "");
        }
      } catch (err) {
        console.error("Error loading investor profile:", err);
      }
    };

    loadInvestor();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Investor Hub</h1>
      <p className="text-gray-300">Welcome, {investorName || "Investor"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Browse Ideas */}
        <div
          onClick={() => router.push("/ideas")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Browse Ideas</h2>
          <p className="text-gray-400 mt-1">
            Discover new business ideas and find great investment opportunities.
          </p>
        </div>

        {/* Investment Offers */}
        <div
          onClick={() => router.push("/investorhub/offers")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Offers</h2>
          <p className="text-gray-400 mt-1">
            View and manage investment offers you’ve made to creators.
          </p>
        </div>

        {/* Start New Offer */}
        <div
          onClick={() => router.push("/investorhub/make-offer")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Make New Offer</h2>
          <p className="text-gray-400 mt-1">
            Send funding offers to creators and negotiate deals.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => router.push("/wallet")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Wallet</h2>
          <p className="text-gray-400 mt-1">
            Track funds, deposits, withdrawals, and investments.
          </p>
        </div>

        {/* Saved Ideas */}
        <div
          onClick={() => router.push("/investorhub/saved")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Saved Ideas</h2>
          <p className="text-gray-400 mt-1">
            Keep an eye on ideas you’re interested in funding later.
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => router.push(`/profile/${user.uid}`)}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="text-gray-400 mt-1">
            Edit your investor details and interests.
          </p>
        </div>

      </div>
    </div>
  );
}
