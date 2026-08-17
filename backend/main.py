from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from models import InvoiceResponse, InvoiceListResponse, InvoiceSummary
from database import query

app = FastAPI(
    title="Invoice Ledger API",
    description="Serves transformed invoice ledger data from the dbt mart layer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

MART_TABLE = "main.mart_invoice_ledger"


@app.get("/api/v1/invoices", response_model=InvoiceListResponse)
def list_invoices(
    status: Optional[str] = Query(None, description="Filter by status: paid, pending, overdue"),
    risk_tier: Optional[str] = Query(None, description="Filter by risk tier: LOW, MEDIUM, HIGH"),
    client_name: Optional[str] = Query(None, description="Filter by client name (partial match)"),
):
    filters = []
    params = []

    if status:
        filters.append("status = ?")
        params.append(status.lower())

    if risk_tier:
        filters.append("risk_tier = ?")
        params.append(risk_tier.upper())

    if client_name:
        filters.append("client_name ILIKE ?")
        params.append(f"%{client_name}%")

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

    invoices = query(
        f"SELECT * FROM {MART_TABLE} {where_clause} ORDER BY issue_date DESC",
        params,
    )

    if not invoices:
        return InvoiceListResponse(
            data=[],
            summary=InvoiceSummary(
                total_invoices=0,
                total_amount=0,
                total_outstanding=0,
                total_paid=0,
                overdue_count=0,
                pending_count=0,
                paid_count=0,
                high_risk_count=0,
            ),
            count=0,
        )

    summary_rows = query(f"SELECT * FROM {MART_TABLE} {where_clause}", params)

    summary = InvoiceSummary(
        total_invoices=len(summary_rows),
        total_amount=sum(r["amount"] for r in summary_rows),
        total_outstanding=sum(r["outstanding_amount"] for r in summary_rows),
        total_paid=sum(r["amount"] for r in summary_rows if r["is_paid"]),
        overdue_count=sum(1 for r in summary_rows if r["status"] == "overdue"),
        pending_count=sum(1 for r in summary_rows if r["status"] == "pending"),
        paid_count=sum(1 for r in summary_rows if r["status"] == "paid"),
        high_risk_count=sum(1 for r in summary_rows if r["risk_tier"] == "HIGH"),
    )

    return InvoiceListResponse(
        data=[InvoiceResponse(**row) for row in invoices],
        summary=summary,
        count=len(invoices),
    )


@app.get("/api/v1/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int):
    rows = query(
        f"SELECT * FROM {MART_TABLE} WHERE invoice_id = ?",
        [invoice_id],
    )
    if not rows:
        raise HTTPException(status_code=404, detail=f"Invoice {invoice_id} not found")
    return InvoiceResponse(**rows[0])


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}
