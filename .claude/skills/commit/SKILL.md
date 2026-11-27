---
name: commit
description: Create clean local git commits (Conventional Commits) from the current changes. Never pushes.
disable-model-invocation: true
---

1. `git status` and `git diff`. If on `main`, stop and propose a branch name first.
2. Group changes into logical commits (don't mix unrelated work). Never stage `.env*` files.
3. Message format: `type(scope): short summary` — types: feat, fix, refactor, style, chore, docs, perf.
   Add a short body if the "why" isn't obvious.
4. Show the planned commits, then commit.
5. Report `git log --oneline -5`. Remind: pushing is the owner's job (`git push`).
