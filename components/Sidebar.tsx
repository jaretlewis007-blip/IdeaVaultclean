"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 p-4 border-r border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">IdeaVault</h1>

      <nav className="space-y-4">
        <Link href="/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
        <Link href="/creatorhub" className="block hover:text-yellow-400">Creator Hub</Link>
        <Link href="/vendorhub" className="block hover:text-yellow-400">Vendor Hub</Link>
        <Link href="/lawyerhub" className="block hover:text-yellow-400">Lawyer Hub</Link>
        <Link href="/ceohub" className="block hover:text-yellow-400">CEO Hub</Link>
        <Link href="/wallet" className="block hover:text-yellow-400">Wallet</Link>
        <Link href="/nda" className="block hover:text-yellow-400">NDA Generator</Link>
        <Link href="/jobs/find" className="block hover:text-yellow-400">Find Jobs</Link>
      </nav>
    </aside>
  );
}
