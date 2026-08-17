// Mirrors Pydantic models exactly — strict contract between frontend and backend

export type InvoiceStatus = "paid" | "pending" | "overdue";
export type LedgerStatus = "SETTLED" | "OUTSTANDING" | "DELINQUENT" | "UNKNOWN";
export type RiskTier = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export interface Invoice {
  invoice_id: number;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  payment_terms_days: number;
  days_overdue: number | null;
  days_to_pay: number | null;
  is_overdue: boolean;
  is_paid: boolean;
  outstanding_amount: number;
  ledger_status: LedgerStatus;
  risk_tier: RiskTier;
  refreshed_at: string;
}

export interface InvoiceSummary {
  total_invoices: number;
  total_amount: number;
  total_outstanding: number;
  total_paid: number;
  overdue_count: number;
  pending_count: number;
  paid_count: number;
  high_risk_count: number;
}

export interface InvoiceListResponse {
  data: Invoice[];
  summary: InvoiceSummary;
  count: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus | "";
  risk_tier?: RiskTier | "";
  client_name?: string;
}
