# NorteAI Pessoal Supabase Foundation

This folder contains the production PostgreSQL/Supabase foundation for NorteAI Pessoal.

## Scope

Implemented in schema:

- Supabase Auth profile mirror
- User -> Workspace -> Financial Data model
- Personal workspace auto-provisioning for each new auth user
- Independent data sources per workspace
- Base categories per workspace
- Row Level Security on every financial table
- Workspace membership based isolation

Not implemented here:

- Generative AI
- MCP
- Open Banking
- Google Drive sync
- Broker API sync
- Family product logic
- Freelancer product logic
- Business product logic

## Apply order

Apply migrations in lexical order:

1. `migrations/20260812_personal_production_foundation.sql`

## Required validation before using real financial data

- Create two Supabase Auth users.
- Confirm each user receives one independent PERSONAL workspace.
- Insert accounts/transactions for user A and confirm user B cannot select, update, or delete them.
- Confirm `data_sources` rows are created per workspace.
- Confirm no table with financial data can be queried without an authenticated user.
