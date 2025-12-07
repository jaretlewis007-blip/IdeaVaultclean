"use client";

import { useState } from "react";
import { db, auth } from "../../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function NDAPage() {
  const [recipient, setRecipient] = useState("");
  const [idea, setIdea] = useState("");

  const createNDA = async () => {
    await addDoc(collection(db, "ndas"), {
      userId: auth.currentUser?.uid || null,
      recipient,
      idea,
      signedAt: serverTimestamp()
    });
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Generate NDA</h1>

      <input
        className="w-full p-3 bg-white/10 rounded mb-3"
        placeholder="Recipient Name"
        onChange={(e) => setRecipient(e.target.value)}
      />

      <textarea
        className="w-full p-3 bg-white/10 rounded mb-3"
        placeholder="Describe your idea..."
        onChange={(e) => setIdea(e.target.value)}
      />

      <button
        onClick={createNDA}
        className="w-full p-3 bg-gold text-black rounded font-bold"
      >
        Create NDA
      </button>
    </div>
  );
}

