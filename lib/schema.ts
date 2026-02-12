import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const proposalSchema = z.object({
  template_id: z.literal("conn_arch_proposal"),
  document_meta: z.object({
    date: isoDate,
    project_number: z.string(),
    proposal_id: z.string()
  }),
  parties: z.object({
    from_firm: z.object({
      name: z.literal("Conn + Architects"),
      address: z.string(),
      phone: z.string(),
      email: z.string().email(),
      license: z.string()
    }),
    to_client: z.object({
      contact_name: z.string(),
      title: z.string(),
      company: z.string(),
      address: z.string()
    })
  }),
  project: z.object({
    project_name: z.string(),
    location: z.string(),
    description_paragraphs: z.array(z.string()).default([]),
    buildings: z.array(
      z.object({
        name: z.string(),
        stories: z.number().int().nonnegative(),
        area_sf: z.number().nonnegative(),
        notes: z.string()
      })
    ).default([])
  }),
  scope: z.object({
    sections: z.array(z.object({ heading: z.string(), bullets: z.array(z.string()) }))
  }),
  deliverables: z.array(z.string()),
  exclusions: z.array(z.string()),
  additional_services: z.array(z.string()),
  timeline: z.array(z.object({ label: z.string(), date: isoDate, duration_text: z.string() })),
  fees: z.object({
    currency: z.literal("USD"),
    fee_type: z.string(),
    total: z.number().nonnegative(),
    phase_breakdown: z.array(z.object({ phase: z.string(), percent: z.number(), amount: z.number() })),
    milestones: z.array(z.object({ milestone: z.string(), amount: z.number() })),
    hourly_rates: z.array(z.object({ role: z.string(), rate: z.number() })),
    invoicing_terms: z.object({
      due_days: z.number().int().positive(),
      interest_apr: z.number().nonnegative(),
      notes: z.string()
    })
  }),
  reimbursables: z.array(z.object({ item: z.string(), rate_text: z.string() })),
  legal: z.object({
    governing_law_state: z.string(),
    venue: z.string(),
    include_558_0035_corporate_protection: z.boolean().default(true),
    liability_cap: z.object({
      enabled: z.boolean().default(true),
      cap_amount: z.number().nonnegative(),
      cap_basis: z.enum(["cap_amount", "fee_multiple", "insurance_proceeds"]) 
    }),
    termination: z.object({ enabled: z.boolean().default(true), notice_days: z.number().int().positive() }),
    proposal_void_after_days: z.number().int().positive(),
    aia_reference: z.object({ enabled: z.boolean().default(false), doc: z.string() })
  }),
  signature_blocks: z.array(
    z.object({ label: z.string(), name_line: z.boolean(), date_line: z.boolean(), title_line: z.boolean() })
  )
});

export type ProposalInput = z.infer<typeof proposalSchema>;
