import { ProposalInput } from "@/lib/schema";

export const defaultProposal: ProposalInput = {
  template_id: "conn_arch_proposal",
  document_meta: { date: "2026-02-12", project_number: "CA-001", proposal_id: "PROP-001" },
  parties: {
    from_firm: {
      name: "Conn + Architects",
      address: "123 Main Street, Tallahassee, FL",
      phone: "850-555-0100",
      email: "info@connarchitects.com",
      license: "AA26000000"
    },
    to_client: {
      contact_name: "Jordan Client",
      title: "Owner",
      company: "Client Co",
      address: "456 Client Ave, Tallahassee, FL"
    }
  },
  project: {
    project_name: "Sample Project",
    location: "Tallahassee, FL",
    description_paragraphs: ["Conn + Architects proposes architectural services for the referenced project."],
    buildings: [{ name: "Main Building", stories: 1, area_sf: 2400, notes: "Renovation scope" }]
  },
  scope: {
    sections: [
      { heading: "Schematic Design", bullets: ["Develop concept options", "Prepare schematic plan drawings"] },
      { heading: "Design Development", bullets: ["Develop selected concept"] },
      { heading: "Construction Documents", bullets: ["Prepare permit and bid documents"] },
      { heading: "Permitting", bullets: ["Submit package to AHJ"] },
      { heading: "Bidding or Negotiation", bullets: ["Respond to bidder questions"] },
      { heading: "Construction Administration", bullets: ["Review submittals and RFIs"] }
    ]
  },
  deliverables: ["PDF drawing set", "Fee proposal narrative"],
  exclusions: ["Civil engineering", "Hazardous material testing"],
  additional_services: ["3D renderings", "Interior design beyond listed scope"],
  timeline: [{ label: "Kickoff", date: "2026-03-01", duration_text: "Week 1" }],
  fees: {
    currency: "USD",
    fee_type: "lump_sum",
    total: 50000,
    phase_breakdown: [{ phase: "Schematic Design", percent: 25, amount: 12500 }],
    milestones: [{ milestone: "35% Design", amount: 17500 }],
    hourly_rates: [{ role: "Principal", rate: 225 }],
    invoicing_terms: { due_days: 30, interest_apr: 12, notes: "Monthly invoices" }
  },
  reimbursables: [
    { item: "Mileage", rate_text: "$0.67/mile" },
    { item: "Printing", rate_text: "At cost + 10%" }
  ],
  legal: {
    governing_law_state: "Florida",
    venue: "Leon County, Florida",
    include_558_0035_corporate_protection: true,
    liability_cap: { enabled: true, cap_amount: 50000, cap_basis: "cap_amount" },
    termination: { enabled: true, notice_days: 15 },
    proposal_void_after_days: 60,
    aia_reference: { enabled: false, doc: "B103-2017" }
  },
  signature_blocks: [{ label: "Accepted By", name_line: true, title_line: true, date_line: true }]
};
