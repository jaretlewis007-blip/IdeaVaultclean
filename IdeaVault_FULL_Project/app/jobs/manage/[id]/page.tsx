"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function ManageJobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
    };

    loadJob();
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Job</h1>

      <div className="p-4 bg-white/10 rounded">
        <p className="font-bold">{job.title}</p>
        <p>{job.description}</p>
        <p className="text-sm mt-2 text-gray-400">ID: {job.id}</p>
      </div>
    </div>
  );
}



