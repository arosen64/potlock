import { Route, Switch, Router } from "wouter";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ContractEntryScreen } from "./components/ContractEntryScreen";
import { ContractEditor } from "./components/ContractEditor";
import { ContractViewer } from "./components/ContractViewer";

function ContractPage({ poolId }: { poolId: string }) {
  const activeVersion = useQuery(api.contractVersions.getActiveContractVersion, { poolId });

  if (activeVersion === undefined) return <p>Loading...</p>;

  if (activeVersion === null) {
    return <ContractEntryScreen poolId={poolId} />;
  }

  return <ContractViewer poolId={poolId} />;
}

function App() {
  return (
    <Router base="/morgan-hacks-2026">
      <Switch>
        <Route path="/pool/:poolId/contract/edit">
          {(params) => <ContractEditor poolId={params.poolId} />}
        </Route>
        <Route path="/pool/:poolId/contract">
          {(params) => <ContractPage poolId={params.poolId} />}
        </Route>
        <Route>
          <p>Navigate to <code>/pool/&lt;poolId&gt;/contract</code> to get started.</p>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
