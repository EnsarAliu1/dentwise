#!/usr/bin/env bash
# SessionStart hook: give Claude the current git state at the start of every session.
cd "$CLAUDE_PROJECT_DIR" || exit 0
echo "## Session context (auto)"
echo "Branch: $(git branch --show-current 2>/dev/null)"
echo "Uncommitted changes:"
git status --short 2>/dev/null | head -30
echo "Last commits:"
git log --oneline -5 2>/dev/null
if [ "$(git branch --show-current 2>/dev/null)" = "main" ]; then
  echo "NOTE: you are on main - create a feature branch before editing."
fi
exit 0
