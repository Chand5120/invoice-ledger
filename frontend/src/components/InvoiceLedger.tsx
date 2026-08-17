import { useState } from "react";
import { useInvoices } from "../hooks/useInvoices";
import type { InvoiceFilters } from "../types";
import SummaryCards from "./SummaryCards";
import Filters from "./Filters";
import InvoiceTable from "./InvoiceTable";

const InvoiceLedger = () => {
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const { data, isLoading, isFetching, isError } = useInvoices(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Invoice Ledger</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {data && <SummaryCards summary={data.summary} />}
        <Filters filters={filters} onChange={setFilters} />

        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-indigo-500 mb-3">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        )}

        {isLoading && !data && (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
            <p className="font-medium">Failed to load invoices.</p>
            <p className="text-sm mt-1">
              Make sure the backend is running on port 8000.
            </p>
          </div>
        )}

        {data && (
          <>
            <div className="text-sm text-gray-500 mb-3">
              Showing {data.count} invoice{data.count !== 1 ? "s" : ""}
            </div>
            <InvoiceTable invoices={data.data} />
          </>
        )}
      </main>
    </div>
  );
};

export default InvoiceLedger;
