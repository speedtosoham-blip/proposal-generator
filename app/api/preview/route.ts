import { NextRequest } from "next/server";
import { proposalSchema } from "@/lib/schema";
import { asHtml } from "@/lib/compileProposal";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = proposalSchema.parse(json);
  return new Response(asHtml(parsed), { headers: { "Content-Type": "text/html" } });
}
