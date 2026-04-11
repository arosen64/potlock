import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLocation } from "wouter";

interface ContractEditorProps {
  poolId: string;
  initialContent?: object | null;
}

export function ContractEditor({ poolId, initialContent }: ContractEditorProps) {
  const [, navigate] = useLocation();
  const storeContractVersion = useMutation(api.contractVersions.storeContractVersion);
  const activeVersion = useQuery(api.contractVersions.getActiveContractVersion, { poolId });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your contract here..." }),
    ],
    content: initialContent ?? activeVersion?.content ?? undefined,
  });

  const handleSave = async () => {
    if (!editor) return;
    await storeContractVersion({
      poolId,
      content: editor.getJSON(),
      prevVersionHash: activeVersion?.versionHash ?? null,
    });
    navigate(`/pool/${poolId}/contract`);
  };

  return (
    <div className="contract-editor">
      <div className="editor-toolbar">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive("bold") ? "active" : ""}>B</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive("italic") ? "active" : ""}>I</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editor?.isActive("heading", { level: 1 }) ? "active" : ""}>H1</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive("heading", { level: 2 }) ? "active" : ""}>H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive("bulletList") ? "active" : ""}>• List</button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive("orderedList") ? "active" : ""}>1. List</button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={editor?.isActive("blockquote") ? "active" : ""}>" Quote</button>
        <button onClick={() => editor?.chain().focus().toggleCode().run()} className={editor?.isActive("code") ? "active" : ""}>{"`"} Code</button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
      <div className="editor-actions">
        <button onClick={handleSave} className="save-btn">Save Contract</button>
      </div>
    </div>
  );
}
