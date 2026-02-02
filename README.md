# Stackby API - Unofficial Documentation

> Community-driven documentation for Stackby's Developer API, filling the gaps in official documentation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

[Stackby](https://stackby.com) is a powerful spreadsheet-database hybrid, but its API documentation is incomplete or outdated. This repository provides working examples and documentation discovered through extensive testing.

**Key Discovery:** The API uses `field` (singular), NOT `fields` (plural) - a critical detail missing from all official sources.

## Quick Start

### Authentication

All requests require an `api-key` header:

```bash
curl -H "api-key: YOUR_API_KEY" https://stackby.com/api/betav1/rowlist/{stackId}/{tableId}
```

Get your API key from: Stackby Dashboard > Settings > API

### Base URL

```
https://stackby.com/api/betav1/
```

> **Note:** `https://api.stackby.com` does NOT exist. Always use `stackby.com/api/`.

## Endpoints

### List Rows

```bash
GET /rowlist/{stackId}/{tableId}
```

**Example:**
```bash
curl -X GET 'https://stackby.com/api/betav1/rowlist/stXXXXXX/tbYYYYYY' \
  -H 'api-key: YOUR_API_KEY'
```

**Response:**
```json
[
  {
    "id": "rw123456789",
    "field": {
      "Name": "John Doe",
      "Email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
]
```

### Create Rows

```bash
POST /rowcreate/{stackId}/{tableId}
```

**Request Body:**
```json
{
  "records": [
    {
      "field": {
        "Name": "Jane Doe",
        "Email": "jane@example.com"
      }
    }
  ]
}
```

> **IMPORTANT:** Use `field` (singular), not `fields`. This is the most common mistake.

**Example:**
```bash
curl -X POST 'https://stackby.com/api/betav1/rowcreate/stXXXXXX/tbYYYYYY' \
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{"records": [{"field": {"Name": "Jane Doe", "Email": "jane@example.com"}}]}'
```

**Response:**
```json
[
  {
    "id": "rw987654321",
    "field": {
      "rowId": "rw987654321",
      "Name": "Jane Doe",
      "Email": "jane@example.com",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  }
]
```

**Limits:** Maximum 10 rows per request.

### Update Rows

```bash
PATCH /rowupdate/{stackId}/{tableId}
```

**Request Body:**
```json
{
  "records": [
    {
      "id": "rw987654321",
      "field": {
        "Name": "Jane Smith"
      }
    }
  ]
}
```

**Example:**
```bash
curl -X PATCH 'https://stackby.com/api/betav1/rowupdate/stXXXXXX/tbYYYYYY' \
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{"records": [{"id": "rw987654321", "field": {"Name": "Jane Smith"}}]}'
```

### Delete Rows

```bash
DELETE /rowdelete/{stackId}/{tableId}?rowIds[]={rowId}
```

> **Note:** Row IDs are passed as query parameters, NOT in the request body.

**Example:**
```bash
curl -X DELETE 'https://stackby.com/api/betav1/rowdelete/stXXXXXX/tbYYYYYY?rowIds[]=rw987654321' \
  -H 'api-key: YOUR_API_KEY'
```

**Multiple rows:**
```bash
?rowIds[]=rw111&rowIds[]=rw222&rowIds[]=rw333
```

**Response:**
```json
{
  "records": [
    {"id": "rw987654321", "deleted": true}
  ]
}
```

## Payload Format Summary

| Operation | Method | Payload Format |
|-----------|--------|----------------|
| Create | POST | `{"records": [{"field": {...}}]}` |
| Update | PATCH | `{"records": [{"id": "rowId", "field": {...}}]}` |
| Delete | DELETE | Query params: `?rowIds[]=id1&rowIds[]=id2` |
| List | GET | No body |

## Common Errors

### HTTP 500: "value" must be an object

**Cause:** You're sending an array instead of an object.

```json
// WRONG
[{"field": {"Name": "Test"}}]

// CORRECT
{"records": [{"field": {"Name": "Test"}}]}
```

### HTTP 500: Cannot convert undefined or null

**Cause:** Using `fields` (plural) instead of `field` (singular).

```json
// WRONG
{"records": [{"fields": {"Name": "Test"}}]}

// CORRECT
{"records": [{"field": {"Name": "Test"}}]}
```

### HTTP 400: "Only 10 rows are allowed"

**Cause:** Either sending more than 10 rows, OR the payload format is unrecognized.

### HTTP 400: "please check table or column name"

**Cause:** Column name doesn't match exactly (including case and spaces).

## Known Issues

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for documented bugs in the Stackby API.

## Code Examples

- [curl examples](examples/curl/)
- [JavaScript client](examples/javascript/)
- [Python client](examples/python/)
- [Google Apps Script](examples/google-apps-script/)

## Contributing

Found something new? Please open an issue or PR! This documentation helps the entire Stackby developer community.

## Acknowledgments

Thanks to the Stackby team for building a great product. This documentation is meant to complement official resources and help developers integrate more easily.

## License

MIT License - See [LICENSE](LICENSE)

---

*Last updated: February 2026*
*Tested with Stackby API betav1*
