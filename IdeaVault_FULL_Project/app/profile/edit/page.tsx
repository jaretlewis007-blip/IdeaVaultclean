"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setForm({
            name: snap.data().name || "",
            email: snap.data().email || "",
            role: snap.data().role || ""
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }

      setLoading(false);
    };

    loadUser();
  }, [user]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        name: form.name,
        role: form.role
      });
      
      router.push(`/profile/${user.uid}`);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <div className="space-y-4 bg-gray-100 p-4 rounded-lg">

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full p-2 border rounded"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email (read-only)</label>
          <input
            className="w-full p-2 border rounded bg-gray-200"
            value={form.email}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <input
            className="w-full p-2 border rounded"
            name="role"
            value={form.role}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}
