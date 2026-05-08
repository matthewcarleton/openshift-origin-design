#!/usr/bin/env bash
# Jira Cloud REST API helper (Red Hat). Token: ~/.jira-token (600). Do not commit tokens.
# Base: https://redhat.atlassian.net/rest/api/3
set -euo pipefail

: "${JIRA_BASE_URL:=https://redhat.atlassian.net/rest/api/3}"
: "${JIRA_USER:=khatchou@redhat.com}"
: "${JIRA_TOKEN_FILE:=$HOME/.jira-token}"

_jira_token() {
  if [[ ! -f "$JIRA_TOKEN_FILE" ]]; then
    echo "jira-api: missing token file: $JIRA_TOKEN_FILE" >&2
    return 1
  fi
  tr -d '\n' <"$JIRA_TOKEN_FILE"
}

_jira_auth() {
  printf '%s:%s' "$JIRA_USER" "$(_jira_token)"
}

# POST /rest/api/3/search/jql — JQL search (use this; GET /search is removed)
jira_search() {
  local jql="${1:?Usage: jira_search \"<JQL>\" [maxResults]}"
  local max="${2:-50}"
  if ! command -v jq &>/dev/null; then
    echo "jira_search requires jq to build JSON safely" >&2
    return 1
  fi
  local payload
  payload=$(jq -n --arg jql "$jql" --argjson max "$max" '{jql: $jql, maxResults: $max}')
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$payload" \
    "$JIRA_BASE_URL/search/jql"
}

jira_get_issue() {
  local key="${1:?Usage: jira_get_issue KEY}"
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -X GET \
    "$JIRA_BASE_URL/issue/${key}"
}

# JSON body for create (project, issuetype, fields, etc.)
jira_create_issue() {
  local json="${1:?Usage: jira_create_issue '<json body>'}"
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$json" \
    "$JIRA_BASE_URL/issue"
}

jira_edit_issue() {
  local key="${1:?Usage: jira_edit_issue KEY '<json body>'}"
  local json="${2:?Usage: jira_edit_issue KEY '<json body>'}"
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X PUT \
    -d "$json" \
    "$JIRA_BASE_URL/issue/${key}"
}

jira_get_transitions() {
  local key="${1:?Usage: jira_get_transitions KEY}"
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -X GET \
    "$JIRA_BASE_URL/issue/${key}/transitions"
}

jira_transition_issue() {
  local key="${1:?Usage: jira_transition_issue KEY '<json body>'}"
  local json="${2:?Usage: jira_transition_issue KEY '<json body>'}"
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$json" \
    "$JIRA_BASE_URL/issue/${key}/transitions"
}

# Plain text → Jira Cloud ADF comment body
jira_add_comment() {
  local key="${1:?Usage: jira_add_comment KEY \"comment text\"}"
  local text="${2:?Usage: jira_add_comment KEY \"comment text\"}"
  if ! command -v jq &>/dev/null; then
    echo "jira_add_comment requires jq" >&2
    return 1
  fi
  local json
  json=$(
    jq -n --arg t "$text" '{
      body: {
        type: "doc",
        version: 1,
        content: [
          { type: "paragraph", content: [ { type: "text", text: $t } ] }
        ]
      }
    }'
  )
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$json" \
    "$JIRA_BASE_URL/issue/${key}/comment"
}

jira_lookup_user() {
  local name="${1:?Usage: jira_lookup_user name}"
  local q
  q=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$name")
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -X GET \
    "$JIRA_BASE_URL/user/search?query=${q}"
}

# type = link type name (e.g. Relates, Blocks). KEY-1 = inward, KEY-2 = outward
jira_link_issues() {
  local ltype="${1:?Usage: jira_link_issues type KEY-1 KEY-2}"
  local k1="${2:?Usage: jira_link_issues type KEY-1 KEY-2}"
  local k2="${3:?Usage: jira_link_issues type KEY-1 KEY-2}"
  if ! command -v jq &>/dev/null; then
    echo "jira_link_issues requires jq" >&2
    return 1
  fi
  local json
  json=$(
    jq -n --arg t "$ltype" --arg a "$k1" --arg b "$k2" '{
      type: {name: $t},
      inwardIssue: {key: $a},
      outwardIssue: {key: $b}
    }'
  )
  curl -sS -u "$(_jira_auth)" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$json" \
    "$JIRA_BASE_URL/issueLink"
}

# When executed (not sourced), subcommand: bash jira-api.sh jira_get_issue OCP-1
if [[ -n "${BASH_VERSION:-}" ]] && [[ "${BASH_SOURCE[0]:-}" == "$0" ]]; then
  case "${1:-}" in
    jira_search) shift; jira_search "$@" ;;
    jira_get_issue) shift; jira_get_issue "$@" ;;
    jira_create_issue) shift; jira_create_issue "$@" ;;
    jira_edit_issue) shift; jira_edit_issue "$@" ;;
    jira_transition_issue) shift; jira_transition_issue "$@" ;;
    jira_get_transitions) shift; jira_get_transitions "$@" ;;
    jira_add_comment) shift; jira_add_comment "$@" ;;
    jira_lookup_user) shift; jira_lookup_user "$@" ;;
    jira_link_issues) shift; jira_link_issues "$@" ;;
    help|--help|-h)
      cat <<'EOF'
Source this file, then call:
  jira_search "<JQL>" [maxResults]     POST /search/jql
  jira_get_issue KEY
  jira_create_issue '<json>'
  jira_edit_issue KEY '<json>'
  jira_get_transitions KEY
  jira_transition_issue KEY '<json>'
  jira_add_comment KEY "text"
  jira_lookup_user name
  jira_link_issues "type" "KEY-1" "KEY-2"

Or:  bash scripts/jira-api.sh jira_get_issue OCPUX-1
EOF
      ;;
    *)
      if [[ -n "${1:-}" ]]; then
        echo "Unknown: $1. Use: source scripts/jira-api.sh  or  bash scripts/jira-api.sh help" >&2
        exit 1
      fi
      echo "source this script to use jira_* functions" >&2
      exit 1
      ;;
  esac
fi
