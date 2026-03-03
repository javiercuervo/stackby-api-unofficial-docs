# Known Issues in Stackby API

This document tracks bugs and limitations discovered in the Stackby API through extensive real-world usage.

---

## CRITICAL: Complete API outage (February–March 2026)

**Severity:** Critical
**Status:** Unresolved (as of our last check)
**Discovered:** February 23, 2026

### Description

Starting February 23, 2026, **all Stackby API endpoints began returning HTTP 500 errors**. This affected:

- All endpoints (`rowlist`, `rowcreate`, `rowupdate`, `rowdelete`)
- All stacks (tested across multiple stacks and tables)
- Both API versions (`betav1` and `v1`)
- Any parameters or payloads

The web UI continued to function normally — only the API was affected.

### Server Error Details

The error response revealed a server-side bug:

```
TypeError: Cannot read properties of null (reading 'length')
```

The server was attempting to use the error message string as an HTTP status code, resulting in corrupted responses.

### Impact

This outage broke all automations, integrations, and workflows built on top of the Stackby API. For our organization, this meant:

- CRM synchronization stopped
- Automated workflows halted
- Data pipelines failed

### Response from Stackby

- **No public status page or incident notification** was published
- When reported via support (Gleap ticket #12909), the response deflected: "We have no idea how you're using the API" and asked which endpoints were affected — despite the issue being universal across all endpoints
- A Loom video recorded on March 2 (a week after the outage began) claimed the API was working, but the video had no audio and was recorded by a different team member

### Lesson Learned

If you are building production systems on Stackby's API, implement robust fallbacks. There is no SLA, no status page, and no proactive communication when the API goes down.

---

## Bug: Column names with trailing spaces cause HTTP 501

**Severity:** High
**Status:** Unresolved
**Discovered:** February 2026

### Description

When a column name in Stackby ends with a space (e.g., `"ACCEPTED IN "`), any API request that includes this field will fail with HTTP 501 "Something went wrong".

### Reproduction

```bash
# Column exists in Stackby as "ACCEPTED IN " (with trailing space)

# With trailing space - FAILS
curl -X POST '.../rowcreate/...' \
  -d '{"records":[{"field":{"ACCEPTED IN ":""}}]}'
# Response: HTTP 501 {"error":"Something went wrong"}

# Without trailing space - Column not found
curl -X POST '.../rowcreate/...' \
  -d '{"records":[{"field":{"ACCEPTED IN":""}}]}'
# Response: HTTP 400 {"error":"please check table or column name to verify!"}
```

### Workaround

Rename the column in Stackby to remove the trailing space.

---

## Bug: PATCH /rowupdate returns HTTP 500

**Severity:** High
**Status:** Unresolved
**Discovered:** February 2026

### Description

The `PATCH /rowupdate` endpoint consistently returns HTTP 500 errors regardless of payload format. This endpoint appears to be broken on the server side.

### Reproduction

```bash
curl -X PATCH 'https://stackby.com/api/betav1/rowupdate/stXXXXXX/tbYYYYYY' \
  -H 'Content-Type: application/json' \
  -H 'api-key: YOUR_API_KEY' \
  -d '{"records": [{"id": "rwXXXXXX", "field": {"Name": "Updated"}}]}'
# Response: HTTP 500
```

### Workaround

There is no known workaround. To update rows, you must delete and recreate them, which is destructive and loses row IDs.

---

## Bug: Billing system does not reflect add-on payments

**Severity:** High
**Status:** Unresolved
**Discovered:** February 2026

### Description

After purchasing a $399 Powerups add-on via a Stripe payment link provided by Stackby's co-founder through their support chat, the payment was never reflected in the Stackby billing panel. The Add-ons section shows "No records found" despite the payment being confirmed via Stripe receipt.

---

## Limitation: Maximum 10 rows per request

**Type:** Documented limitation
**Impact:** Medium

Batch your requests in groups of 10 with rate limiting between batches.

---

## Issue: Inconsistent and misleading error messages

**Severity:** Low

The API returns error messages that don't reflect the actual problem:

- `"Only 10 rows are allowed with single request."` is returned even when sending 1 row with an invalid format
- HTTP status codes in responses are sometimes corrupted (e.g., the error message string used as status code)

---

*Last updated: March 2026*
