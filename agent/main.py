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

class PolyBondAgent:
    def __init__(self):
        self.uma = UMAClient()
        self.poly = PolyClient()
        self.llm = LLMClient()
        self.ow = OpenWalletClient()
        self.moonpay = MoonPayClient()
        
        # Paths for metrics sync
        self.stats_file = "public/data/global-stats.json"
        self.portfolio_file = "public/data/portfolio.json"

    async def run_cycle(self):
        print("--- Cycle Start ---")
        
        # Load portfolio for budget
        balance = 500.0
        if os.path.exists(self.portfolio_file):
            try:
                with open(self.portfolio_file, 'r') as f:
                    balance = json.load(f).get("balance", 500.0)
            except: pass
            
        # Phase A: Discovery & Reasoning
        disputes = self.uma.get_disputed_markets()
        print(f"Discovered {len(disputes)} disputes")
        
        for dispute in disputes:
            # Map to Polymarket
            identifier = dispute.get('identifier', dispute.get('slug'))
            market = self.poly.get_market_by_uma_identifier(identifier)
            
            # Fetch Context
            macro = await self.moonpay.get_macro_context()
            
            # AI Decision - now with balance/budget context
            context = {
                "macro": macro,
                "portfolio_balance": balance
            }
            decision = self.llm.analyze_dispute(dispute, market, context)
            print(f"LLM Decision: {decision.get('decision')} | Reason: {decision.get('reason')}")
            
            if decision.get('decision') == 'EXECUTE':
                # Phase B: Secure Execution
                token_id = decision.get('token_id', "mock-token")
                price = decision.get('price', 0.99)
                size = decision.get('size', 10)
                
                print(f"EXECUTING: Buy {size} shares of {token_id} at price {price}")
                # Build payload for OpenWallet
                # payload = self.poly.create_order_payload(token_id, price, size)
                # signature = self.ow.sign_polymarket_order(payload)
                # print(f"Obtained OpenWallet signature: {signature[:10]}...")
                
                # result = self.poly.submit_signed_order(...)
                print("Trade successfully submitted to CLOB (Simulation)")
        
        # Phase D: State Sync
        self.sync_metrics()
        print("--- Cycle End ---")

    def sync_metrics(self):
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
            portfolio["yieldEarned"] = portfolio.get("yieldEarned", 0) + 0.05
            portfolio["apr"] = 297
            portfolio["daysActive"] = portfolio.get("daysActive", 0) + 1
            
            with open(self.portfolio_file, 'w') as f:
                json.dump(portfolio, f, indent=2)
                
            print(f"Synced metrics to {self.stats_file} and {self.portfolio_file}")
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
