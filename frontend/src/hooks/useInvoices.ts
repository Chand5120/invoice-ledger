import { useQuery } from "@tanstack/react-query";
import { fetchInvoices, fetchInvoiceById } from "../api/invoices";
import type { InvoiceFilters } from "../types";

export const useInvoices = (filters: InvoiceFilters = {}) => {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => fetchInvoices(filters),
  });
};

export const useInvoice = (id: number) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id,
  });
};
