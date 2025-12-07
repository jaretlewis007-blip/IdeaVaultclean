// app/project/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface ProjectRecord {
  title: string;
  description: string;
  imageUrl?: string;
  budget?: number;
  status?: string;
  ownerId?: string;
  createdAt?: any;
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProject(snap.data() as ProjectRecord);
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) return <p className="p-6">Loading project...</p>;

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="text-gray-400">This project doesn't exist or was removed.</p>

        <button
          onClick={() => router.push("/project")}
          className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded font-semibold"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/project")}
        className="text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 space-y-6">
        {/* IMAGE */}
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-64 object-cover rounded border border-neutral-700"
          />
        )}

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{project.title}</h1>

        {/* STATUS */}
        {project.status && (
          <p className="text-sm text-yellow-400 font-semibold">
            Status: {project.status}
          </p>
        )}

        {/* BUDGET */}
        {project.budget && (
          <p className="text-lg font-bold text-yellow-400">
            Budget: ${project.budget}
          </p>
        )}

        {/* DESCRIPTION */}
        <p className="text-gray-300 whitespace-pre-line">{project.description}</p>

        {/* CREATED AT */}
        {project.createdAt && (
          <p className="text-gray-500 text-sm">
            Posted: {project.createdAt?.toDate?.().toLocaleDateString?.() ?? ""}
          </p>
        )}

        {/* OWNER PROFILE */}
        {project.ownerId && (
          <button
            onClick={() => router.push(`/profile/${project.ownerId}`)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 py-2 rounded font-semibold text-black"
          >
            View Creator Profile
          </button>
        )}

        {/* MESSAGE BUTTON */}
        <button
          onClick={() => alert("Messaging system coming soon")}
          className="w-full bg-neutral-800 border border-neutral-600 hover:bg-neutral-700 py-2 rounded font-semibold"
        >
          Message Creator
        </button>
      </div>
    </div>
  );
}
