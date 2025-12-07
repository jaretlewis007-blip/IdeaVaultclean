// app/lawyerhub/page.tsx
"use client";

import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function LawyerHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [lawyerName, setLawyerName] = useState<string>("");

  useEffect(() => {
    const loadLawyer = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setLawyerName(snap.data().name || "");
        }
      } catch (err) {
        console.error("Error loading lawyer profile:", err);
      }
    };

    loadLawyer();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Lawyer Hub</h1>
      <p className="text-gray-300">Welcome, {lawyerName || "Lawyer"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NDA Reviews */}
        <div
          onClick={() => router.push("/lawyerhub/nda-requests")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">NDA Review Requests</h2>
          <p className="text-gray-400">
            Review NDAs submitted by creators and business owners.
          </p>
        </div>

        {/* Legal Consults */}
        <div
          onClick={() => router.push("/lawyerhub/consults")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">Legal Consults</h2>
          <p className="text-gray-400">
            Manage user requests for legal advice and services.
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => router.push(`/profile/${user.uid}`)}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <p className="text-gray-400">
            View or update your professional legal information.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => router.push("/wallet")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">Wallet</h2>
          <p className="text-gray-400">
            Track client payments and legal service revenue.
          </p>
        </div>
      </div>
    </div>
  );
}
