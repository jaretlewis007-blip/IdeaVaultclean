"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex flex-col space-y-3 text-white">
      <Link href="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
      <Link href="/creatorhub" className="hover:text-yellow-400">Creator Hub</Link>
      <Link href="/vendorhub" className="hover:text-yellow-400">Vendor Hub</Link>
      <Link href="/marketplace" className="hover:text-yellow-400">Marketplace</Link>
      <Link href="/investorhub" className="hover:text-yellow-400">Investor Hub</Link>
      <Link href="/lawyerhub" className="hover:text-yellow-400">Lawyer Hub</Link>
      <Link href="/nda" className="hover:text-yellow-400">NDA Generator</Link>
      <Link href="/wallet" className="hover:text-yellow-400">Wallet</Link>
      <Link href="/notifications" className="hover:text-yellow-400">Notifications</Link>
      <Link href="/profile" className="hover:text-yellow-400">Profile</Link>
    </div>
  );
}
