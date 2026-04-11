import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLocation } from "wouter";

interface ContractVersionDoc {
  _id: string;
  poolId: string;
  version: number;
  versionHash: string;
  prevVersionHash: string | null;
  nextVersionHash: string | null;
  content: object;
  createdAt: number;
}

interface ContractViewerProps {
  poolId: string;
}

function VersionView({
  doc,
  poolId,
  onNavigate,
}: {
  doc: ContractVersionDoc;
  poolId: string;
  onNavigate: (hash: string) => void;
}) {
  const [, navigate] = useLocation();

  const editor = useEditor({
    extensions: [StarterKit],
    content: doc.content,
    editable: false,
  });

  const isActive = doc.nextVersionHash === null;
  const createdAt = new Date(doc.createdAt).toLocaleString();

  return (
    <div className="contract-viewer">
      <div className="version-meta">
        <span className="version-number">Version {doc.version}</span>
        {isActive && <span className="active-badge">Active</span>}
        <span className="version-hash" title={doc.versionHash}>
          Hash: {doc.versionHash.slice(0, 8)}...
        </span>
        <span className="version-date">{createdAt}</span>
      </div>

      <div className="version-content">
        <EditorContent editor={editor} />
      </div>

      <div className="version-nav">
        <button
          onClick={() => doc.prevVersionHash && onNavigate(doc.prevVersionHash)}
          disabled={!doc.prevVersionHash}
        >
          ← Previous version
        </button>
        <button
          onClick={() => navigate(`/pool/${poolId}/contract/edit`)}
        >
          Edit / Amend
        </button>
        <button
          onClick={() => doc.nextVersionHash && onNavigate(doc.nextVersionHash)}
          disabled={!doc.nextVersionHash}
        >
          Next version →
        </button>
      </div>
    </div>
  );
}

function VersionByHash({
  hash,
  poolId,
  onNavigate,
}: {
  hash: string;
  poolId: string;
  onNavigate: (hash: string) => void;
}) {
  const doc = useQuery(api.contractVersions.getContractVersionByHash, { versionHash: hash });
  if (doc === undefined) return <p>Loading...</p>;
  if (doc === null) return <p>Version not found.</p>;
  return <VersionView doc={doc as ContractVersionDoc} poolId={poolId} onNavigate={onNavigate} />;
}

export function ContractViewer({ poolId }: ContractViewerProps) {
  const activeVersion = useQuery(api.contractVersions.getActiveContractVersion, { poolId });
  const [viewingHash, setViewingHash] = useState<string | null>(null);

  if (activeVersion === undefined) return <p>Loading...</p>;

  if (activeVersion === null) {
    return <p>No contract found for this pool.</p>;
  }

  const hashToShow = viewingHash ?? activeVersion.versionHash;

  if (hashToShow !== activeVersion.versionHash) {
    return (
      <VersionByHash
        hash={hashToShow}
        poolId={poolId}
        onNavigate={setViewingHash}
      />
    );
  }

  return (
    <VersionView
      doc={activeVersion as ContractVersionDoc}
      poolId={poolId}
      onNavigate={setViewingHash}
    />
  );
}
