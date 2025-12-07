// app/ceohub/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface UserRecord {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: any;
}

export default function CEOHubPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      if (!user) return;

      try {
        const ref = collection(db, "users");
        const snap = await getDocs(ref);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as UserRecord),
        }));

        setUsers(list);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading CEO dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">CEO Hub</h1>
      <p className="text-gray-300">Admin dashboard for IdeaVault.</p>

      {/* Users Table */}
      <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700 overflow-x-auto">
        <table className="w-full text-left text-gray-300 text-sm">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-800">
                <td className="p-2">{u.name || "N/A"}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role || "user"}</td>
                <td className="p-2">
                  {u.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/ideas")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
        >
          View All Ideas
        </button>

        <button
          onClick={() => router.push("/wallet")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          Financial Overview
        </button>
      </div>
    </div>
  );
}
