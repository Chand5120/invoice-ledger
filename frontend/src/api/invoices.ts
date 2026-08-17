import axios from "axios"
import type { InvoiceListResponse, Invoice, InvoiceFilters } from "../types"

const BASE_URL = "http://localhost:8000/api/v1"

export const fetchInvoices = async (
  filters: InvoiceFilters = {}
): Promise<InvoiceListResponse> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
  )
  const { data } = await axios.get(`${BASE_URL}/invoices`, { params })
  return data
}

export const fetchInvoiceById = async (id: number): Promise<Invoice> => {
  const { data } = await axios.get(`${BASE_URL}/invoices/${id}`)
  return data
}
