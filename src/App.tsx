import { useEffect, useState, useTransition } from "react";
import { Siglip2GpuInitializer, Siglip2CpuInitializer } from "./lib/ai/siglip2";
import FileForm from "./lib/components/FileForm";
import Loading from "./lib/components/Loading";
import ai from "./lib/ai/ai";

export default function App() {
  const [aiInitialized, seAitInitialized] = useState(false);
  const [aiStatus, setAiStatus] = useState("initializing ai model");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  async function init() {
    try {
      const initializer = navigator.gpu?.requestAdapter().features
        ? new Siglip2GpuInitializer()
        : new Siglip2CpuInitializer();
      await ai.init(initializer);
      seAitInitialized(ai.initialized());
      setAiStatus(ai.display() ?? "unknown");
    } catch (e) {
      console.error(e);
      setAiStatus("failed to initialize ai model");
    }
  }

  function handleImg(form: FormData) {
    if (!aiInitialized || isPending) {
      return;
    }

    setResult(null);
    startTransition(async () => {
      try {
        const file = form.get("file") as File | null;
        if (!file) {
          throw new Error("file is required");
        }
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          throw new Error("unsupported file type");
        }

        const vector = await ai.generateVector(file);
        console.log(vector);

        const url = new URL("http://localhost:8080/anime-search");
        const body = JSON.stringify({
          function_id: 5,
          item_type: 1,
          vector,
        });

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body,
        });
        const s = await res.text();

        setResult(s);
      } catch (e) {
        console.error(e);
        setResult("error");
      }
    });
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
          <div className="card outline outline-primary max-w-100 px-10 py-5">
            <p className="text-xl">{aiStatus}</p>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <FileForm
          aiInitialized={aiInitialized}
          action={handleImg}
          pending={isPending}
        />
      </div>
      {isPending && (
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
