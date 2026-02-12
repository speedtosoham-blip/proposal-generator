# Conn + Architects Proposal Generator

Single-template proposal generator for **Conn + Architects** with JSON-driven parameters, live HTML preview, DOCX export, and PDF export.

## Scope
- Template family: **Conn Architectural Proposal** only.
- No engineering templates.
- Clause library centered in `templates/connClauses.ts` and assembled by `lib/compileProposal.ts`.

## Features
1. Single template picker (fixed to Conn Architectural Proposal)
2. Form-based parameter entry with conditional legal toggles
3. Live HTML preview
4. Export `.docx`
5. Export `.pdf`
6. Save/Load JSON

## Canonical schema
Implemented in `lib/schema.ts` using Zod validation. `template_id` is constrained to `conn_arch_proposal` and firm name is constrained to `Conn + Architects`.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Test acceptance checks
```bash
npm test
```
This validates the 3 sample JSON payloads and checks required output content and unresolved placeholders.

## Sample inputs
- `samples/1-small-renovation.json`
- `samples/2-new-construction.json`
- `samples/3-cap-off-aia-on.json`

## Binder language note
`Binder1.pdf` is the source of truth for legal/proposal language. Populate or refine `templates/connClauses.ts` with exact clause text from Binder as needed; toggles in `lib/compileProposal.ts` already support:
- Florida 558.0035 clause
- Limitation of liability with cap logic
- Payment terms
- Termination notice
- Proposal validity window
- Optional AIA reference

See `CLAUSE_VARIANTS.md` for extending clause variants.
