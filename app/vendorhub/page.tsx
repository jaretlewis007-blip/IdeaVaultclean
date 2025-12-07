// app/vendorhub/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function VendorHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [vendorName, setVendorName] = useState("");

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
        console.error("Vendor profile load error:", err);
      }
    };

    loadVendor();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Vendor Hub</h1>
      <p className="text-gray-300">Welcome, {vendorName || "Vendor"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* View Vendor Jobs */}
        <div
          onClick={() => router.push("/jobs/find")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Available Jobs</h2>
          <p className="text-gray-400 mt-1">
            Find business owners needing design work, app building, or services.
          </p>
        </div>

        {/* Manage Assigned Jobs */}
        <div
          onClick={() => router.push("/jobs/manage")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Jobs</h2>
          <p className="text-gray-400 mt-1">
            View and manage work you've been hired to complete.
          </p>
        </div>

        {/* Upload Work */}
        <div
          onClick={() => router.push("/vendorhub/upload-work")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Upload Completed Work</h2>
          <p className="text-gray-400 mt-1">
            Deliver finished logos, designs, apps, or documents to clients.
          </p>
        </div>

        {/* Manage Portfolio */}
        <div
          onClick={() => router.push("/vendorhub/portfolio")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Portfolio</h2>
          <p className="text-gray-400 mt-1">
            Show off your past work to attract more clients.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => router.push("/wallet")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Wallet</h2>
          <p className="text-gray-400 mt-1">
            Track payments earned from client jobs.
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => router.push(`/profile/${user.uid}`)}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="text-gray-400 mt-1">
            Update your vendor skills, pricing, and bio.
          </p>
        </div>

      </div>
    </div>
  );
}
