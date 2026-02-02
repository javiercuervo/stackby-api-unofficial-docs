#!/bin/bash
# Update an existing row in a Stackby table

API_KEY="${STACKBY_API_KEY:-your_api_key_here}"
STACK_ID="${STACKBY_STACK_ID:-stXXXXXXXXXXXXXXXX}"
TABLE_ID="${STACKBY_TABLE_ID:-tbYYYYYYYYYYYYYYYY}"
ROW_ID="${1:-rwZZZZZZZZZZZZZZZZ}"

curl -s -X PATCH "https://stackby.com/api/betav1/rowupdate/${STACK_ID}/${TABLE_ID}" \
  -H "Content-Type: application/json" \
  -H "api-key: ${API_KEY}" \
  -d "{
    \"records\": [
      {
        \"id\": \"${ROW_ID}\",
        \"field\": {
          \"Status\": \"Updated\"
        }
      }
    ]
  }" | jq '.'
