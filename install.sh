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

BOOKMARKS_FILE="$HOME/Library/Application Support/Google/Chrome/Default/Bookmarks"

if [ ! -f "$BOOKMARKS_FILE" ]; then
  echo "Chrome bookmarks file not found. Copying to clipboard instead."
  echo "$BOOKMARKLET" | tr -d '\n' | pbcopy
  echo "Copied '${NAME}' bookmarklet to clipboard."
  echo "Create a new bookmark and paste as the URL."
  exit 0
fi

# Friendly display names for known bookmarklets
case "$NAME" in
  aws-federated-deeplink) DISPLAY_NAME="Generate Deeplink" ;;
  pr-open)                DISPLAY_NAME="PR Open" ;;
  *)                      DISPLAY_NAME="$NAME" ;;
esac

python3 - "$BOOKMARKS_FILE" "$BOOKMARKLET" "$DISPLAY_NAME" <<'PYTHON'
import json, sys, uuid, time

bookmarks_path = sys.argv[1]
bookmarklet_url = sys.argv[2]
display_name = sys.argv[3]

with open(bookmarks_path, "r") as f:
    data = json.load(f)

bar = data["roots"]["bookmark_bar"]
children = bar.get("children", [])

# Remove existing bookmark with the same name to allow re-installs
children = [c for c in children if c.get("name") != display_name]

# Find the next available ID
def max_id(node):
    m = int(node.get("id", "0"))
    for child in node.get("children", []):
        m = max(m, max_id(child))
    return m

next_id = str(max(max_id(r) for r in data["roots"].values()) + 1)

# Chrome epoch: microseconds since 1601-01-01
chrome_epoch = int((time.time() + 11644473600) * 1_000_000)

children.append({
    "date_added": str(chrome_epoch),
    "date_last_used": "0",
    "guid": str(uuid.uuid4()),
    "id": next_id,
    "name": display_name,
    "type": "url",
    "url": bookmarklet_url,
})

bar["children"] = children
bar["date_modified"] = str(chrome_epoch)

with open(bookmarks_path, "w") as f:
    json.dump(data, f, indent=3)

print(f"Added '{display_name}' to Chrome bookmarks bar.")
PYTHON

echo "Restart Chrome (or open a new tab) to see it."
