from agent.main import PolyBondAgent
import asyncio

async def test_run():
    agent = PolyBondAgent()
    await agent.run_cycle()

if __name__ == "__main__":
    asyncio.run(test_run())
