"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ProposalInput, proposalSchema } from "@/lib/schema";
import { defaultProposal } from "@/components/defaultProposal";

export default function Home() {
  const { register, handleSubmit, watch, setValue } = useForm<ProposalInput>({ defaultValues: defaultProposal });
  const [previewHtml, setPreviewHtml] = useState<string>("<p>Loading...</p>");
  const values = watch();

  const parsed = useMemo(() => proposalSchema.safeParse(values), [values]);

  useEffect(() => {
    if (!parsed.success) return;
    fetch("/api/preview", { method: "POST", body: JSON.stringify(parsed.data) })
      .then((r) => r.text())
      .then(setPreviewHtml);
  }, [parsed]);

  const exportFile = async (kind: "docx" | "pdf") => {
    if (!parsed.success) return;
    const res = await fetch(`/api/export/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${parsed.data.document_meta.proposal_id}.${kind}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveJson = () => {
    const blob = new Blob([JSON.stringify(values, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proposal.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <h1>Conn + Architects Proposal Generator</h1>
      <p className="small">Template picker: Conn Architectural Proposal (single family only).</p>
      <div className="grid">
        <div className="card">
          <form onSubmit={handleSubmit(() => undefined)}>
            <label>Template</label>
            <select defaultValue="conn_arch_proposal" disabled><option>Conn Architectural Proposal</option></select>
            <label>Proposal Date</label><input {...register("document_meta.date")} />
            <label>Proposal ID</label><input {...register("document_meta.proposal_id")} />
            <label>Project Number</label><input {...register("document_meta.project_number")} />
            <label>Client Contact</label><input {...register("parties.to_client.contact_name")} />
            <label>Client Company</label><input {...register("parties.to_client.company")} />
            <label>Project Name</label><input {...register("project.project_name")} />
            <label>Project Location</label><input {...register("project.location")} />
            <label>Overview Paragraph</label><textarea {...register("project.description_paragraphs.0")} rows={3} />
            <label>Fee Total</label><input type="number" {...register("fees.total", { valueAsNumber: true })} />
            <label>Payment Due Days</label><input type="number" {...register("fees.invoicing_terms.due_days", { valueAsNumber: true })} />
            <label>Interest APR</label><input type="number" step="0.1" {...register("fees.invoicing_terms.interest_apr", { valueAsNumber: true })} />
            <label>Include Florida 558.0035 Clause</label><input type="checkbox" {...register("legal.include_558_0035_corporate_protection")} />
            <label>Enable Liability Cap</label><input type="checkbox" {...register("legal.liability_cap.enabled")} />
            {values.legal?.liability_cap?.enabled && (
              <>
                <label>Liability Cap Basis</label>
                <select {...register("legal.liability_cap.cap_basis") }>
                  <option value="cap_amount">Fixed Amount</option>
                  <option value="fee_multiple">Fee Multiple</option>
                  <option value="insurance_proceeds">Insurance Proceeds</option>
                </select>
                <label>Cap Amount</label><input type="number" {...register("legal.liability_cap.cap_amount", { valueAsNumber: true })} />
              </>
            )}
            <label>Enable Termination Clause</label><input type="checkbox" {...register("legal.termination.enabled")} />
            {values.legal?.termination?.enabled && (
              <>
                <label>Termination Notice Days</label><input type="number" {...register("legal.termination.notice_days", { valueAsNumber: true })} />
              </>
            )}
            <label>Proposal Void After Days</label><input type="number" {...register("legal.proposal_void_after_days", { valueAsNumber: true })} />
            <label>Enable AIA Reference</label><input type="checkbox" {...register("legal.aia_reference.enabled")} />
            {values.legal?.aia_reference?.enabled && <><label>AIA Doc</label><input {...register("legal.aia_reference.doc")} /></>}
            <div>
              <button type="button" onClick={() => exportFile("docx")}>Export DOCX</button>
              <button type="button" onClick={() => exportFile("pdf")}>Export PDF</button>
              <button type="button" onClick={saveJson}>Save JSON</button>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "application/json";
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    const data = JSON.parse(await file.text()) as ProposalInput;
                    const parsedFile = proposalSchema.parse(data);
                    (Object.keys(parsedFile) as (keyof ProposalInput)[]).forEach((k) => setValue(k, parsedFile[k]));
                  };
                  input.click();
                }}
              >Load JSON</button>
            </div>
          </form>
        </div>
        <div className="card">
          <h3>Live Preview</h3>
          {!parsed.success && <p>Validation errors present; preview paused.</p>}
          <iframe srcDoc={previewHtml} />
        </div>
      </div>
    </main>
  );
}
