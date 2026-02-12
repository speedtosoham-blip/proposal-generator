import { PDFDocument, StandardFonts } from "pdf-lib";
import { ProposalInput } from "./schema";
import { compileProposal } from "./compileProposal";

export async function generatePdf(input: ProposalInput): Promise<Buffer> {
  const doc = await PDFDocument.create();
  let page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let y = 760;
  const line = (text: string, size = 11) => {
    if (y < 40) {
      page = doc.addPage([612, 792]);
      y = 760;
    }
    page.drawText(text.slice(0, 108), { x: 40, y, size, font });
    y -= size + 5;
  };

  const rendered = compileProposal(input);
  line("Conn Architectural Proposal", 16);
  line(`Date: ${input.document_meta.date}   Proposal ID: ${input.document_meta.proposal_id}`);
  y -= 6;
  rendered.sections.forEach((s) => {
    line(s.heading, 13);
    s.paragraphs.forEach((p) => line(p));
    (s.bullets ?? []).forEach((b) => line(`• ${b}`));
    y -= 4;
  });
  line("Fee Schedule", 13);
  rendered.feeRows.forEach((r) => line(`${r.label}: ${r.value}`));
  line("Reimbursables", 13);
  rendered.reimbursableRows.forEach((r) => line(`${r.item}: ${r.rate}`));

  return Buffer.from(await doc.save());
}
