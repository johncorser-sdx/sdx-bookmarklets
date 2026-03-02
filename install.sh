#!/usr/bin/env bash
set -euo pipefail

REPO="johncorser-sdx/sdx-bookmarklets"
NAME="${1:?Usage: install.sh <bookmarklet-name>}"
FILE="${NAME}.js"

BOOKMARKLET=$(curl -sL "https://raw.githubusercontent.com/${REPO}/main/${FILE}" \
  | grep '^// BOOKMARKLET:' -A1 | tail -1 | sed 's|^// ||')

if [ -z "$BOOKMARKLET" ]; then
  echo "Error: Could not find BOOKMARKLET line in ${FILE}" >&2
  exit 1
fi

echo "$BOOKMARKLET" | tr -d '\n' | pbcopy
echo "Copied '${NAME}' bookmarklet to clipboard."
echo "Create a new bookmark and paste as the URL."
