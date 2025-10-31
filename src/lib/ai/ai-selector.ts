import type { PreTrainedModel, Processor } from "@huggingface/transformers";

export interface AiSelector {
  display(): string;
  name(): string;
  model(): Promise<PreTrainedModel>;
  processor(): Promise<Processor>;
}
