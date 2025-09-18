# Lead Intent Scorer

## What
A backend service that accepts a product/offer and CSV of leads, scores leads (0–100) using a rules layer and AI layer, and returns intent labels (High/Medium/Low) with explanations.

## Quick start (local)
1. Clone repo
2. `npm install`
3. Set environment variable:
   - `OPENAI_API_KEY` (required to enable AI; otherwise AI defaults to Medium)
   - `OPENAI_MODEL` optional (default `gpt-4o-mini` in code)
4. `npm start` (or `npm run dev`)

## Endpoints
- `POST /offer` — JSON body `{ name, value_props: [], ideal_use_cases: [] }`
  - Example:
    ```
    curl -X POST http://localhost:3000/offer -H "Content-Type: application/json" -d '{"name":"AI Outreach Automation","value_props":["24/7 outreach","6x more meetings"],"ideal_use_cases":["B2B SaaS mid-market"]}'
    ```

- `POST /leads/upload` — multipart/form-data with `file` field (CSV)
  - Example:
    ```
    curl -F "file=@leads.csv" http://localhost:3000/leads/upload
    ```

- `POST /score` — runs scoring on uploaded leads (calls AI) and stores results
  - Example:
    ```
    curl -X POST http://localhost:3000/score
    ```

- `GET /score/results` — returns JSON array of scored leads

- `GET /score/export/csv` — optional CSV export

## Rule logic & prompt
(See `src/services/rules.js` and `src/services/aiClient.js`)

## Tests
`npm test` (Jest) — includes unit tests for rule layer.

## Deployment
- Containerize with provided `Dockerfile` (or follow Heroku/Railway/Render docs)
- Provide `OPENAI_API_KEY` as secret
- For production, replace in-memory store with persistent DB

