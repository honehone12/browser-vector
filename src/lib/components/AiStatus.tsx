interface Props {
  aiStatus: string | null;
}

function AiStatus(p: Props) {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div className="card outline outline-primary px-10 py-5">
          <h1 className="text-2xl">AI</h1>
          <p>{p.aiStatus}</p>
        </div>
      </div>
    </div>
  );
}

export default AiStatus;
