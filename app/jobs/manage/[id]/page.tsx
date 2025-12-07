// app/jobs/manage/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase/config";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

interface JobRecord {
  title: string;
  description: string;
  price: number;
  creator: string;
  vendor?: string;
  createdAt?: any;
}

export default function ManageJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = auth.currentUser;

  const [job, setJob] = useState<JobRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const ref = doc(db, "jobs", params.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setJob(snap.data() as JobRecord);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Error loading job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [params.id]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading job...</p>;
  }

  if (!job) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <button
          onClick={() => router.push("/jobs/find")}
          className="mt-4 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const acceptJob = async () => {
    if (!user) return;

    setAccepting(true);

    try {
      const ref = doc(db, "jobs", params.id);

      await updateDoc(ref, {
        vendor: user.uid,
        acceptedAt: serverTimestamp(),
      });

      router.push("/jobs/find");
    } catch (err) {
      console.error("Error accepting job:", err);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <h1 className="text-3xl font-bold">{job.title}</h1>

      <p className="text-gray-400 text-sm">
        Posted: {job.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
      </p>

      {/* Description */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-300 leading-7 whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Price */}
      <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
        <h2 className="text-lg font-semibold text-yellow-400">
          Price: ${job.price}
        </h2>
      </div>

      {/* If job already assigned */}
      {job.vendor ? (
        <div className="p-4 bg-green-600 text-black font-semibold rounded-lg">
          This job has already been accepted.
        </div>
      ) : (
        <button
          onClick={acceptJob}
          disabled={accepting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded disabled:opacity-50"
        >
          {accepting ? "Accepting..." : "Accept Job"}
        </button>
      )}

      {/* Back Button */}
      <button
        onClick={() => router.push("/jobs/find")}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Back to Jobs
      </button>
    </div>
  );
}
