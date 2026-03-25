from agent.uma_client import UMAClient
from gql import gql
import asyncio

async def test():
    client = UMAClient()
    # Simple check if alive
    print(f"Testing UMA Client with URL: {client.transport.url}")
    
    disputes = client.get_disputed_markets()
    print(f"Found {len(disputes)} disputed markets")
    for d in disputes:
        # Be flexible with keys (mock vs subgraph)
        id_val = d.get('id', 'N/A')
        identifier = d.get('identifier', d.get('slug', 'N/A'))
        print(f"ID: {id_val}, Identifier/Slug: {identifier}")

if __name__ == "__main__":
    asyncio.run(test())
