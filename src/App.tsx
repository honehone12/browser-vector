import { useEffect, useState } from "react";
import ai from "./lib/ai/ai";
import { Siglip } from "./lib/ai/siglip";
import AppStatus from "./lib/components/AppStatus";

function App() {
  async function init() {
    try {
      await ai.init(new Siglip());
      setInitialized(ai.initialized());
      setName(ai.name());
    } catch (e) {
      console.error(e);
      setErr("failed to initialize ai model");
    }
  }

  const [initialized, setInitialized] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen">
      <AppStatus err={err} name={name} initialized={initialized} />
    </div>
  );
}

export default App;
