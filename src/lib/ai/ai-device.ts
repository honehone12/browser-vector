import type { ModelInitializer } from "./model-initializer";

export interface AiDevice {
  init(initializer: ModelInitializer): Promise<void>;
  initialized(): boolean;
  display(): string | null;
  generateVector(blob: Blob): Promise<string>;
}
