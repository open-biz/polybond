import requests
import os
import json
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from .config import Config

class UMAClient:
    def __init__(self):
        self.transport = RequestsHTTPTransport(url=Config.UMA_SUBGRAPH_URL, verify=True, retries=3)
        self.client = Client(transport=self.transport, fetch_schema_from_transport=False)

    def get_disputed_markets(self):
        # Using assertions as per UMA v3 docs (Polymarket uses v3)
        query = gql("""
        {
          assertions(where: {disputer_not: null}, orderBy: assertionTimestamp, orderDirection: desc, first: 10) {
            id
            assertionId
            claim
            asserter
            disputer
            currency
            bond
            assertionTimestamp
            expirationTimestamp
            settled
            settlementResolution
          }
        }
        """)
        try:
            result = self.client.execute(query)
            return result.get('assertions', [])
        except Exception as e:
            print(f"Subgraph query failed, using mock data: {e}")
            # Fallback to mock data for development
            mock_file = "public/data/disputes.json"
            if os.path.exists(mock_file):
                with open(mock_file, 'r') as f:
                    return json.load(f)
            return []

if __name__ == "__main__":
    # Test
    client = UMAClient()
    disputes = client.get_disputed_markets()
    print(f"Found {len(disputes)} disputed markets")
    for d in disputes:
        print(d)
