import type { AiDevice } from "./ai-device";
import type { ModelInitializer } from "./model-initializer";
import { Siglip2CpuInitializer } from "./siglip2";
import { WorkerCommand, type WorkerResult } from "./worker-message";

type ResolveVector = (value: string) => void;
type Resolve = () => void;
type Reject = (reason: string) => void;

interface Callbacks {
  onSuccess: Resolve | ResolveVector;
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
    try {
      const result = event.data;
      const callbacks = this._pendingMap.get(result.id);
      if (!callbacks) {
        throw new Error("unknown event id");
      }
      this._pendingMap.delete(result.id);

      if (result.error) {
        callbacks.onFail(result.error);
        return;
      }

      switch (result.command) {
        case WorkerCommand.initialize:
          (callbacks.onSuccess as Resolve)();
          break;
        case WorkerCommand.generate:
          if (!result.vector) {
            throw new Error("empty result");
          }

          (callbacks.onSuccess as ResolveVector)(result.vector);
          break;
        default:
          callbacks.onFail("unknown event command");
          break;
      }
    } catch (e) {
      console.error(e);
    }
  };

  public async init(): Promise<void> {
    if (this.initialized()) {
      return;
    }

    this._initializer = new Siglip2CpuInitializer();
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
      });
    });
  }
  public initialized(): boolean {
    return this._initializer !== null && this._initialized;
  }

  public display(): string | null {
    return this._initializer ? this._initializer.display() : null;
  }

  public async generateVector(file: File): Promise<string> {
    if (!this._initialized || !this._initializer) {
      throw new Error("cpu ai is not initialized");
    }

    return new Promise<string>((resolve, reject) => {
      const callbacks = {
        onSuccess: resolve,
        onFail: reject,
      };
      const id = this.next();
      this._pendingMap.set(id, callbacks);
      this._worker.postMessage({
        id,
        command: WorkerCommand.generate,
        file,
      });
    });
  }
}
