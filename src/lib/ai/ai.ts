import type { AiDevice } from "./ai-device";
import { GpuAi } from "./gpu-ai";
import { CpuAi } from "./cpu-ai";

class Ai {
  private _device: AiDevice | null = null;

  public async init(): Promise<void> {
    this._device = navigator.gpu?.requestAdapter().features
      ? new GpuAi()
      : new CpuAi();
    await this._device.init();
  }

  public initialized(): boolean {
    return this._device ? this._device.initialized() : false;
  }

  public display(): string | null {
    return this._device ? this._device.display() : null;
  }

  public async generateVector(file: File): Promise<string> {
    if (!this._device) {
      throw new Error("ai device is not initialized");
    }

    return this._device.generateVector(file);
  }
}

const ai = new Ai();

export default ai;
