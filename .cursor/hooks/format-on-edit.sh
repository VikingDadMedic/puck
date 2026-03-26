#!/bin/bash

# format-on-edit.sh
# Cursor hook: afterFileEdit
# Auto-formats files edited by the agent using Prettier.

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty')

if [ -z "$file_path" ]; then
  exit 0
fi

case "$file_path" in
  *.ts|*.tsx|*.css|*.md|*.mdx)
    yarn prettier --write "$file_path" 2>/dev/null
    ;;
esac

exit 0
