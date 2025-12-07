// app/jobs/find/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  createdAt?: any;
}

export default function FindJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const ref = collection(db, "jobs");
        const snap = await getDocs(ref);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Job),
        }));

        setJobs(list);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) {
    return <p className="p-6">Loading jobs...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Find Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-400">No jobs available.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/jobs/manage/${job.id}`)}
              className="bg-neutral-800 border border-neutral-700 p-4 rounded cursor-pointer hover:bg-neutral-700 transition"
            >
              <h2 className="text-xl font-bold">{job.title}</h2>
              <p className="text-gray-400">{job.company}</p>
              <p className="text-gray-500 text-sm mt-2">{job.description}</p>

              {job.createdAt && (
                <p className="text-gray-600 text-xs mt-2">
                  Posted: {job.createdAt.toDate?.().toLocaleString?.()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
