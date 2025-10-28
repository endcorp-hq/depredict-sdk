<p align="center">
  <img src="img/logomark.png" alt="DePredict" width="96" />
</p>

## DePredict SDK Template App

**A starter Next.js app to quickly spin up a DePredict-enabled frontend.**

### What’s inside

- **Next.js 15**: App Router, fast dev with Turbopack
- **Tailwind CSS 4 + Shadcn UI**: Modern styling and components
- **Wallet UI**: Prebuilt Solana wallet UI components
- **Gill SDK**: Solana client utilities
- **DePredict SDK**: Market creation and interaction helpers

## Quick start

### 1) Install dependencies

```bash
pnpm install
```

### 2) Run locally

```bash
pnpm dev
```

App runs on `http://localhost:3000`.

### 3) Deploy (e.g., Vercel)

- Push this repository to your own Git provider
- Import the repository in Vercel
- Set the environment variables (see below)
- Build command: `pnpm build`
- Output directory: `.next`

## Environment variables

Set these in your local `.env.local` and in your Vercel project settings.

- `NEXT_PUBLIC_RPC_ENDPOINT`: RPC (or DAS-compatible) endpoint used by on-chain reads
- `NEXT_PUBLIC_SOLANA_RPC_URL`: General Solana RPC URL for providers; you can use the same value as `NEXT_PUBLIC_RPC_ENDPOINT`
- `NEXT_PUBLIC_CREATOR_PUBLIC_ADMIN_KEY`: Market creator PDA/public key for this app instance
- `NEXT_PUBLIC_SHORTX_COLLECTION_ADDRESS`: Collection address created for your markets
- `NEXT_PUBLIC_CORE_COLLECTION_ID`: Core collection id (used by burn operations)

Tip: For development you can start with Devnet RPCs such as `https://api.devnet.solana.com`.

## Admin onboarding (/admin)

Once your site is live (or running locally):

1. Navigate to `/admin`
2. Connect your wallet
3. Run the Market Creator setup flow
   - This will create a `Collection NFT` and a `Merkle Tree` for storing cNFTs
4. The UI will surface the generated values you need to set as env vars:
   - `NEXT_PUBLIC_CREATOR_PUBLIC_ADMIN_KEY`
   - `NEXT_PUBLIC_SHORTX_COLLECTION_ADDRESS`
5. Add these to your environment (Vercel → Project → Settings → Environment Variables) and redeploy

After this, your app is ready to create and resolve markets with DePredict.

## Scripts

- **dev**: `pnpm dev` – Start the local dev server (Turbopack)
- **build**: `pnpm build` – Build for production
- **start**: `pnpm start` – Run the production server
- **lint**: `pnpm lint` – Lint the codebase
- **format**: `pnpm format` – Format with Prettier

## How it works (high-level)

- The Admin flow provisions a `Market Creator` account and on-chain storage:
  - A `Collection NFT` that represents your marketplace
  - A `Merkle Tree` that stores `cNFTs` representing user positions
- The app and hooks use your configured RPC to query and mutate on-chain state

## Support

If you run into issues, check your RPC settings and confirm the env vars are set correctly in both local and hosted environments. Then re-run the `/admin` flow if needed to regenerate values.