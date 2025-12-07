// app/nda/page.tsx
"use client";

import { useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NDAGeneratorPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [ideaName, setIdeaName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  if (!user) {
    router.push("/signin");
    return null;
  }

  const generateNDA = async () => {
    if (!recipientName.trim() || !recipientEmail.trim() || !ideaName.trim()) {
      return;
    }

    setGenerating(true);

    // Simple NDA template
    const ndaText = `
NON-DISCLOSURE AGREEMENT (NDA)

This Agreement is made between:

Creator: ${user.email}
Recipient: ${recipientName} (${recipientEmail})

Regarding the confidential idea:
"${ideaName}"

Both parties agree not to disclose, share, or misuse any confidential information related to this idea.

Date: ${new Date().toLocaleDateString()}
    `.trim();

    setGeneratedText(ndaText);

    try {
      // Log NDA event (optional)
      const ref = collection(db, "nda_logs");
      await addDoc(ref, {
        creator: user.uid,
        recipientName,
        recipientEmail,
        ideaName,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error saving NDA log:", err);
    }

    setGenerating(false);
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">NDA Generator</h1>
      <p className="text-gray-400">
        Create a fast non-disclosure agreement for protecting your idea.
      </p>

      {/* Form */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-5">
        {/* Recipient Name */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Recipient Name</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            placeholder="John Doe"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>

        {/* Recipient Email */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Recipient Email</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>

        {/* Idea Name */}
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Idea Name</label>
          <input
            className="bg-neutral-800 border border-neutral-700 p-2 rounded text-white"
            placeholder="AI Business Planner"
            value={ideaName}
            onChange={(e) => setIdeaName(e.target.value)}
          />
        </div>

        <button
          onClick={generateNDA}
          disabled={generating}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate NDA"}
        </button>
      </div>

      {/* Generated NDA */}
      {generatedText && (
        <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 whitespace-pre-line">
          <h2 className="text-xl font-bold mb-3">Generated NDA</h2>
          <p className="text-gray-300">{generatedText}</p>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
