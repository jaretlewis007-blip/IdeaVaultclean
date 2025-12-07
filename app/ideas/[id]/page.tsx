"use client";

export default function IdeaDetails({ params }) {
  const { id } = params;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Idea Details</h1>

      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <p className="text-gray-300">
          <span className="text-yellow-400 font-bold">Idea ID:</span> {id}
        </p>

        <p className="mt-3 text-gray-400">
          This page will eventually show full information about the idea,
          including description, files, timestamps, collaborators, and NDA
          protections.
        </p>
      </div>
    </div>
  );
}
