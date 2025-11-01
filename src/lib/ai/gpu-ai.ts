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

  private constructor(
    initializer: ModelInitializer,
    model: PreTrainedModel,
    processor: Processor,
  ) {
    this._initializer = initializer;
    this._model = model;
    this._processor = processor;
  }

  public static async init(initializer: ModelInitializer): Promise<GpuAi> {
    if (initializer.useCpu()) {
      throw new Error("unexpected cpu model");
    }

    const model = await initializer.model();
    const processor = await initializer.processor();
    return new GpuAi(initializer, model, processor);
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
      throw new Error("ai is not initialized yet");
    }

    const img = await RawImage.fromBlob(blob);
    const rgb = img.rgb();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputs = await this._processor(rgb);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { pooler_output } = await this._model(inputs);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const raw: Tensor = pooler_output.normalize().squeeze(0);
    // for int8
    const scale = 127;
    const quantized = raw.mul(scale).round();
    return quantized;
  }
}
