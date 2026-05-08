#!/usr/bin/env bash
# Jira Cloud REST API helpers (Red Hat instance).
# Token: ~/.jira-token (chmod 600). Not committed to git.

set -euo pipefail

JIRA_BASE_URL="${JIRA_BASE_URL:-https://redhat.atlassian.net/rest/api/3}"
JIRA_EMAIL="${JIRA_EMAIL:-fkargbo@redhat.com}"
JIRA_TOKEN_FILE="${JIRA_TOKEN_FILE:-$HOME/.jira-token}"

_jira_token() {
  if [[ ! -f "$JIRA_TOKEN_FILE" ]]; then
    echo "jira-api: missing token file: $JIRA_TOKEN_FILE" >&2
    exit 1
  fi
  tr -d '\n\r' <"$JIRA_TOKEN_FILE"
}

_jira_auth_user() {
  printf '%s' "$JIRA_EMAIL"
}

# POST /rest/api/3/search/jql (legacy GET /search removed on Jira Cloud)
jira_search() {
  local jql="$1"
  local max_results="${2:-50}"
  local payload
  # New search API returns minimal issue objects unless fields are requested.
  payload="$(python3 -c 'import json,sys
jql, max_r = sys.argv[1], int(sys.argv[2])
fields = [
  "summary", "status", "issuetype", "project", "assignee", "updated", "created",
  "customfield_10028", "customfield_10795", "customfield_10464", "customfield_10014",
]
print(json.dumps({"jql": jql, "maxResults": max_r, "fields": fields}))
' "$jql" "$max_results")"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X POST "$JIRA_BASE_URL/search/jql" \
    --data-binary "$payload"
}

jira_get_issue() {
  local key="$1"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    "$JIRA_BASE_URL/issue/${key}"
}

jira_create_issue() {
  local json="$1"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X POST "$JIRA_BASE_URL/issue" \
    --data-binary "$json"
}

jira_edit_issue() {
  local key="$1"
  local json="$2"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X PUT "$JIRA_BASE_URL/issue/${key}" \
    --data-binary "$json"
}

jira_transition_issue() {
  local key="$1"
  local json="$2"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X POST "$JIRA_BASE_URL/issue/${key}/transitions" \
    --data-binary "$json"
}

jira_get_transitions() {
  local key="$1"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    "$JIRA_BASE_URL/issue/${key}/transitions"
}

jira_add_comment() {
  local key="$1"
  local text="$2"
  local payload
  payload="$(python3 -c '
import json, sys
text = sys.argv[1]
body = {
  "body": {
    "type": "doc",
    "version": 1,
    "content": [{"type": "paragraph", "content": [{"type": "text", "text": text}]}],
  }
}
print(json.dumps(body))
' "$text")"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X POST "$JIRA_BASE_URL/issue/${key}/comment" \
    --data-binary "$payload"
}

jira_lookup_user() {
  local query="$1"
  curl -sS -G -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    --data-urlencode "query=${query}" \
    "$JIRA_BASE_URL/user/search"
}

jira_link_issues() {
  local link_type="$1"
  local inward="$2"
  local outward="$3"
  local payload
  payload="$(python3 -c '
import json, sys
t, inward, outward = sys.argv[1], sys.argv[2], sys.argv[3]
print(json.dumps({
  "type": {"name": t},
  "inwardIssue": {"key": inward},
  "outwardIssue": {"key": outward},
}))
' "$link_type" "$inward" "$outward")"
  curl -sS -u "$(_jira_auth_user):$(_jira_token)" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X POST "$JIRA_BASE_URL/issueLink" \
    --data-binary "$payload"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  fn="${1:-}"
  shift || true
  case "$fn" in
    jira_search) jira_search "$@" ;;
    jira_get_issue) jira_get_issue "$@" ;;
    jira_create_issue) jira_create_issue "$@" ;;
    jira_edit_issue) jira_edit_issue "$@" ;;
    jira_transition_issue) jira_transition_issue "$@" ;;
    jira_get_transitions) jira_get_transitions "$@" ;;
    jira_add_comment) jira_add_comment "$@" ;;
    jira_lookup_user) jira_lookup_user "$@" ;;
    jira_link_issues) jira_link_issues "$@" ;;
    *)
      echo "Usage: $0 {jira_search|jira_get_issue|jira_create_issue|jira_edit_issue|jira_transition_issue|jira_get_transitions|jira_add_comment|jira_lookup_user|jira_link_issues} ..." >&2
      exit 1
      ;;
  esac
fi
