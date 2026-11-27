#!/usr/bin/env bash
# PostToolUse hook: format the file Claude just edited with Biome.
# Reads the hook JSON from stdin. Never blocks Claude (always exits 0).
input="$(cat)"
file="$(printf '%s' "$input" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const j=JSON.parse(d);process.stdout.write((j.tool_input&&j.tool_input.file_path)||"")}catch{}})' 2>/dev/null)"
[ -z "$file" ] && exit 0
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.css) ;;
  *) exit 0 ;;
esac
case "$file" in
  *node_modules*|*.next*|*package-lock.json) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR" || exit 0
npx --no-install biome format --write "$file" >/dev/null 2>&1
exit 0
