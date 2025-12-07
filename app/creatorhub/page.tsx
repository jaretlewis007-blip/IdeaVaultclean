// app/creatorhub/page.tsx
"use client";

import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function CreatorHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserName(snap.data().name || "");
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };

    loadProfile();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Creator Hub</h1>

      <p className="text-gray-300">Welcome back, {userName || "Creator"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Idea */}
        <div
          onClick={() => router.push("/ideas/create")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">Upload New Idea</h2>
          <p className="text-gray-400">
            Securely upload your new idea and store it with NDA protection.
          </p>
        </div>

        {/* View My Ideas */}
        <div
          onClick={() => router.push("/ideas")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">My Ideas</h2>
          <p className="text-gray-400">
            View, edit, and manage all your uploaded ideas.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => router.push("/wallet")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">Wallet</h2>
          <p className="text-gray-400">
            Check your balance, earnings, and transactions.
          </p>
        </div>

        {/* NDA Tool */}
        <div
          onClick={() => router.push("/nda")}
          className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-700 transition"
        >
          <h2 className="text-xl font-bold mb-2">NDA Generator</h2>
          <p className="text-gray-400">
            Instantly generate NDAs for business collaborations.
          </p>
        </div>
      </div>
    </div>
  );
}
