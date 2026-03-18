---
To: contact@pythdataassociation.com
CC: dev@sharematch.me
Subject: Feed Request: CME ZS Soybean Futures (Agricultural Commodity)
Status: READY TO SEND (Gmail workspace auth not configured)
---

Hi Pyth Data Association Team,

I'm Will from ClearMarket Labs, a Solana-native commodity exchange focused on agricultural forward funding. We're writing to request the addition of CME ZS (Soybean Futures) to Pyth's price feed roster.

Context:
- Pyth already publishes corn futures (ZC) across multiple expiries (COH6/USD, COK6/USD, etc.) and raw sugar futures, so the CME agricultural data pipeline already exists.
- Soybeans are the world's most traded agricultural commodity by volume, with CME ZS doing ~250k contracts/day.
- We've built a SOY-USDC trading pair on our exchange and currently use a custom Switchboard-style oracle pulling from FRED/USDA and World Bank data as a bridge, but we'd strongly prefer Pyth's sub-second pull oracle for production use.

Requested feeds:
- ZSN6/USD (Soybeans Jul 2026)
- ZSQ6/USD (Soybeans Aug 2026)
- ZSX6/USD (Soybeans Nov 2026)
- ZSF7/USD (Soybeans Jan 2027)

These mirror the contract month pattern you already use for corn (COH6, COK6, CON6, etc.).

We're also planning to expand into other agricultural commodities (coffee, cocoa, wheat) and would be happy to discuss a broader partnership on agricultural price feeds.

Happy to jump on a call or provide more detail on our integration needs.

Best regards,
Will
ClearMarket Labs
dev@sharematch.me
https://clearmarket.app
