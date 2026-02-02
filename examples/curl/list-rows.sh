#!/bin/bash
# List all rows from a Stackby table

API_KEY="${STACKBY_API_KEY:-your_api_key_here}"
STACK_ID="${STACKBY_STACK_ID:-stXXXXXXXXXXXXXXXX}"
TABLE_ID="${STACKBY_TABLE_ID:-tbYYYYYYYYYYYYYYYY}"

curl -s -X GET "https://stackby.com/api/betav1/rowlist/${STACK_ID}/${TABLE_ID}" \
  -H "api-key: ${API_KEY}" | jq '.'
