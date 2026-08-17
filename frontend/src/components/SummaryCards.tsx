import type { InvoiceSummary } from "../types";

interface Props {
  summary: InvoiceSummary;
}

const Card = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color}`}>
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const SummaryCards = ({ summary }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <Card
      label="Total Invoices"
      value={summary.total_invoices}
      color="border-indigo-500"
    />
    <Card
      label="Total Amount"
      value={fmt(summary.total_amount)}
      color="border-blue-500"
    />
    <Card
      label="Outstanding"
      value={fmt(summary.total_outstanding)}
      color="border-yellow-500"
    />
    <Card
      label="Collected"
      value={fmt(summary.total_paid)}
      color="border-green-500"
    />
    <Card
      label="Overdue"
      value={summary.overdue_count}
      color="border-red-500"
    />
    <Card
      label="Pending"
      value={summary.pending_count}
      color="border-orange-500"
    />
    <Card label="Paid" value={summary.paid_count} color="border-green-400" />
    <Card
      label="High Risk"
      value={summary.high_risk_count}
      color="border-red-700"
    />
  </div>
);

export default SummaryCards;
