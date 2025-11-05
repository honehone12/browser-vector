import type { AiDevice } from "./ai-device";
import { GpuAi } from "./gpu-ai";
import { CpuAi } from "./cpu-ai";

class Ai {
  private _device: AiDevice | null = null;
  private _initializing = false;

  public async init(): Promise<void> {
    if (this.initialized() || this._initializing) {
      return;
    }

    // use try catch and set false finaly for implement retrying
    this._initializing = true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const adapter = await navigator.gpu?.requestAdapter();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const device = await adapter?.requestDevice();

    this._device = adapter && device ? new GpuAi() : new CpuAi();
    await this._device.init();
    this._initializing = false;
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
