#!/bin/bash

# enforce-yarn.sh
# Cursor hook: beforeShellExecution (matcher: npm|pnpm)
# Blocks npm and pnpm commands. This monorepo requires Yarn 1.x.

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

if echo "$command" | grep -qE '(^|\s|&&|;|\|)\s*(npm|pnpm)\s'; then
  cat << 'EOF'
{
  "permission": "deny",
  "user_message": "Blocked: This monorepo uses Yarn 1.x. Use 'yarn' instead of npm/pnpm.",
  "agent_message": "This command was blocked because the Puck monorepo requires Yarn 1.x for workspace resolution. Replace 'npm install' with 'yarn', 'npm run' with 'yarn', and 'npm test' with 'yarn test'. Never use npm or pnpm in this repository."
}
EOF
  exit 0
fi

cat << 'EOF'
{
  "permission": "allow"
}
EOF
exit 0
