-- Marts layer: final query-ready invoice ledger, consumed by the API
with enriched as (
    select * from {{ ref('int_invoices_enriched') }}
),

final as (
    select
        invoice_id,
        invoice_number,
        client_name,
        client_email,
        amount,
        currency,
        status,
        issue_date,
        due_date,
        paid_date,
        payment_terms_days,
        days_overdue,
        days_to_pay,
        is_overdue,
        is_paid,
        outstanding_amount,

        -- Ledger classification
        case
            when status = 'paid'    then 'SETTLED'
            when status = 'overdue' then 'DELINQUENT'
            when status = 'pending' then 'OUTSTANDING'
            else 'UNKNOWN'
        end                                         as ledger_status,

        -- Risk tier based on outstanding amount and overdue days
        case
            when status = 'paid' then 'NONE'
            when status = 'overdue' and days_overdue > 60  then 'HIGH'
            when status = 'overdue' and days_overdue > 30  then 'MEDIUM'
            when status = 'overdue'                        then 'LOW'
            else 'NONE'
        end                                         as risk_tier,

        current_timestamp                           as refreshed_at

    from enriched
)

select * from final
