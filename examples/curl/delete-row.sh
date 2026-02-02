#!/bin/bash
# Delete a row from a Stackby table

API_KEY="${STACKBY_API_KEY:-your_api_key_here}"
STACK_ID="${STACKBY_STACK_ID:-stXXXXXXXXXXXXXXXX}"
TABLE_ID="${STACKBY_TABLE_ID:-tbYYYYYYYYYYYYYYYY}"
ROW_ID="${1:-rwZZZZZZZZZZZZZZZZ}"

# Note: Row IDs are passed as query parameters, NOT in the body
curl -s -X DELETE "https://stackby.com/api/betav1/rowdelete/${STACK_ID}/${TABLE_ID}?rowIds[]=${ROW_ID}" \
  -H "api-key: ${API_KEY}" | jq '.'
