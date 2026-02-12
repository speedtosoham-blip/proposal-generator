import { NextRequest } from "next/server";
import { proposalSchema } from "@/lib/schema";
import { generateDocx } from "@/lib/exportDocx";

export async function POST(req: NextRequest) {
  const parsed = proposalSchema.parse(await req.json());
  const docx = await generateDocx(parsed);
 const bytes = docx instanceof Buffer ? new Uint8Array(docx) : docx;

return new Response(bytes, {
  headers: {
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition": `attachment; filename="${parsed.document_meta.proposal_id}.docx"`,
  },
});
