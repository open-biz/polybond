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
            # 1. Try fetching 'disputed' markets - Increase limit to get a better pool for filtering
            url = f"{self.base_url}/markets?uma_resolution_status=disputed&active=true&closed=false&limit=50"
            resp = requests.get(url)
            if resp.status_code == 200:
                markets = resp.json()
                if markets:
                    active_disputes = []
                    for m in markets:
                        prices_raw = m.get('outcomePrices', '[]')
                        is_resolved = False
                        
                        try:
                            prices = json.loads(prices_raw) if isinstance(prices_raw, str) else prices_raw
                            if prices == ["0", "1"] or prices == ["1", "0"] or prices == [0, 1] or prices == [1, 0]:
                                is_resolved = True
                        except: pass
                        
                        # Robustly check closed/active even if they are strings
                        closed_val = m.get('closed')
                        is_closed = str(closed_val).lower() == "true" if closed_val is not None else False
                        
                        active_val = m.get('active')
                        is_active = str(active_val).lower() == "true" if active_val is not None else True
                        
                        if not is_closed and is_active and not is_resolved:
                            active_disputes.append(m)

                    if active_disputes:
                        print(f"Found {len(active_disputes)} active disputed markets via Gamma API")
                        return active_disputes[:20] # Return max 20 for frontend

            # 2. Fallback to 'proposed' markets
            print("No 'disputed' markets found. Checking for 'proposed' markets...")
            url = f"{self.base_url}/markets?uma_resolution_status=proposed&active=true&closed=false&limit=50"
            resp = requests.get(url)
            if resp.status_code == 200:
                markets = resp.json()
                if markets:
                    active_proposed = []
                    for m in markets:
                        prices_raw = m.get('outcomePrices', '[]')
                        is_resolved = False
                        try:
                            prices = json.loads(prices_raw) if isinstance(prices_raw, str) else prices_raw
                            if prices == ["0", "1"] or prices == ["1", "0"] or prices == [0, 1] or prices == [1, 0]:
                                is_resolved = True
                        except: pass
                        
                        closed_val = m.get('closed')
                        is_closed = str(closed_val).lower() == "true" if closed_val is not None else False
                        
                        active_val = m.get('active')
                        is_active = str(active_val).lower() == "true" if active_val is not None else True
                        
                        if not is_closed and is_active and not is_resolved:
                            active_proposed.append(m)

                    if active_proposed:
                        print(f"Found {len(active_proposed)} active proposed markets via Gamma API")
                        return active_proposed[:20]

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
