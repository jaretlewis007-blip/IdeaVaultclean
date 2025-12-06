"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function WalletPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", auth.currentUser?.uid)
      );

      const snap = await getDocs(q);
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Wallet</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-400 mt-3">No transactions yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white/10 p-4 rounded">
              <p className="font-bold">${t.amount}</p>
              <p className="text-sm text-gray-400">{t.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
