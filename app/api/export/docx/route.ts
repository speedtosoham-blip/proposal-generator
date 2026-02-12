import { NextRequest } from "next/server";
import { proposalSchema } from "@/lib/schema";
import { generateDocx } from "@/lib/exportDocx";

export async function POST(req: NextRequest) {
  const parsed = proposalSchema.parse(await req.json());
  const docx = await generateDocx(parsed);
  return new Response(docx, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${parsed.document_meta.proposal_id}.docx"`
    }
  });
}
