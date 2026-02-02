#!/bin/bash
# Create a new row in a Stackby table

API_KEY="${STACKBY_API_KEY:-your_api_key_here}"
STACK_ID="${STACKBY_STACK_ID:-stXXXXXXXXXXXXXXXX}"
TABLE_ID="${STACKBY_TABLE_ID:-tbYYYYYYYYYYYYYYYY}"

# IMPORTANT: Use "field" (singular), NOT "fields" (plural)
curl -s -X POST "https://stackby.com/api/betav1/rowcreate/${STACK_ID}/${TABLE_ID}" \
  -H "Content-Type: application/json" \
  -H "api-key: ${API_KEY}" \
  -d '{
    "records": [
      {
        "field": {
          "Name": "John Doe",
          "Email": "john@example.com",
          "Status": "Active"
        }
      }
    ]
  }' | jq '.'
