import { useState, useEffect } from "react";
import type { InvoiceFilters, InvoiceStatus, RiskTier } from "../types";

interface Props {
  filters: InvoiceFilters;
  onChange: (filters: InvoiceFilters) => void;
}

const Filters = ({ filters, onChange }: Props) => {
  const [searchInput, setSearchInput] = useState(filters.client_name ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, client_name: searchInput });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClear = () => {
    setSearchInput("");
    onChange({});
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search client..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
      />

      <select
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value as InvoiceStatus | "" })
        }
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Statuses</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </select>

      <select
        value={filters.risk_tier ?? ""}
        onChange={(e) =>
          onChange({ ...filters, risk_tier: e.target.value as RiskTier | "" })
        }
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Risk Tiers</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <button
        onClick={handleClear}
        className="text-sm text-gray-500 hover:text-indigo-600 underline"
      >
        Clear filters
      </button>
    </div>
  );
};

export default Filters;
