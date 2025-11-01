import {
  PreTrainedModel,
  Processor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";
import type { ModelInitializer } from "./model-initializer";
import type { AiDevice } from "./ai-device";

export class GpuAi implements AiDevice {
  private _initializer: ModelInitializer | null = null;
  private _model: PreTrainedModel | null = null;
  private _processor: Processor | null = null;

  public async init(initializer: ModelInitializer): Promise<void> {
    if (this.initialized()) {
      return;
    }

    if (initializer.useCpu()) {
      throw new Error("unexpected cpu model");
    }

    this._initializer = initializer;
    this._model = await this._initializer.model();
    this._processor = await this._initializer.processor();
  }

  public initialized(): boolean {
    return (
      this._initializer !== null &&
      this._model !== null &&
      this._processor !== null
    );
  }

  public display(): string | null {
    return this._initializer ? this._initializer.display() : null;
  }

  public async generateVector(blob: Blob): Promise<Tensor> {
    if (!this._initializer || !this._model || !this._processor) {
      throw new Error("gpu ai is not initialized");
    }

    const img = await RawImage.fromBlob(blob);
    const rgb = img.rgb();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputs = await this._processor(rgb);
    const { pooler_output }: { pooler_output: Tensor } =
      await this._model(inputs);
    const raw = pooler_output.normalize().squeeze(0);
    // for int8
    const scale = 127;
    const quantized = raw.mul(scale).round();
    return quantized;
  }
}
