---
name: db-migrate
description: Safe Prisma migration workflow for DentWise on Neon - one-time baseline from db push, then schema change, migration on a Neon dev branch, client generation and prod hand-off. Use for any change to prisma/schema.prisma.
argument-hint: <what to change, or "baseline">
disable-model-invocation: true
---

Request: $ARGUMENTS

## Safety first
- Never use `db push`, `migrate reset`, or `migrate deploy`. Never touch the production branch.
- Ask the owner to confirm `DATABASE_URL` in `.env` points to a **Neon DEV branch** before any
  `migrate dev` (you can't read `.env`; you can list branches with the Neon MCP to help).
  If no dev branch exists, offer to create one with the Neon MCP (`create_branch`, needs approval),
  and tell the owner to put its connection string in `.env` themselves.

## A) One-time baseline (if `prisma/migrations` does not exist)
The DB was created with `db push`, so it has tables but no migration history.
1. `mkdir -p prisma/migrations/0_init`
2. `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`
3. Show the SQL summary to the owner.
4. On the dev branch: `npx prisma migrate resolve --applied 0_init` (needs approval).
5. **Your turn (owner):** run the same `migrate resolve --applied 0_init` against PRODUCTION once.
6. Commit: `chore: baseline prisma migrations`.

## B) Normal schema change
1. Use the `db-architect` agent to design the change; show the schema diff + risks; WAIT for OK.
2. Edit `prisma/schema.prisma`, then `npx prisma format` and `npx prisma validate`.
3. `npx prisma migrate dev --name <snake_case_name>` (dev branch only).
4. Review the generated `migration.sql` — flag any DROP or data loss to the owner.
5. `npx prisma generate`, update affected server actions/types, `npx tsc --noEmit`.
6. Commit: `feat(db): <description>`.
7. Summary → **Your turn:** after merging, run `npx prisma migrate deploy` with the PRODUCTION URL.
