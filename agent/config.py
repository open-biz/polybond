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
    UMA_SUBGRAPH_URL = "https://api.goldsky.com/api/public/project_clus2fndawbcc01w31192938i/subgraphs/polygon-optimistic-oracle-v3/1.0.0/gn" 
    
    # NVIDIA API
    NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
    LLM_MODEL = "qwen/qwen3.5-122b-a10b" # Corrected name
    
    # Polymarket CLOB
    CLOB_API_URL = "https://clob.polymarket.com"
    CHAIN_ID = 137 # Polygon
