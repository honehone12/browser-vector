interface Props {
  aiStatus: string | null;
}

export default function AiStatus(p: Props) {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div className="card outline outline-primary px-10 py-5">
          <p className="text-xl">{p.aiStatus}</p>
        </div>
      </div>
    </div>
  );
}
