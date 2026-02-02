"""
Stackby API Client for Python

Usage:
    client = StackbyClient('your_api_key', 'stackId', 'tableId')
    rows = client.list_rows()
    client.create_row({'Name': 'John', 'Email': 'john@example.com'})
"""

import os
import requests
from typing import Union, List, Dict, Any


class StackbyClient:
    BASE_URL = 'https://stackby.com/api/betav1'

    def __init__(self, api_key: str, stack_id: str, table_id: str):
        self.api_key = api_key
        self.stack_id = stack_id
        self.table_id = table_id
        self.headers = {
            'api-key': api_key,
            'Content-Type': 'application/json'
        }

    def _request(self, method: str, endpoint: str, json: dict = None) -> Any:
        url = f'{self.BASE_URL}{endpoint}'
        response = requests.request(method, url, headers=self.headers, json=json)
        response.raise_for_status()
        return response.json()

    def list_rows(self) -> List[Dict]:
        """List all rows in the table."""
        return self._request('GET', f'/rowlist/{self.stack_id}/{self.table_id}')

    def create_rows(self, fields: Union[Dict, List[Dict]]) -> List[Dict]:
        """
        Create one or more rows.

        IMPORTANT: The API uses "field" (singular), NOT "fields" (plural).
        """
        if isinstance(fields, dict):
            fields = [fields]

        records = [{'field': f} for f in fields]

        return self._request(
            'POST',
            f'/rowcreate/{self.stack_id}/{self.table_id}',
            {'records': records}
        )

    def update_rows(self, updates: Union[Dict, List[Dict]]) -> List[Dict]:
        """
        Update one or more rows.

        Args:
            updates: {'id': 'rowId', 'fields': {...}} or list of updates
        """
        if isinstance(updates, dict):
            updates = [updates]

        records = [{'id': u['id'], 'field': u['fields']} for u in updates]

        return self._request(
            'PATCH',
            f'/rowupdate/{self.stack_id}/{self.table_id}',
            {'records': records}
        )

    def delete_rows(self, row_ids: Union[str, List[str]]) -> Dict:
        """
        Delete one or more rows.

        Note: Row IDs are passed as query parameters, not in the body.
        """
        if isinstance(row_ids, str):
            row_ids = [row_ids]

        query_string = '&'.join([f'rowIds[]={rid}' for rid in row_ids])
        url = f'{self.BASE_URL}/rowdelete/{self.stack_id}/{self.table_id}?{query_string}'

        response = requests.delete(url, headers={'api-key': self.api_key})
        response.raise_for_status()
        return response.json()


def main():
    """Example usage."""
    client = StackbyClient(
        api_key=os.environ['STACKBY_API_KEY'],
        stack_id=os.environ['STACKBY_STACK_ID'],
        table_id=os.environ['STACKBY_TABLE_ID']
    )

    # List rows
    rows = client.list_rows()
    print(f'Existing rows: {len(rows)}')

    # Create a row
    new_row = client.create_rows({
        'Name': 'Test User',
        'Email': 'test@example.com'
    })
    print(f'Created: {new_row[0]["id"]}')

    # Update the row
    client.update_rows({
        'id': new_row[0]['id'],
        'fields': {'Name': 'Updated User'}
    })
    print('Updated')

    # Delete the row
    client.delete_rows(new_row[0]['id'])
    print('Deleted')


if __name__ == '__main__':
    main()
