import {
  PreTrainedModel,
  Processor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";
import type { ModelInitializer } from "./model-initializer";
import type { AiDevice } from "./ai-device";
import { Base64 } from "js-base64";
import { Siglip2GpuInitializer } from "./siglip2";

export class GpuAi implements AiDevice {
  private _initializer: ModelInitializer | null = null;
  private _model: PreTrainedModel | null = null;
  private _processor: Processor | null = null;

  public async init(): Promise<void> {
    if (this.initialized()) {
      return;
    }

    this._initializer = new Siglip2GpuInitializer();
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

  public async generateVector(blob: Blob): Promise<string> {
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
    const b = new Uint8Array(quantized);
    const enc = Base64.fromUint8Array(b, true);

    return enc;
  }
}
