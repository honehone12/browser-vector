import type { Tensor } from "@huggingface/transformers";
import type { AiDevice } from "./ai-device";
import type { ModelInitializer } from "./model-initializer";
import { GpuAi } from "./gpu-ai";
import { CpuAi } from "./cpu-ai";

class Ai {
  private _device: AiDevice | null = null;

  public async init(initializer: ModelInitializer): Promise<void> {
    if (initializer.useCpu()) {
      this._device = await CpuAi.init(initializer);
    } else {
      this._device = await GpuAi.init(initializer);
    }
  }

  public initialized(): boolean {
    return this._device ? this._device.initialized() : false;
  }

  public display(): string | null {
    return this._device ? this._device.display() : null;
  }

  public async generateVector(blob: Blob): Promise<Tensor> {
    if (!this._device) {
      throw new Error("ai device is not initialized");
    }

    return this._device.generateVector(blob);
  }
}

const ai = new Ai();

export default ai;
