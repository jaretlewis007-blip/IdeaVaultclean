"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in failed:", error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center text-white">
      <h1 className="text-3xl mb-4 font-bold">Sign In</h1>

      <form onSubmit={handleSignIn} className="flex flex-col space-y-3 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-800 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-yellow-500 py-2 rounded font-bold hover:bg-yellow-600"
        >
          Sign In
        </button>
      </form>

      <p className="mt-3 text-gray-300">
        Don’t have an account?{" "}
        <a href="/signup" className="text-yellow-400 underline">Sign up</a>
      </p>
    </div>
  );
}
