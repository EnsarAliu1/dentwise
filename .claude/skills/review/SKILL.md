---
name: review
description: Run lint, type-check and build, then the code-reviewer agent, on the current branch before the owner pushes.
disable-model-invocation: true
---

1. `git status` and `git log main..HEAD --oneline` — list what will be reviewed.
2. Run `npm run lint`, `npx tsc --noEmit`, `npm run build`. Report pass/fail.
3. Run the `code-reviewer` agent on the branch.
4. Show its report. Ask the owner whether to fix the "Must fix" / "Should fix" items now.
5. If everything is clean: under **Your turn** give the exact `git push -u origin <branch>` command.
