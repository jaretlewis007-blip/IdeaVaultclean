"use client";

import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="w-full p-4 bg-gray-800 border-b border-gray-700 flex justify-between">
      <h2 className="text-yellow-400 font-bold text-xl">Welcome to IdeaVault</h2>

      <button
        onClick={() => {
          signOut(auth);
          router.push("/signin");
        }}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
}
