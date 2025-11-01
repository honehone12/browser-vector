import type { Tensor } from "@huggingface/transformers";

export interface AiDevice {
  initialized(): boolean;
  display(): string | null;
  generateVector(blob: Blob): Promise<Tensor>;
}
