import requests
import json
from .config import Config

class LLMClient:
    def __init__(self):
        self.api_key = Config.NVIDIA_API_KEY
        self.base_url = Config.NVIDIA_BASE_URL
        self.model = Config.LLM_MODEL

    def analyze_dispute(self, dispute_data, market_data, macro_context):
        prompt = f"""
        Analyze this Polymarket/UMA dispute for the PolyBond agent.
        
        UMA Dispute Data:
        {json.dumps(dispute_data, indent=2)}
        
        Polymarket Market Data:
        {json.dumps(market_data, indent=2)}
        
        UMA Status: {market_data.get('uma_resolution_status')}
        Proposed Price: {market_data.get('uma_proposed_price')}
        
        Macro Context:
        {json.dumps(macro_context.get('macro', {}), indent=2)}
        
        Available Portfolio Balance: ${macro_context.get('portfolio_balance', 500)}
        
        The goal is to determine if the dispute is frivolous and if buying the $1.00 shares at a discount is a profitable, low-risk strategy. 
        Ensure 'size' * 'price' DOES NOT exceed the Available Portfolio Balance.
        
        Respond ONLY with a JSON object. No other text.
        Structure:
        {{
          "decision": "EXECUTE" or "ABSTAIN",
          "reason": "brief explanation",
          "token_id": "the ID of the shares to buy (if decision is EXECUTE)",
          "price": 0.97,
          "size": 100
        }}
        """

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are the PolyBond autonomous agent. You are a senior DeFi arbitrageur specializing in UMA spite disputes. You return only JSON results."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 1024
        }

        try:
            response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            raw_content = response.json()["choices"][0]["message"]["content"]
            
            # Extract JSON from markdown code block if present
            content = raw_content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
                
            return json.loads(content)
        except Exception as e:
            print(f"Error calling LLM: {e}")
            if 'response' in locals() and response.status_code == 404:
                print(f"Check if model '{self.model}' is correct for endpoint '{self.base_url}'")
            return {"decision": "ABSTAIN", "reason": f"LLM Error: {str(e)}"}
