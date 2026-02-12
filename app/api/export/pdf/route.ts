import { NextRequest } from "next/server";
import { proposalSchema } from "@/lib/schema";
import { generatePdf } from "@/lib/exportPdf";

export async function POST(req: NextRequest) {
  const parsed = proposalSchema.parse(await req.json());
  const pdf = await generatePdf(parsed);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${parsed.document_meta.proposal_id}.pdf"`
    }
  });
}
