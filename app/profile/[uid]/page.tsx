"use client";

export default function UserProfile({ params }) {
  const { uid } = params;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

      <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
        <p className="text-gray-300">
          <span className="text-yellow-400 font-bold">User ID:</span> {uid}
        </p>

        <p className="mt-3 text-gray-400">
          This page will display all profile information for the user.
        </p>
      </div>
    </div>
  );
}
