# Farcaster Mini-App Wallet Setup

## Generated Custody Wallet Information

**Wallet Address**: `0x5E2fF0996ED169cAb47Ac26967Fcb6C30c74adc1`  
**Derivation Path**: `m/44'/60'/0'/0/0` (Standard Ethereum)  
**Generated From**: Farcaster recovery phrase using viem with explicit derivation path

## Verification Steps

1. Open **Warpcast app**
2. Go to **Settings → Advanced → Custody Account**
3. Verify the address matches: `0x5E2fF0996ED169cAb47Ac26967Fcb6C30c74adc1`

## Next Steps for Mini-App Registration

1. **Connect Wallet**: Use address `0x5E2fF0996ED169cAb47Ac26967Fcb6C30c74adc1`
2. **Enter Domain**: Your app domain (e.g., `edumate-app.vercel.app`)
3. **Sign Manifest**: This will generate:
   - `FARCASTER_HEADER`
   - `FARCASTER_PAYLOAD` 
   - `FARCASTER_SIGNATURE`
4. **Update .env**: Add the generated signatures to your environment variables

## Environment Variables Template

```env
# Your custody wallet address
CUSTODY_WALLET_ADDRESS=0x5E2fF0996ED169cAb47Ac26967Fcb6C30c74adc1

# Mini-App Manifest Signatures (fill after signing)
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=

# Account Association (used in utils.ts)
ACCOUNT_ASSOCIATION_HEADER=
ACCOUNT_ASSOCIATION_PAYLOAD=
ACCOUNT_ASSOCIATION_SIGNATURE=

# Optional API Keys
NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_cdp_api_key_here
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEYNAR_API_KEY=your_neynar_api_key
KV_REST_API_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_redis_token
```

## Security Notes

- ✅ Custody wallet generated with correct derivation path
- ✅ Recovery phrase not stored in repository
- ⚠️ Never commit `.env` file to version control
- ⚠️ Keep recovery phrase secure and private
