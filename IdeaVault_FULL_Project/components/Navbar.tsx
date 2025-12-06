"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-2xl font-bold text-yellow-400">IdeaVault</h1>

      <div className="flex items-center space-x-4">
        <Link href="/profile" className="hover:text-yellow-400 text-white">
          Profile
        </Link>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/signin";
          }}
          className="text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
