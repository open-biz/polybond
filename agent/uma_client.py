import requests
from .config import Config

class UMAClient:
    def __init__(self):
        # Use Gamma API for directly finding disputed Polymarket markets
        self.base_url = "https://gamma-api.polymarket.com"

    def get_disputed_markets(self):
        """
        Fetches markets from Polymarket that are currently in a disputed state via UMA.
        """
        try:
            # 1. Try fetching 'disputed' markets
            url = f"{self.base_url}/markets?uma_resolution_status=disputed&active=true&limit=20"
            resp = requests.get(url)
            if resp.status_code == 200:
                markets = resp.json()
                if markets:
                    print(f"Found {len(markets)} disputed markets via Gamma API")
                    return markets

            # 2. Fallback to 'proposed' markets (arbitrage opportunities before they are disputed)
            print("No 'disputed' markets found. Checking for 'proposed' markets...")
            url = f"{self.base_url}/markets?uma_resolution_status=proposed&active=true&limit=20"
            resp = requests.get(url)
            if resp.status_code == 200:
                markets = resp.json()
                if markets:
                    print(f"Found {len(markets)} proposed markets via Gamma API")
                    return markets

            return []
        except Exception as e:
            print(f"Error fetching disputed markets from Gamma API: {e}")
            return []

if __name__ == "__main__":
    # Test
    client = UMAClient()
    disputes = client.get_disputed_markets()
    print(f"Found {len(disputes)} total opportunities")
    for d in disputes:
        print(f"ID: {d.get('id')}, Question: {d.get('question')}, Status: {d.get('uma_resolution_status')}")
