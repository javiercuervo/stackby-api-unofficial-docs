/**
 * Stackby API Client for JavaScript/Node.js
 *
 * Usage:
 *   const client = new StackbyClient('your_api_key', 'stackId', 'tableId');
 *   const rows = await client.listRows();
 *   await client.createRow({ Name: 'John', Email: 'john@example.com' });
 */

class StackbyClient {
  constructor(apiKey, stackId, tableId) {
    this.apiKey = apiKey;
    this.stackId = stackId;
    this.tableId = tableId;
    this.baseUrl = 'https://stackby.com/api/betav1';
  }

  async request(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;

    const options = {
      method,
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stackby API error ${response.status}: ${error}`);
    }

    return response.json();
  }

  /**
   * List all rows in the table
   */
  async listRows() {
    return this.request('GET', `/rowlist/${this.stackId}/${this.tableId}`);
  }

  /**
   * Create one or more rows
   * @param {Object|Object[]} fields - Single row fields or array of row fields
   */
  async createRows(fields) {
    const records = Array.isArray(fields)
      ? fields.map(f => ({ field: f }))
      : [{ field: fields }];

    // IMPORTANT: Use "field" (singular), NOT "fields"
    return this.request('POST', `/rowcreate/${this.stackId}/${this.tableId}`, {
      records
    });
  }

  /**
   * Update one or more rows
   * @param {Object|Object[]} updates - { id, fields } or array of updates
   */
  async updateRows(updates) {
    const records = Array.isArray(updates)
      ? updates.map(u => ({ id: u.id, field: u.fields }))
      : [{ id: updates.id, field: updates.fields }];

    return this.request('PATCH', `/rowupdate/${this.stackId}/${this.tableId}`, {
      records
    });
  }

  /**
   * Delete one or more rows
   * @param {string|string[]} rowIds - Single row ID or array of IDs
   */
  async deleteRows(rowIds) {
    const ids = Array.isArray(rowIds) ? rowIds : [rowIds];
    const queryString = ids.map(id => `rowIds[]=${id}`).join('&');

    const url = `${this.baseUrl}/rowdelete/${this.stackId}/${this.tableId}?${queryString}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'api-key': this.apiKey },
    });

    return response.json();
  }
}

// Example usage
async function main() {
  const client = new StackbyClient(
    process.env.STACKBY_API_KEY,
    process.env.STACKBY_STACK_ID,
    process.env.STACKBY_TABLE_ID
  );

  // List rows
  const rows = await client.listRows();
  console.log('Existing rows:', rows.length);

  // Create a row
  const newRow = await client.createRows({
    Name: 'Test User',
    Email: 'test@example.com'
  });
  console.log('Created:', newRow[0].id);

  // Update the row
  await client.updateRows({
    id: newRow[0].id,
    fields: { Name: 'Updated User' }
  });
  console.log('Updated');

  // Delete the row
  await client.deleteRows(newRow[0].id);
  console.log('Deleted');
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

module.exports = { StackbyClient };
