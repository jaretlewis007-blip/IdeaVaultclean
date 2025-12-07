// app/creatorhub/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export default function CreatorHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const loadCreator = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCreatorName(snap.data().name || "");
        }
      } catch (err) {
        console.error("Error loading creator profile:", err);
      }
    };

    loadCreator();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Creator Hub</h1>
      <p className="text-gray-300">Welcome, {creatorName || "Creator"}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Upload New Idea */}
        <div
          onClick={() => router.push("/ideas/upload")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Upload New Idea</h2>
          <p className="text-gray-400 mt-1">
            Share a new project securely inside IdeaVault.
          </p>
        </div>

        {/* My Ideas */}
        <div
          onClick={() => router.push("/ideas")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Ideas</h2>
          <p className="text-gray-400 mt-1">
            View and manage your submitted ideas.
          </p>
        </div>

        {/* NDA Generator */}
        <div
          onClick={() => router.push("/nda")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">NDA Generator</h2>
          <p className="text-gray-400 mt-1">
            Create a non-disclosure agreement instantly.
          </p>
        </div>

        {/* Vendor Hub */}
        <div
          onClick={() => router.push("/vendorhub")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Vendor Services</h2>
          <p className="text-gray-400 mt-1">
            Connect with vendors for logos, designs, apps, and more.
          </p>
        </div>

        {/* Lawyer Hub */}
        <div
          onClick={() => router.push("/lawyerhub")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Legal Help</h2>
          <p className="text-gray-400 mt-1">
            Get help reviewing ideas, NDAs, and contracts.
          </p>
        </div>

        {/* Wallet */}
        <div
          onClick={() => router.push("/wallet")}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">Wallet</h2>
          <p className="text-gray-400 mt-1">
            Track your earnings and payments.
          </p>
        </div>

        {/* Profile */}
        <div
          onClick={() => router.push(`/profile/${user.uid}`)}
          className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
        >
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="text-gray-400 mt-1">
            View or edit your personal creator profile.
          </p>
        </div>

      </div>
    </div>
  );
}
