// app/jobs/find/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface JobRecord {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt?: any;
  creator: string;
}

export default function JobFindPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const ref = collection(db, "jobs");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as JobRecord),
        }));

        setJobs(list);
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading jobs...</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Find Jobs</h1>
      <p className="text-gray-400">
        Browse available vendor jobs posted by creators.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <p className="text-gray-400">No jobs available right now.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/jobs/manage/${job.id}`)}
              className="bg-neutral-900 border border-neutral-700 p-5 rounded-lg cursor-pointer hover:bg-neutral-800 transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>

              <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                {job.description}
              </p>

              <p className="text-yellow-400 mt-3 font-semibold">
                ${job.price}
              </p>

              <p className="text-gray-500 text-xs mt-2">
                Posted: {job.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/vendorhub")}
        className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded hover:bg-neutral-700"
      >
        Back to Vendor Hub
      </button>
    </div>
  );
}
