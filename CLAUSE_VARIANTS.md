# Adding a New Clause Variant (Conn Template)

1. Open `templates/connClauses.ts` and add a new exact-text clause block copied from Binder1.pdf.
2. Keep legal language verbatim; only add replacement tokens like `{{NOTICE_DAYS}}` where Binder language uses variable values.
3. Add any new toggle or parameter to `lib/schema.ts`.
4. Insert the clause conditionally in `lib/compileProposal.ts`.
5. Add coverage in `tests/acceptance.test.ts` and optionally a new sample JSON under `samples/`.

> This project is intentionally single-template: `conn_arch_proposal`.
