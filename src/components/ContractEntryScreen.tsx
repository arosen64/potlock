import { useRef, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ContractEditor } from "./ContractEditor";

interface ContractEntryScreenProps {
  poolId: string;
}

type State =
  | { mode: "entry" }
  | { mode: "scratch" }
  | { mode: "uploading" }
  | { mode: "editor"; initialContent: object }
  | { mode: "error"; message: string };

export function ContractEntryScreen({ poolId }: ContractEntryScreenProps) {
  const [state, setState] = useState<State>({ mode: "entry" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extractContractFromPdf = useAction(api.contractPdf.extractContractFromPdf);

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState({ mode: "uploading" });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const extractedText = await extractContractFromPdf({ pdfBytes: arrayBuffer });

      // Convert extracted plain text into a Tiptap document
      const paragraphs = extractedText
        .split(/\n+/)
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => ({
          type: "paragraph",
          content: [{ type: "text", text: line.trim() }],
        }));

      const content = { type: "doc", content: paragraphs };
      setState({ mode: "editor", initialContent: content });
    } catch (err) {
      setState({
        mode: "error",
        message: err instanceof Error ? err.message : "PDF extraction failed",
      });
    }
  };

  if (state.mode === "scratch") {
    return <ContractEditor poolId={poolId} />;
  }

  if (state.mode === "editor") {
    return <ContractEditor poolId={poolId} initialContent={state.initialContent} />;
  }

  return (
    <div className="contract-entry">
      <h2>Create Your Contract</h2>
      <p>No contract exists for this pool yet. Get started by uploading a PDF or writing from scratch.</p>

      {state.mode === "error" && (
        <div className="error-banner">
          <p>PDF extraction failed: {state.message}</p>
          <p>Please try again or create from scratch.</p>
        </div>
      )}

      <div className="entry-options">
        <div className="entry-option">
          <h3>Upload a PDF</h3>
          <p>Upload an existing contract document. Gemini will extract the content into the editor.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={state.mode === "uploading"}
          >
            {state.mode === "uploading" ? "Extracting..." : "Upload PDF"}
          </button>
        </div>

        <div className="entry-option">
          <h3>Create from Scratch</h3>
          <p>Open a blank editor and write your contract directly.</p>
          <button onClick={() => setState({ mode: "scratch" })}>
            Create from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}
