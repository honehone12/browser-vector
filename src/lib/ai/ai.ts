import type { AiDevice } from "./ai-device";
import type { ModelInitializer } from "./model-initializer";
import { GpuAi } from "./gpu-ai";
import { CpuAi } from "./cpu-ai";

class Ai {
  private _device: AiDevice | null = null;

  public async init(initializer: ModelInitializer): Promise<void> {
    this._device = initializer.useCpu() ? new CpuAi() : new GpuAi();
    await this._device.init(initializer);
  }

  public initialized(): boolean {
    return this._device ? this._device.initialized() : false;
  }

  public display(): string | null {
    return this._device ? this._device.display() : null;
  }

  public async generateVector(blob: Blob): Promise<string> {
    if (!this._device) {
      throw new Error("ai device is not initialized");
    }

    return this._device.generateVector(blob);
  }
}

const ai = new Ai();

export default ai;
