import time
import asyncio
import json
import os
from .config import Config
from .uma_client import UMAClient
from .polymarket_client import PolyClient
from .llm_client import LLMClient
from .openwallet_client import OpenWalletClient
from .moonpay_client import MoonPayClient

from .blockchain_client import BlockchainClient

class PolyBondAgent:
    def __init__(self):
        self.uma = UMAClient()
        self.poly = PolyClient()
        self.llm = LLMClient()
        self.ow = OpenWalletClient()
        self.moonpay = MoonPayClient()
        self.eth = BlockchainClient()
        
        # Paths for metrics sync
        self.stats_file = "public/data/global-stats.json"
        self.portfolio_file = "public/data/portfolio.json"
        self.positions_file = "public/data/positions.json"

    async def run_cycle(self):
        print("--- Cycle Start ---")
        
        # Phase A: Discovery
        # UMAClient now returns full Polymarket market objects directly via Gamma API
        markets = self.uma.get_disputed_markets()
        print(f"Discovered {len(markets)} markets from Gamma API")
        
        # Phase B: Data Sync (Directly update frontend data files)
        self.sync_metrics([]) # No new trades for now
        self.sync_disputes(markets)
        
        print("--- Cycle End ---")

    def sync_disputes(self, markets):
        """
        Generates public/data/disputes.json for the frontend feed.
        """
        disputes_file = "public/data/disputes.json"
        os.makedirs(os.path.dirname(disputes_file), exist_ok=True)
        
        output = []
        for m in markets:
            status = m.get('umaResolutionStatus', m.get('uma_resolution_status', 'monitoring'))
            
            # Map Gamma status to frontend status
            fe_status = "monitoring"
            if status == "disputed": fe_status = "disputed"
            elif status == "proposed": fe_status = "bonding"
            
            output.append({
                "id": m.get('id'),
                "slug": m.get('slug'),
                "question": m.get('question'),
                "lockInPrice": f"${float(m.get('umaBond', 500)):,.0f} Bond",
                "status": fe_status,
                "timeAgo": "Live" # In a real app, calculate diff from updatedAt
            })
            
        # If no markets, add a monitoring entry
        if not output:
            output.append({
                "id": "none",
                "question": "Scanning for new UMA disputes...",
                "lockInPrice": "N/A",
                "status": "monitoring",
                "timeAgo": "Now"
            })

        with open(disputes_file, 'w') as f:
            json.dump(output, f, indent=2)
        print(f"Synced {len(output)} markets to {disputes_file}")

    def sync_metrics(self, new_positions=[]):
        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.stats_file), exist_ok=True)
        # Update JSON files for frontend
        try:
            # Load current stats if exists
            stats = {
                "baseYield": 297,
                "compoundedYield": 1850,
                "tvl": 500,
                "totalCycles": 12,
                "octantDonated": 5
            }
            if os.path.exists(self.stats_file):
                try:
                    with open(self.stats_file, 'r') as f:
                        stats = json.load(f)
                except:
                    pass
            
            # Mock update
            stats["totalCycles"] = stats.get("totalCycles", 0) + 1
            if new_positions:
                stats["tvl"] = stats.get("tvl", 500) + 10 # Simulate profit/growth
            
            with open(self.stats_file, 'w') as f:
                json.dump(stats, f, indent=2)
            
            # Update portfolio.json
            portfolio = {"balance": 500, "yieldEarned": 0, "apr": 297, "daysActive": 1}
            if os.path.exists(self.portfolio_file):
                try:
                    with open(self.portfolio_file, 'r') as f:
                        portfolio = json.load(f)
                except:
                    pass
            
            portfolio["balance"] = stats["tvl"]
            if new_positions:
                portfolio["yieldEarned"] = portfolio.get("yieldEarned", 0) + 0.05
            portfolio["apr"] = 297
            portfolio["daysActive"] = portfolio.get("daysActive", 0) + 1
            
            with open(self.portfolio_file, 'w') as f:
                json.dump(portfolio, f, indent=2)
                
            # Update positions.json
            positions = []
            if os.path.exists(self.positions_file):
                try:
                    with open(self.positions_file, 'r') as f:
                        positions = json.load(f)
                except: pass
            
            # Add new, limit to most recent 5
            positions = new_positions + positions
            positions = positions[:5]
            
            with open(self.positions_file, 'w') as f:
                json.dump(positions, f, indent=2)
                
            print(f"Synced metrics to {self.stats_file}, {self.portfolio_file}, and {self.positions_file}")
        except Exception as e:
            import traceback
            print(f"Error syncing metrics: {e}")
            traceback.print_exc()

    async def main_loop(self):
        while True:
            try:
                await self.run_cycle()
            except Exception as e:
                print(f"Main loop error: {e}")
            
            print("Sleeping for 5 minutes...")
            await asyncio.sleep(300)

if __name__ == "__main__":
    agent = PolyBondAgent()
    asyncio.run(agent.main_loop())
