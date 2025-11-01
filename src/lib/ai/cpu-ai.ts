import type { Tensor } from "@huggingface/transformers";
import type { AiDevice } from "./ai-device";
import type { ModelInitializer } from "./model-initializer";
import { WorkerCommand, type WorkerResult } from "./worker-message";

type ResolveTensor = (value: Tensor) => void;
type Resolve = () => void;
type Reject = (reason: string) => void;

interface Callbacks {
  onSuccess: Resolve | ResolveTensor;
  onFail: Reject;
}

export class CpuAi implements AiDevice {
  private _worker: Worker = new Worker(
    new URL("./worker.ts", import.meta.url),
    { type: "module" },
  );
  private _initializer: ModelInitializer | null = null;
  private _pendingMap: Map<number, Callbacks> = new Map<number, Callbacks>();
  private _initialized = false;
  private _next = 0;

  public constructor() {
    this._worker.onmessage = this.onMessage;
  }

  private next(): number {
    return this._next++;
  }

  private onMessage = (event: MessageEvent<WorkerResult>) => {
    const result = event.data;
    const callbacks = this._pendingMap.get(result.id);
    this._pendingMap.delete(result.id);
    if (!callbacks) {
      console.error("unknown event id");
      return;
    }

    if (result.error) {
      callbacks.onFail(result.error);
      return;
    }

    switch (result.command) {
      case WorkerCommand.initialize:
        (callbacks.onSuccess as Resolve)();
        break;
      case WorkerCommand.generate:
        if (result.tensor) {
          (callbacks.onSuccess as ResolveTensor)(result.tensor);
        } else {
          callbacks.onFail("empty result");
        }
        break;
      default:
        callbacks.onFail("unknown event command");
        break;
    }
  };

  public async init(initializer: ModelInitializer): Promise<void> {
    if (this.initialized()) {
      return;
    }

    if (!initializer.useCpu()) {
      throw new Error("unexpected cpu model");
    }

    this._initializer = initializer;
    return new Promise((resolve, reject) => {
      const callbacks = {
        onSuccess: () => {
          this._initialized = true;
          resolve();
        },
        onFail: reject,
      };
      const id = this.next();
      this._pendingMap.set(id, callbacks);
      this._worker.postMessage({
        id,
        command: WorkerCommand.initialize,
        display: initializer.display(),
      });
    });
  }
  public initialized(): boolean {
    return this._initializer !== null && this._initialized;
  }

  public display(): string | null {
    return this._initializer ? this._initializer.display() : null;
  }

  public async generateVector(blob: Blob): Promise<Tensor> {
    if (!this._initialized || !this._initializer) {
      throw new Error("cpu ai is not initialized");
    }

    return new Promise<Tensor>((resolve, reject) => {
      const callbacks = {
        onSuccess: resolve,
        onFail: reject,
      };
      const id = this.next();
      this._pendingMap.set(id, callbacks);
      this._worker.postMessage({
        id,
        command: WorkerCommand.generate,
        blob,
      });
    });
  }
}
