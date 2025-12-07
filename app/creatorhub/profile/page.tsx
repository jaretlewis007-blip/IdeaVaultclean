"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Idea = {
  id: string;
  ndaCount?: number | null;
  nda_count?: number | null;
};

export default function CreatorProfile() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalNDA, setTotalNDA] = useState(0);
  const [totalIdeas, setTotalIdeas] = useState(0);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from<Idea>("ideas")
        .select("id, ndaCount, nda_count");

      if (error) {
        console.error("Error fetching ideas:", error);
      } else if (data) {
        setIdeas(data);
        setTotalIdeas(data.length);

        const ndaTotal = data.reduce(
          (sum, idea) =>
            sum +
            (idea.ndaCount ??
              idea.nda_count ??
              0),
          0
        );

        setTotalNDA(ndaTotal);
      }

      setLoading(false);
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Creator Profile</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold">Total Ideas</h2>
          <p className="text-2xl font-bold">{totalIdeas}</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
