"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "./supabase";
import { Lead } from "./types";

export type LeadsState = {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  configured: boolean;
  newLeadId: string | null;
  newLeadToast: { id: string; name: string } | null;
  clearToast: () => void;
};

const PAGE_SIZE = 200;

export function useLeads(): LeadsState {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLeadId, setNewLeadId] = useState<string | null>(null);
  const [newLeadToast, setNewLeadToast] =
    useState<{ id: string; name: string } | null>(null);
  const configured = Boolean(getSupabase());
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data, error } = await sb
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const rows = (data || []) as Lead[];
      rows.forEach((r) => seenIds.current.add(r.id));
      setLeads(rows);
      setLoading(false);
    })();

    const channel = sb
      .channel("public:leads:inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const row = payload.new as Lead;
          if (!row?.id || seenIds.current.has(row.id)) return;
          seenIds.current.add(row.id);
          setLeads((prev) => [row, ...prev]);
          setNewLeadId(row.id);
          const name =
            row.caller_name?.trim() ||
            row.caller_number?.trim() ||
            "Naya caller";
          setNewLeadToast({ id: row.id, name });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      sb.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!newLeadId) return;
    const t = setTimeout(() => setNewLeadId(null), 2200);
    return () => clearTimeout(t);
  }, [newLeadId]);

  useEffect(() => {
    if (!newLeadToast) return;
    const t = setTimeout(() => setNewLeadToast(null), 3800);
    return () => clearTimeout(t);
  }, [newLeadToast]);

  return {
    leads,
    loading,
    error,
    configured,
    newLeadId,
    newLeadToast,
    clearToast: () => setNewLeadToast(null),
  };
}
