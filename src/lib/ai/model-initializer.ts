import type { PreTrainedModel, Processor } from "@huggingface/transformers";

export interface ModelInitializer {
  display(): string;
  name(): string;
  useCpu(): boolean;
  model(): Promise<PreTrainedModel>;
  processor(): Promise<Processor>;
}
