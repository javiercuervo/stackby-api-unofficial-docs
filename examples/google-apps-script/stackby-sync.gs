/**
 * Stackby API Client for Google Apps Script
 *
 * This is a simplified version of a working production integration.
 *
 * Setup:
 * 1. Create a new Google Apps Script project
 * 2. Add your API credentials using PropertiesService
 * 3. Run setupCredentials() once to store your keys
 */

// Configuration
const CONFIG = {
  STACKBY_BASE_URL: 'https://stackby.com/api/betav1'
};

/**
 * Store your Stackby credentials (run once)
 */
function setupCredentials() {
  const props = PropertiesService.getScriptProperties();

  // Replace with your actual values
  props.setProperty('STACKBY_API_KEY', 'your_api_key_here');
  props.setProperty('STACKBY_STACK_ID', 'stXXXXXXXXXXXXXXXX');
  props.setProperty('STACKBY_TABLE_ID', 'tbYYYYYYYYYYYYYYYY');

  Logger.log('Credentials stored successfully');
}

/**
 * List all rows from Stackby
 */
function listRows() {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('STACKBY_API_KEY');
  const stackId = props.getProperty('STACKBY_STACK_ID');
  const tableId = props.getProperty('STACKBY_TABLE_ID');

  const url = `${CONFIG.STACKBY_BASE_URL}/rowlist/${stackId}/${tableId}`;

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'api-key': apiKey },
    muteHttpExceptions: true
  });

  Logger.log(`Status: ${response.getResponseCode()}`);
  Logger.log(`Response: ${response.getContentText()}`);

  return JSON.parse(response.getContentText());
}

/**
 * Create a row in Stackby
 *
 * IMPORTANT: Use "field" (singular), NOT "fields" (plural)
 *
 * @param {Object} fields - Key-value pairs matching your Stackby column names
 */
function createRow(fields) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('STACKBY_API_KEY');
  const stackId = props.getProperty('STACKBY_STACK_ID');
  const tableId = props.getProperty('STACKBY_TABLE_ID');

  const url = `${CONFIG.STACKBY_BASE_URL}/rowcreate/${stackId}/${tableId}`;

  // Convert null/undefined values to empty strings
  const safeFields = {};
  for (const key in fields) {
    safeFields[key] = fields[key] == null ? '' : String(fields[key]);
  }

  // CRITICAL: The key is "field" (singular), NOT "fields" (plural)
  const payload = {
    records: [{ field: safeFields }]
  };

  Logger.log(`Sending to Stackby: ${JSON.stringify(payload)}`);

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'api-key': apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  Logger.log(`Status: ${responseCode}`);
  Logger.log(`Response: ${responseText}`);

  if (responseCode >= 200 && responseCode < 300) {
    return JSON.parse(responseText);
  } else {
    throw new Error(`Stackby API error ${responseCode}: ${responseText}`);
  }
}

/**
 * Update a row in Stackby
 *
 * @param {string} rowId - The row ID (starts with "rw")
 * @param {Object} fields - Fields to update
 */
function updateRow(rowId, fields) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('STACKBY_API_KEY');
  const stackId = props.getProperty('STACKBY_STACK_ID');
  const tableId = props.getProperty('STACKBY_TABLE_ID');

  const url = `${CONFIG.STACKBY_BASE_URL}/rowupdate/${stackId}/${tableId}`;

  const payload = {
    records: [{ id: rowId, field: fields }]
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { 'api-key': apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  return JSON.parse(response.getContentText());
}

/**
 * Delete a row from Stackby
 *
 * @param {string} rowId - The row ID to delete
 */
function deleteRow(rowId) {
  const props = PropertiesService.getScriptProperties();
  const apiKey = props.getProperty('STACKBY_API_KEY');
  const stackId = props.getProperty('STACKBY_STACK_ID');
  const tableId = props.getProperty('STACKBY_TABLE_ID');

  // Note: Row IDs are passed as query parameters
  const url = `${CONFIG.STACKBY_BASE_URL}/rowdelete/${stackId}/${tableId}?rowIds[]=${rowId}`;

  const response = UrlFetchApp.fetch(url, {
    method: 'delete',
    headers: { 'api-key': apiKey },
    muteHttpExceptions: true
  });

  return JSON.parse(response.getContentText());
}

/**
 * Example: Sync a row from Google Sheets to Stackby
 */
function exampleSync() {
  // Example data (would come from a spreadsheet in real use)
  const rowData = {
    'Name': 'John Doe',
    'Email': 'john@example.com',
    'Phone': '123-456-7890',
    'Status': 'Active'
  };

  try {
    const result = createRow(rowData);
    Logger.log(`Created row with ID: ${result[0].id}`);
    return result;
  } catch (e) {
    Logger.log(`Error: ${e.message}`);
    throw e;
  }
}
