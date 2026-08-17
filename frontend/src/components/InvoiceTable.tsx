import type { Invoice } from "../types";

interface Props {
  invoices: Invoice[];
}

const statusBadge: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
};

const riskBadge: Record<string, string> = {
  NONE: "bg-gray-100 text-gray-500",
  LOW: "bg-blue-100 text-blue-600",
  MEDIUM: "bg-orange-100 text-orange-600",
  HIGH: "bg-red-100 text-red-700",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const InvoiceTable = ({ invoices }: Props) => {
  if (invoices.length === 0)
    return (
      <p className="text-center text-gray-400 py-16">No invoices found.</p>
    );

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm">
      <table className="w-full text-sm bg-white">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
          <tr>
            {[
              "Invoice",
              "Client",
              "Amount",
              "Outstanding",
              "Status",
              "Ledger",
              "Risk",
              "Due Date",
              "Days Overdue",
            ].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoices.map((inv) => (
            <tr key={inv.invoice_id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-mono text-indigo-600 font-medium">
                {inv.invoice_number}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">{inv.client_name}</p>
                <p className="text-xs text-gray-400">{inv.client_email}</p>
              </td>
              <td className="px-4 py-3 font-medium">{fmt(inv.amount)}</td>
              <td className="px-4 py-3 text-gray-600">
                {fmt(inv.outstanding_amount)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[inv.status]}`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs font-medium text-gray-600">
                  {inv.ledger_status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${riskBadge[inv.risk_tier]}`}
                >
                  {inv.risk_tier}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{inv.due_date}</td>
              <td className="px-4 py-3 text-gray-600">
                {inv.days_overdue != null ? (
                  <span className="text-red-600 font-medium">
                    {inv.days_overdue}d
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
