import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel, WidthType } from "docx";
import { ProposalInput } from "./schema";
import { compileProposal } from "./compileProposal";

export async function generateDocx(input: ProposalInput): Promise<Buffer> {
  const rendered = compileProposal(input);
  const children: (Paragraph | Table)[] = [];

  children.push(new Paragraph({ text: "Conn Architectural Proposal", heading: HeadingLevel.HEADING_1 }));
  children.push(
    new Paragraph({
      children: [new TextRun(`Date: ${input.document_meta.date} | Proposal ID: ${input.document_meta.proposal_id}`)]
    })
  );

  rendered.sections.forEach((s) => {
    children.push(new Paragraph({ text: s.heading, heading: HeadingLevel.HEADING_2 }));
    s.paragraphs.forEach((p) => children.push(new Paragraph(p)));
    (s.bullets ?? []).forEach((b) => children.push(new Paragraph({ text: b, bullet: { level: 0 } })));
  });

  children.push(new Paragraph({ text: "Fee Schedule", heading: HeadingLevel.HEADING_2 }));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [new TableCell({ children: [new Paragraph("Item")] }), new TableCell({ children: [new Paragraph("Value")] })] }),
        ...rendered.feeRows.map((r) =>
          new TableRow({ children: [new TableCell({ children: [new Paragraph(r.label)] }), new TableCell({ children: [new Paragraph(r.value)] })] })
        )
      ]
    })
  );

  children.push(new Paragraph({ text: "Reimbursables", heading: HeadingLevel.HEADING_2 }));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [new TableCell({ children: [new Paragraph("Item")] }), new TableCell({ children: [new Paragraph("Rate / Cost")] })] }),
        ...rendered.reimbursableRows.map((r) =>
          new TableRow({ children: [new TableCell({ children: [new Paragraph(r.item)] }), new TableCell({ children: [new Paragraph(r.rate)] })] })
        )
      ]
    })
  );

  children.push(new Paragraph({ text: "Acceptance", heading: HeadingLevel.HEADING_2 }));
  input.signature_blocks.forEach((s) => {
    children.push(new Paragraph(`${s.label}: _________________________`));
    if (s.name_line) children.push(new Paragraph("Name: _________________________"));
    if (s.title_line) children.push(new Paragraph("Title: _________________________"));
    if (s.date_line) children.push(new Paragraph("Date: _________________________"));
  });

  const doc = new Document({ sections: [{ children }] });
  return Buffer.from(await Packer.toBuffer(doc));
}
