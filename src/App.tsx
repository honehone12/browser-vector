import { useEffect, useState } from "react";
import ai from "./lib/ai/ai";
import { Siglip } from "./lib/ai/siglip";
import AiStatus from "./lib/components/AiStatus";
import FileForm from "./lib/components/FileForm";
import Loading from "./lib/components/Loading";

export default function App() {
  const [aiInitialized, seAitInitialized] = useState(false);
  const [aiStatus, setAiStatus] = useState("initializing ai model");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
    setResult(null);
    const tensor = await ai.generateVector(imgBlob);
    const l = tensor.tolist();
    const s = JSON.stringify(l, null, 2);
    setResult(s);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="text-center">
        <h1 className="text-4xl">Browser Vector</h1>
      </div>
      <div className="mt-10">
        <AiStatus aiStatus={aiStatus} />
      </div>
      <div className="mt-20">
        <FileForm
          aiInitialized={aiInitialized}
          handleImg={handleImg}
          pending={pending}
          setPending={setPending}
        />
      </div>
      {pending && (
        <div className="mt-20">
          <Loading />
        </div>
      )}
      {result && (
        <div className="text-center mt-20 px-10">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
