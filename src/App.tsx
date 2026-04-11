import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { JoinPoolForm } from "./components/JoinPoolForm";
import { MemberList } from "./components/MemberList";
import { PoolStatusBadge, PoolStatusBanner } from "./components/PoolStatusBanner";

export default function App() {
  const { publicKey, connected } = useWallet();
  const createPool = useMutation(api.pools.createPool);

  const [poolId, setPoolId] = useState<Id<"pools"> | null>(null);
  const [view, setView] = useState<"dashboard" | "join">("dashboard");
  const [founderName, setFounderName] = useState("");
  const [poolName, setPoolName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pool = useQuery(api.pools.getPool, poolId ? { poolId } : "skip");
  const members = useQuery(api.members.getMembers, poolId ? { poolId } : "skip");

  const walletAddress = publicKey?.toBase58();
  const currentMember = members?.find((m) => m.wallet === walletAddress);
  const isManager = currentMember?.role === "manager";

  async function handleCreatePool(e: React.FormEvent) {
    e.preventDefault();
    if (!publicKey) return;
    setCreating(true);
    setError(null);
    try {
      const id = await createPool({
        name: poolName.trim(),
        founderName: founderName.trim(),
        founderWallet: publicKey.toBase58(),
      });
      setPoolId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pool.");
    } finally {
      setCreating(false);
    }
  }

  // No pool yet — show create form
  if (!poolId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Create a Pool</h1>
          {!connected ? (
            <div className="flex flex-col gap-3">
              <p className="text-gray-500 text-sm">Connect your wallet to get started.</p>
              <WalletMultiButton />
            </div>
          ) : (
            <form onSubmit={handleCreatePool} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Pool name (e.g. The House Fund)"
                value={poolName}
                onChange={(e) => setPoolName(e.target.value)}
                required
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Your name"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                required
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Creating…" : "Create Pool"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Pool created — show dashboard or join form
  const poolStatus = pool?.status ?? "pre-contract";

  return (
    <div className="min-h-screen p-8 max-w-lg mx-auto flex flex-col gap-6">
      {/* Header with pool name and status badge (5.1) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{pool?.name ?? "Pool Dashboard"}</h1>
          <PoolStatusBadge status={poolStatus} />
        </div>
        <button
          onClick={() => setView(view === "join" ? "dashboard" : "join")}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          {view === "join" ? "← Back" : "+ Add Member"}
        </button>
      </div>

      {/* Pre-contract banner (5.2 manager CTA, 5.3 member waiting) */}
      <PoolStatusBanner
        status={poolStatus}
        isManager={isManager}
        onCreateContract={() => {
          // Contract creation flow (issue #6) will be wired here
          alert("Contract creation coming soon!");
        }}
      />

      {view === "join" ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Join Pool</h2>
          <JoinPoolForm poolId={poolId} onSuccess={() => setView("dashboard")} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Members</h2>
          <MemberList poolId={poolId} />
        </div>
      )}
    </div>
  );
}
