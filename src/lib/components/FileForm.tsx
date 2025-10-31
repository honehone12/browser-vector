interface Props {
  aiInitialized: boolean;
  action: (from: FormData) => void | Promise<void>;
  pending: boolean;
}

export default function FileForm(p: Props) {
  function actionAvailable(): boolean {
    return p.aiInitialized && !p.pending;
  }

  return (
    <div className="hero">
      <div className="hero-content text-center">
        <form action={p.action}>
          <div>
            <label htmlFor="file-file">
              <h2 className="text-xl">Select a Image File</h2>
              <input
                required
                id="file-file"
                name="file"
                type="file"
                accept="image/jpeg, image/png"
                className="file-input file-input-primary w-90 mt-5"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!actionAvailable()}
            className="btn btn-primary mt-10"
          >
            Generate Vector
          </button>
        </form>
      </div>
    </div>
  );
}
