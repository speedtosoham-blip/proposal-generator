import fs from "node:fs";
import path from "node:path";
import { proposalSchema } from "../lib/schema";
import { asHtml } from "../lib/compileProposal";

const sampleFiles = [
  "samples/1-small-renovation.json",
  "samples/2-new-construction.json",
  "samples/3-cap-off-aia-on.json"
];

for (const file of sampleFiles) {
  const raw = fs.readFileSync(path.resolve(file), "utf-8");
  const parsed = proposalSchema.parse(JSON.parse(raw));
  const html = asHtml(parsed);

  const required = ["Fee Schedule", "Exclusions", "Reimbursables", "void if not accepted"];
  required.forEach((token) => {
    if (!html.includes(token)) throw new Error(`${file} missing ${token}`);
  });

  if (parsed.legal.include_558_0035_corporate_protection && !html.includes("558.0035")) {
    throw new Error(`${file} missing 558.0035 clause`);
  }
  if (parsed.legal.liability_cap.enabled && !html.includes("total liability")) {
    throw new Error(`${file} missing limitation of liability`);
  }
  if (!parsed.legal.liability_cap.enabled && html.includes("{{CAP_LOGIC}}")) {
    throw new Error(`${file} unresolved placeholders`);
  }

  if (html.includes("{{")) throw new Error(`${file} unresolved placeholder token`);
}

console.log("Acceptance checks passed for 3 Conn proposal samples.");
