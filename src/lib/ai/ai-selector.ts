import type { PreTrainedModel, Processor } from "@huggingface/transformers";

export interface AiSelector {
  name(): string;
  fullName(): string;
  model(): Promise<PreTrainedModel>;
  processor(): Promise<Processor>;
}
