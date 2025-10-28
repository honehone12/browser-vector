import { useEffect, useState } from "react";
import ai from "./lib/ai/ai";
import { Siglip } from "./lib/ai/siglip";
import AiStatus from "./lib/components/AiStatus";
import FileForm from "./lib/components/FileForm";

function App() {
  async function init() {
    try {
      await ai.init(new Siglip());
      seAitInitialized(ai.initialized());
      setAiStatus(ai.name() ?? "unknown");
    } catch (e) {
      console.error(e);
      setAiStatus("failed to initialize ai model");
    }
  }

  async function handleImg(imgBlob: Blob) {
    const tensor = await ai.generateVector(imgBlob);
  }

  const [aiInitialized, seAitInitialized] = useState(false);
  const [aiStatus, setAiStatus] = useState("initializing");

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <AiStatus aiStatus={aiStatus} />
      <div className="mt-20">
        <FileForm aiInitialized={aiInitialized} handleImg={handleImg} />
      </div>
    </div>
  );
}

export default App;
