from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional
from enum import Enum


class InvoiceStatus(str, Enum):
    paid = "paid"
    pending = "pending"
    overdue = "overdue"


class LedgerStatus(str, Enum):
    SETTLED = "SETTLED"
    OUTSTANDING = "OUTSTANDING"
    DELINQUENT = "DELINQUENT"
    UNKNOWN = "UNKNOWN"


class RiskTier(str, Enum):
    NONE = "NONE"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class InvoiceResponse(BaseModel):
    invoice_id: int
    invoice_number: str
    client_name: str
    client_email: str
    amount: float
    currency: str
    status: InvoiceStatus
    issue_date: date
    due_date: date
    paid_date: Optional[date] = None
    payment_terms_days: int
    days_overdue: Optional[int] = None
    days_to_pay: Optional[int] = None
    is_overdue: bool
    is_paid: bool
    outstanding_amount: float
    ledger_status: LedgerStatus
    risk_tier: RiskTier
    refreshed_at: datetime

    model_config = {"from_attributes": True}


class InvoiceSummary(BaseModel):
    total_invoices: int
    total_amount: float
    total_outstanding: float
    total_paid: float
    overdue_count: int
    pending_count: int
    paid_count: int
    high_risk_count: int


class InvoiceListResponse(BaseModel):
    data: list[InvoiceResponse]
    summary: InvoiceSummary
    count: int
