# Known Issues in Stackby API

This document tracks bugs and limitations discovered in the Stackby API.

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

### Root Cause

The Stackby API cannot properly handle column names that end with whitespace characters.

### Workaround

1. **Rename the column** in Stackby to remove the trailing space
2. **Omit the field** from API requests and manage it manually in the Stackby UI

### Notes

The server error response includes a Node.js stack trace suggesting the error originates in their validation middleware:
```
/Stackby_API/v1/middleware/errorHandler.js:17:31
```

---

## Limitation: Maximum 10 rows per request

**Type:** Documented limitation
**Impact:** Medium

### Description

The `/rowcreate` endpoint accepts a maximum of 10 rows per request.

### Workaround

Batch your requests in groups of 10:

```javascript
const chunks = [];
for (let i = 0; i < rows.length; i += 10) {
  chunks.push(rows.slice(i, i + 10));
}

for (const chunk of chunks) {
  await createRows(chunk);
  await sleep(200); // Rate limiting
}
```

---

## Issue: Inconsistent error messages

**Severity:** Low
**Type:** UX Issue

### Description

The API returns misleading error messages. For example:

- `{"error":"Only 10 rows are allowed with single request."}` is returned even when sending 1 row with an invalid format.

This makes debugging difficult as the error message doesn't reflect the actual problem.

---

## Reporting New Issues

If you discover a new issue, please:

1. Open an issue in this repository with reproduction steps
2. Consider reporting to Stackby support as well

Together we can help improve the API!
