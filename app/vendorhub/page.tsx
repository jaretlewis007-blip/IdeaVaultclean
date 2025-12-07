// app/vendorhub/page.tsx
"use client";

import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function VendorHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [vendorName, setVendorName] = useState<string>("");

  useEffect(() => {
    const loadVendor = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setVendorName(snap.data().name || "");
        }
      } catch (err) {
        console.error("Error loading vendor profile:", err);
      }
    };

    loadVendor();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Vendor Hub</h1>
      <p className="text-gray-300">Welcome, {vendorName || "Vendor"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* View Creator Requests */}
        <div
          onClick={() => router.push("/vendorhub/requests")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">View Requests</h2>
          <p className="text-gray-400">
            Browse services requested by creators and business owners.
          </p>
        </div>

        {/* Manage Quotes */}
        <div
          onClick={() => router.push("/vendorhub/quotes")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">Manage Quotes</h2>
          <p className="text-gray-400">
            Create and manage quotes for potential customers.
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => router.push(`/profile/${user.uid}`)}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <p className="text-gray-400">
            View or edit your vendor information.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => router.push("/wallet")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">Wallet</h2>
          <p className="text-gray-400">
            Track payments, purchases, and transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
