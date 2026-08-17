-- Staging layer: clean raw data, cast types, rename for consistency
with source as (
    select * from {{ ref('raw_invoices') }}
),

staged as (
    select
        cast(id as integer)                          as invoice_id,
        trim(invoice_number)                         as invoice_number,
        trim(client_name)                            as client_name,
        lower(trim(client_email))                    as client_email,
        cast(amount as decimal(15, 2))               as amount,
        upper(trim(currency))                        as currency,
        lower(trim(status))                          as status,
        cast(issue_date as date)                     as issue_date,
        cast(due_date as date)                       as due_date,
        cast(paid_date as date)                      as paid_date
    from source
)

select * from staged
