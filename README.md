# DeblokAI

deblok ai

## Deploy Guide:
1. Copy `.env.example`, rename it to `.env` and modify it with your OpenAI URL Base (optional, only needed for custom api) and your API key
2. Build tailwind using `bun run buildonce`
3. Run DeblokAI using `bun run start`

- If you get any `Segmentation fault` errors, downgrade to Bun version `v1.0.18` using [`bum`](https://github.com/owenizedd/bum)
- DeblokAI cannot be deployed to a service like Vercel due to the requirement of Bun. Selfhost or use [Segfault](https://www.thc.org/segfault/) (24/7 hosting as long as you log in every 5 days) to host.
