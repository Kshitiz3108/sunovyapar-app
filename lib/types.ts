export type LeadStatus = "serious" | "pending" | "not_serious";

export type Lead = {
  id: string;
  created_at: string;
  caller_name: string | null;
  caller_number: string | null;
  order_summary: string | null;
  products: string | Record<string, unknown> | unknown[] | null;
  location: string | null;
  amount: string | null;
  status: LeadStatus | null;
  call_duration: number | null;
  transcript: string | null;
  recording_url: string | null;
  agent_id: string | null;
};
