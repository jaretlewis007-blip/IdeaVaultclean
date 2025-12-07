// app/wallet/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  createdAt?: any;
}

export default function WalletPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWallet = async () => {
      if (!user) return;

      try {
        // get all transactions for user
        const txRef = collection(db, "transactions");
        const q = query(txRef, where("uid", "==", user.uid));

        const snap = await getDocs(q);

        let total = 0;
        const txs: Transaction[] = [];

        snap.forEach((doc) => {
          const data = doc.data() as Transaction;

          // Calculate basic wallet balance
          if (data.type === "credit") total += data.amount;
          if (data.type === "debit") total -= data.amount;

          txs.push({ id: doc.id, ...data });
        });

        setBalance(total);
        setTransactions(txs);
      } catch (err) {
        console.error("Error loading wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, [user]);

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (loading) {
    return <p className="p-6">Loading wallet...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
        <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
        <p className="text-4xl font-bold text-green-400">${balance}</p>
      </div>

      {/* Transactions */}
      <div className="bg-neutral-900 p-5 rounded-lg border border-neutral-700">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions found.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg bg-neutral-800 border border-neutral-700 flex justify-between"
              >
                <div>
                  <p className="font-semibold capitalize">{t.type}</p>
                  <p className="text-gray-400 text-sm">
                    {t.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
                  </p>
                </div>

                <p
                  className={
                    t.type === "credit"
                      ? "text-green-400 font-bold"
                      : "text-red-400 font-bold"
                  }
                >
                  {t.type === "credit" ? "+" : "-"}${t.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/ideas")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
        >
          Earn Money
        </button>

        <button
          onClick={() => router.push("/profile/edit")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          Update Payment Info
        </button>
      </div>
    </div>
  );
}
