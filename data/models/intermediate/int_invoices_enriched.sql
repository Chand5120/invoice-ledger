-- Intermediate layer: apply business logic, derive calculated fields
with staged as (
    select * from {{ ref('stg_invoices') }}
),

enriched as (
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

        -- Days between issue and due date (payment terms)
        cast(due_date - issue_date as integer)                          as payment_terms_days,

        -- Days overdue (positive = overdue, null if paid or not yet due)
        case
            when status = 'overdue'
            then cast(current_date - due_date as integer)
            else null
        end                                                             as days_overdue,

        -- Days to pay (only for paid invoices)
        case
            when paid_date is not null
            then cast(paid_date - issue_date as integer)
            else null
        end                                                             as days_to_pay,

        -- Boolean flags
        case when status = 'overdue' then true else false end           as is_overdue,
        case when status = 'paid' then true else false end              as is_paid,
        case when paid_date is not null then true else false end        as has_paid_date,

        -- Outstanding amount (0 if paid, full amount otherwise)
        case
            when status = 'paid' then 0.00
            else amount
        end                                                             as outstanding_amount

    from staged
)

select * from enriched
