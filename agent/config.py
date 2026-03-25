import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "mock-nv-key")
    POLYMARKET_API_KEY = os.getenv("POLYMARKET_API_KEY", "mock-poly-key")
    POLYMARKET_SECRET = os.getenv("POLYMARKET_SECRET", "mock-poly-secret")
    POLYMARKET_PASSPHRASE = os.getenv("POLYMARKET_PASSPHRASE", "mock-poly-passphrase")
    
    # OpenWallet configuration
    OWS_PASSPHRASE = os.getenv("OWS_PASSPHRASE", "mock-ows-passphrase")
    
    # UMA Subgraph (OOV3)
    UMA_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/uma-protocol/polygon-optimistic-oracle-v3" 
    
    # NVIDIA API
    NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
    LLM_MODEL = "qwen/qwen3.5-122b-a10b" # Corrected name
    
    # Polymarket CLOB
    CLOB_API_URL = "https://clob.polymarket.com"
    CHAIN_ID = 137 # Polygon
    
    # Base Network (Execution)
    BASE_RPC_URL = os.getenv("BASE_RPC_URL", "https://mainnet.base.org")
    POLYBOND_POOL_ADDRESS = os.getenv("POLYBOND_POOL_ADDRESS", "0xcc74a337623cfbdb85842d95712c3630181696f4")
    AGENT_PRIVATE_KEY = os.getenv("AGENT_PRIVATE_KEY", "") # Used for contract calls if not via OpenWallet
