import { useEffect, useState } from "react";
import ai from "./lib/ai";

function App() {
  async function init() {
    try {
      await ai.init();
    } catch (e) {
      console.error(e);
      setMsg("error");
    }
  }

  const [msg, setMsg] = useState("ok");

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <span className="text-center text-4xl">
        <h1>status: {msg}</h1>
      </span>
    </>
  );
}

export default App;
