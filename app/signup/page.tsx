"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", user.user.uid), {
      email,
      role: "creator",
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 text-gold">Create Account</h1>

      <input
        className="w-full p-3 bg-white/10 rounded mb-4"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-3 bg-white/10 rounded mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={signup}
        className="w-full p-3 bg-gold text-black rounded font-bold"
      >
        Sign Up
      </button>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-gold underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
