"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { createClient } from "@/utils/supabase/client";

export default function CertificatesPage() {
  const supabase = createClient();

  const [profile, setProfile] =
    useState<any>(null);

  const printRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }

    loadProfile();
  }, []);

  const handlePrint =
    useReactToPrint({
      contentRef: printRef,
    });

  return (
    <div className="min-h-screen bg-[#f5f1e8] p-10">
      <div className="mb-8 flex justify-end">
        <button
          onClick={handlePrint}
          className="btn-gold"
        >
          Print Certificate
        </button>
      </div>

      <div
        ref={printRef}
        className="mx-auto max-w-6xl border-[14px] border-[#c9a84c] bg-white p-16"
      >
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#c9a84c]">
            Awakening Ecclesia Global
          </p>

          <h1 className="mt-6 font-edc-serif text-6xl font-semibold text-[#0b1f3a]">
            Certificate of Completion
          </h1>

          <p className="mt-8 text-xl leading-9 text-[#1c2b3a]/75">
            This certifies that
          </p>

          <h2 className="mt-8 font-edc-serif text-6xl font-semibold text-[#c9a84c]">
            {profile?.full_name}
          </h2>

          <p className="mx-auto mt-10 max-w-4xl text-xl leading-10 text-[#1c2b3a]/75">
            has successfully completed the
            prescribed theological and
            spiritual formation program of
            Ecclesia Discipleship &
            Commissioning and has been found
            faithful in learning, formation,
            discipline, and Christian witness.
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            <div>
              <div className="h-px bg-[#0b1f3a]" />

              <p className="mt-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/55">
                Registrar
              </p>
            </div>

            <div>
              <div className="h-px bg-[#0b1f3a]" />

              <p className="mt-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/55">
                Academic Director
              </p>
            </div>

            <div>
              <div className="h-px bg-[#0b1f3a]" />

              <p className="mt-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/55">
                Date
              </p>

              <p className="mt-2 font-semibold text-[#0b1f3a]">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-[#c9a84c]/20 pt-8">
            <p className="text-sm uppercase tracking-[0.25em] text-[#c9a84c]">
              Ecclesia Discipleship &
              Commissioning
            </p>

            <p className="mt-4 text-[#1c2b3a]/60">
              Apostolic Formation • Biblical
              Theology • Spiritual Discipline
              • Witness Formation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}