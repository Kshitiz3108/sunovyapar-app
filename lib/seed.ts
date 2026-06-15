// NOTE: Catalogue and Stock don't yet have DB tables.
// These arrays are clearly-marked seed data, shaped so they can later
// come from `catalogue` and `stock` tables in Supabase without changing UI.

export type CatalogueItem = {
  id: string;
  name: string;
  spoken: string;
  variant?: string;
  rate?: string;
  volatile?: boolean;
};

export const CATALOGUE: CatalogueItem[] = [
  {
    id: "parle-g",
    name: "Parle-G",
    spoken: "Parle Jee",
    variant: "Rs.10 pack",
    rate: "₹912 / carton",
  },
  {
    id: "maggi-noodles",
    name: "Maggi 2-Minute Noodles",
    spoken: "Maggi Noodles",
    variant: "70g",
    rate: "₹1,056 / carton",
  },
  {
    id: "50-50",
    name: "50-50",
    spoken: "Fifty Fifty",
    variant: "Rs.10 pack",
    rate: "₹456 / carton",
  },
  {
    id: "surf-excel",
    name: "Surf Excel",
    spoken: "Surf Excel",
    variant: "1 kg",
    rate: "₹1,440 / carton",
  },
  {
    id: "aashirvaad-atta",
    name: "Aashirvaad Atta",
    spoken: "Ashirvaad Aata",
    variant: "10 kg",
    rate: "₹485 / pc",
  },
  {
    id: "refined-oil",
    name: "Refined Oil",
    spoken: "Refined Oil",
    variant: "15 ltr tin",
    volatile: true,
  },
];

export type StockState = "in_stock" | "low" | "out";
export type StockItem = {
  id: string;
  name: string;
  state: StockState;
  qty: string;
};

export const STOCK: StockItem[] = [
  { id: "parle-g", name: "Parle-G", state: "in_stock", qty: "82 cartons" },
  { id: "maggi-noodles", name: "Maggi Noodles", state: "low", qty: "9 cartons" },
  { id: "50-50", name: "50-50", state: "in_stock", qty: "46 cartons" },
  { id: "surf-excel", name: "Surf Excel 1kg", state: "low", qty: "5 cartons" },
  { id: "aashirvaad-atta", name: "Aashirvaad Atta 10kg", state: "out", qty: "0" },
  { id: "refined-oil", name: "Refined Oil 15L", state: "in_stock", qty: "31 tin" },
];

export const AGENT_CONFIG = {
  name: "Ishita",
  number: "+91 80 4718 2233",
  whatsappAlerts: "ON",
  catalogue: "FMCG · 6 SKUs",
  hours: "24 ghante",
};
