import { ProposalInput } from "./schema";
import { connClauses } from "@/templates/connClauses";

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const liabilityText = (input: ProposalInput) => {
  const { cap_amount, cap_basis } = input.legal.liability_cap;
  if (cap_basis === "cap_amount") return money(cap_amount);
  if (cap_basis === "fee_multiple") return `${cap_amount}x total compensation paid to Conn + Architects`;
  return "available insurance proceeds";
};

export type RenderedProposal = {
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  feeRows: { label: string; value: string }[];
  reimbursableRows: { item: string; rate: string }[];
};

export function compileProposal(input: ProposalInput): RenderedProposal {
  const legalParas = [];
  if (input.legal.include_558_0035_corporate_protection) {
    legalParas.push(connClauses.statute558_0035);
  }
  if (input.legal.liability_cap.enabled) {
    legalParas.push(connClauses.limitationOfLiability.replace("{{CAP_LOGIC}}", liabilityText(input)));
  }
  legalParas.push(
    connClauses.paymentTerms
      .replace("{{DUE_DAYS}}", String(input.fees.invoicing_terms.due_days))
      .replace("{{APR}}", String(input.fees.invoicing_terms.interest_apr))
  );
  if (input.legal.termination.enabled) {
    legalParas.push(connClauses.termination.replace("{{NOTICE_DAYS}}", String(input.legal.termination.notice_days)));
  }
  legalParas.push(connClauses.validity.replace("{{VOID_DAYS}}", String(input.legal.proposal_void_after_days)));
  if (input.legal.aia_reference.enabled) {
    legalParas.push(connClauses.aiaReference.replace("{{AIA_DOC}}", input.legal.aia_reference.doc));
  }

  return {
    sections: [
      {
        heading: "Addressee",
        paragraphs: [
          `${input.parties.to_client.contact_name}, ${input.parties.to_client.title}`,
          input.parties.to_client.company,
          input.parties.to_client.address
        ]
      },
      { heading: "Project Overview", paragraphs: input.project.description_paragraphs },
      ...input.scope.sections.map((s) => ({ heading: s.heading, paragraphs: [], bullets: s.bullets })),
      { heading: "Deliverables", paragraphs: [], bullets: input.deliverables },
      { heading: "Exclusions", paragraphs: [], bullets: input.exclusions },
      { heading: "Additional Services", paragraphs: [], bullets: input.additional_services },
      {
        heading: "Schedule",
        paragraphs: input.timeline.map((t) => `${t.label}: ${t.date} (${t.duration_text})`)
      },
      { heading: connClauses.generalTermsHeading, paragraphs: legalParas }
    ],
    feeRows: [
      { label: "Fee Type", value: input.fees.fee_type },
      { label: "Total Fee", value: money(input.fees.total) },
      ...input.fees.phase_breakdown.map((p) => ({
        label: `${p.phase} (${p.percent}%)`,
        value: money(p.amount)
      })),
      ...input.fees.milestones.map((m) => ({ label: `Milestone: ${m.milestone}`, value: money(m.amount) }))
    ],
    reimbursableRows: input.reimbursables.map((r) => ({ item: r.item, rate: r.rate_text }))
  };
}

export function asHtml(input: ProposalInput): string {
  const rendered = compileProposal(input);
  const sectionHtml = rendered.sections
    .map((s) => {
      const para = s.paragraphs.map((p) => `<p>${p}</p>`).join("");
      const bullets = (s.bullets ?? []).map((b) => `<li>${b}</li>`).join("");
      return `<section><h2>${s.heading}</h2>${para}${bullets ? `<ul>${bullets}</ul>` : ""}</section>`;
    })
    .join("\n");

  const feeRows = rendered.feeRows.map((r) => `<tr><td>${r.label}</td><td>${r.value}</td></tr>`).join("");
  const reimbRows = rendered.reimbursableRows.map((r) => `<tr><td>${r.item}</td><td>${r.rate}</td></tr>`).join("");
  const signatures = input.signature_blocks
    .map((s) => `<div><strong>${s.label}</strong><p>_________________________</p><p>Name</p><p>Title</p><p>Date</p></div>`)
    .join("");

  return `<!doctype html><html><head><style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #111; }
  h1 { font-size: 22px; }
  h2 { font-size: 16px; margin-top: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  td, th { border: 1px solid #999; padding: 6px; }
  ul { margin-left: 24px; }
  .sig { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
  </style></head><body>
  <h1>Conn Architectural Proposal</h1>
  <p>Date: ${input.document_meta.date} | Proposal ID: ${input.document_meta.proposal_id} | Project #: ${input.document_meta.project_number}</p>
  <p>From: Conn + Architects</p>
  ${sectionHtml}
  <h2>Fee Schedule</h2>
  <table><thead><tr><th>Item</th><th>Value</th></tr></thead><tbody>${feeRows}</tbody></table>
  <h2>Reimbursables</h2>
  <table><thead><tr><th>Item</th><th>Rate / Cost</th></tr></thead><tbody>${reimbRows}</tbody></table>
  <div class="sig">${signatures}</div>
  </body></html>`;
}
