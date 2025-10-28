interface Props {
  err: string | null;
  name: string | null;
  initialized: boolean;
}

function AppStatus(p: Props) {
  function err() {
    return <p>p.err</p>;
  }

  function status() {
    if (p.initialized) {
      return <p>{p.name}</p>;
    } else {
      return <p>loading</p>;
    }
  }

  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div>
          <h1 className="text-2xl">Status</h1>
          {p.err ? err() : status()}
        </div>
      </div>
    </div>
  );
}

export default AppStatus;
