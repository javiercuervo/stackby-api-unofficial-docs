# Stackby API - Unofficial Documentation

> **NOTICE (March 2026):** We no longer use Stackby. After experiencing a complete API outage lasting over a week (all endpoints returning HTTP 500), combined with unresponsive support, unreliable billing, and missing invoices, we decided to move on. This repository remains public as a reference for anyone still working with the Stackby API.

> Community-driven documentation for Stackby's Developer API, filling the gaps in official documentation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

[Stackby](https://stackby.com) is a spreadsheet-database hybrid whose API documentation is incomplete, outdated, and in some cases incorrect. We created this repository after spending significant time debugging issues that were caused by undocumented behavior — not by our code.

**Key Discovery:** The API uses `field` (singular), NOT `fields` (plural) — a critical detail missing from all official sources.

## Why We Stopped Using Stackby

After months of building integrations on top of Stackby, we encountered issues that made it untenable as a production platform:

1. **Complete API outage (Feb 23 – Mar 2026):** All API endpoints started returning HTTP 500. The web UI continued working, but the API — the foundation of our automations — was completely down with zero communication from Stackby.
2. **Unresponsive support:** Formal complaints with documented evidence and deadlines were met with partial, deflective responses. No acknowledgment of the outage scope.
3. **Billing discrepancies:** A $399 add-on payment was not reflected in their billing system ("No records found" in the Add-ons panel).
4. **Missing invoices:** Despite providing full EU billing details (company name, VAT number, address) on the day of purchase, no invoice was issued for over two months — a violation of EU Directive 2006/112/EC.
5. **Features not delivered as advertised:** Automation runs were capped at 100/month instead of the 500/month included with our tier.

We documented everything and sought refunds through the appropriate channels. AppSumo reviewed our evidence and processed a refund for their portion of the purchase.

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

### Delete Rows

```bash
DELETE /rowdelete/{stackId}/{tableId}?rowIds[]={rowId}
```

> **Note:** Row IDs are passed as query parameters, NOT in the request body.

**Multiple rows:**
```bash
?rowIds[]=rw111&rowIds[]=rw222&rowIds[]=rw333
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

## Known Issues

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for documented bugs in the Stackby API, including the February 2026 complete API outage.

## Code Examples

- [curl examples](examples/curl/)
- [JavaScript client](examples/javascript/)
- [Python client](examples/python/)
- [Google Apps Script](examples/google-apps-script/)

## Contributing

Found something new? Please open an issue or PR.

## License

MIT License - See [LICENSE](LICENSE)

---

*Last updated: March 2026*
*Status: No longer maintained — we stopped using Stackby*
