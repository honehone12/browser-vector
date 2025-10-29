import { useEffect, useState } from "react";
import ai from "./lib/ai/ai";
import { Siglip } from "./lib/ai/siglip";
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

  async function handleImg(form: FormData) {
    if (!aiInitialized || pending) {
      return;
    }

    setPending(true);
    setResult(null);

    try {
      const file = form.get("file") as File | null;
      if (!file) {
        throw new Error("file is required");
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        throw new Error("unsupported file type");
      }

      const tensor = await ai.generateVector(file);
      const l = tensor.tolist();
      const s = JSON.stringify(l, null, 2);
      setResult(s);
    } catch (e) {
      console.error(e);
    }

    setPending(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="text-center">
        <h1 className="text-4xl">Browser Vector</h1>
      </div>
      <div className="hero mt-10">
        <div className="text-center">
          <div className="card outline outline-primary max-w-80 px-10 py-5">
            <p className="text-xl">{aiStatus}</p>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <FileForm
          aiInitialized={aiInitialized}
          action={handleImg}
          pending={pending}
        />
      </div>
      {pending && (
        <div className="text-center mt-20">
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
