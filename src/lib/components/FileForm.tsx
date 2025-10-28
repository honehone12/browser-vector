import { useState } from "react";

interface Props {
  aiInitialized: boolean;
  handleImg: (imgBlob: Blob) => Promise<void>;
}

function FileForm(p: Props) {
  function actionAvailable(): boolean {
    return p.aiInitialized && !pending;
  }

  async function action(form: FormData): Promise<void> {
    if (pending) {
      return;
    }

    setPending(true);

    try {
      const file = form.get("file") as File | null;
      if (!file) {
        throw new Error("file is required");
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        throw new Error("unsupported file type");
      }

      await p.handleImg(file);
    } catch (e) {
      console.error(e);
    }

    setPending(false);
  }

  const [pending, setPending] = useState(false);

  return (
    <div className="hero">
      <div className="hero-content text-center">
        <form action={action}>
          <label htmlFor="file-file">
            <h2 className="text-xl">Select a Image File</h2>
          </label>
          <input
            required
            id="file-file"
            name="file"
            type="file"
            accept="image/jpeg, image/png"
            className="file-input file-input-primary mt-5"
          />
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

export default FileForm;
