# MBTI

MBTI is an onchain agent identity and life-record MVP.

## Approved MVP Baseline

- Execution chain: Avalanche L1 testnet
- Product repo: `https://github.com/yyyljy/MBTI.git`
- Restricted and private data: app-managed Postgres
- Onchain data: public-safe, minimal, versioned commitments only

## First MVP Surfaces

1. Agent creation
2. Agent profile
3. Privacy and permissions
4. Activity composer
5. Life-history timeline
6. Change log and provenance inspector

## First Vertical Slice

`create agent -> view profile -> change privacy defaults`

## Immediate Technical Constraints

- Do not expose restricted/private fields in plaintext onchain.
- Treat activity history as append-only. Corrections must be new events.
- Keep RPC and other operational endpoints in server-side configuration only.

## Status

This repository has been initialized for MVP execution kickoff. The next step is to populate the first runnable slice in this workspace.
