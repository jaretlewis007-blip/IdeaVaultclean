"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function FindJobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      const snap = await getDocs(collection(db, "jobs"));
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadJobs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Find Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-400">No jobs available.</p>
      )}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 bg-white/10 rounded">
            <h2 className="text-xl font-bold">{job.title}</h2>
            <p className="text-sm mt-2">{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
