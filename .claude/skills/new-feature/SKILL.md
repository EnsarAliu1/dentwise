---
name: new-feature
description: Start and build a new DentWise feature end-to-end - branch, plan, approval, implementation, checks, local commit and summary. Use when the owner asks for a new feature or larger change.
argument-hint: <short feature description>
disable-model-invocation: true
---

Feature request: $ARGUMENTS

1. **Understand:** read the relevant files (use `CLAUDE.md` structure). If anything is ambiguous, ask
   up to 3 short questions and wait.
2. **Branch:** run `git status`. If there are uncommitted changes, stop and ask what to do.
   Create `feature/<kebab-name>` from the current branch (tell the owner if that isn't `main`).
3. **Plan** (post it and WAIT for OK):
   - Goal in one sentence
   - Files to create / change
   - Schema changes (if any → will use `/db-migrate`)
   - New packages (if any, and why)
   - Risks / things that could break
4. **Build** in small steps. Use the `ui-designer` agent for UI work and `db-architect` for schema
   design when useful. Commit locally after each logical step (Conventional Commits).
5. **Check:** `npm run lint`, `npx tsc --noEmit`, `npm run build`. Fix failures.
6. **Review:** run the `code-reviewer` agent and fix its "Must fix" items.
7. **Finish** with the Summary format from `CLAUDE.md`. Under **Your turn** include:
   `git push -u origin feature/<name>` and opening a PR, plus any env vars or prod migrations.
