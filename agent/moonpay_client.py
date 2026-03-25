import mcp
import asyncio
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp import ClientSession

class MoonPayClient:
    def __init__(self, command="moonpay-mcp"):
        # The command to start the MoonPay MCP server
        self.server_params = StdioServerParameters(command=command)

    async def get_macro_context(self):
        """
        Fetches macroeconomic context from MoonPay MCP.
        In a hackathon setting, if the server isn't running, we return fallback data.
        """
        try:
            # Attempt to connect to the real MCP server
            async with stdio_client(self.server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    
                    # Call MoonPay tools (conceptual tool names)
                    usdc_price = await session.call_tool("get_crypto_price", {"symbol": "USDC"})
                    matic_price = await session.call_tool("get_crypto_price", {"symbol": "MATIC"})
                    
                    return {
                        "prices": {
                            "USDC": usdc_price,
                            "MATIC": matic_price
                        },
                        "source": "MoonPay MCP"
                    }
        except Exception as e:
            # Fallback for demonstration
            return {
                "prices": {"USDC": 1.0, "MATIC": 0.85},
                "market_info": "UMA disputes are resolving typically in 2-4 days.",
                "source": "Mock (MCP Connection Failed)"
            }

    async def call_mcp_tool(self, tool_name, arguments):
        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                result = await session.call_tool(tool_name, arguments)
                return result
