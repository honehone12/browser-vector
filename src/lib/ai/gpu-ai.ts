import { PreTrainedModel, Processor } from "@huggingface/transformers";
import type { ModelInitializer } from "./model-initializer";
import type { AiDevice } from "./ai-device";
import { Siglip2GpuInitializer } from "./siglip2";
import { siglipProcess } from "./singlip-impl";

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

  public async generateVector(file: File): Promise<string> {
    if (!this._initializer || !this._model || !this._processor) {
      throw new Error("gpu ai is not initialized");
    }

    return siglipProcess(this._model, this._processor, file, true);
  }
}
