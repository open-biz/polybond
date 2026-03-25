import ows
try:
    # Just try to call a simple function to verify the library is working
    wallets = ows.list_wallets()
    print(f"OpenWallet SDK initialized. Found {len(wallets)} wallets.")
except Exception as e:
    print(f"OpenWallet SDK error: {e}")
