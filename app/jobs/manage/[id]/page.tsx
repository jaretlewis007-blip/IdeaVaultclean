// app/jobs/manage/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  salary?: string;
  createdAt?: any;
}

export default function ManageJobPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;

      try {
        const ref = doc(db, "jobs", id as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setJob({
            id: snap.id,
            ...snap.data(),
          } as Job);
        }
      } catch (err) {
        console.error("Error loading job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading job...</p>;
  }

  if (!job) {
    return <p className="p-6">Job not found.</p>;
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{job.title}</h1>

      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 space-y-3">
        <p className="text-gray-300">
          <span className="font-bold">Company:</span> {job.company}
        </p>

        <p className="text-gray-300 whitespace-pre-line">
          <span className="font-bold">Description:</span> {job.description}
        </p>

        {job.salary && (
          <p className="text-gray-300">
            <span className="font-bold">Salary:</span> {job.salary}
          </p>
        )}

        {job.createdAt && (
          <p className="text-gray-500 text-sm">
            Posted: {job.createdAt.toDate?.().toLocaleString?.()}
          </p>
        )}
      </div>
    </div>
  );
}
