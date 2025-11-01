import type { Tensor } from "@huggingface/transformers";

export const enum WorkerCommand {
  initialize = 1,
  generate,
}

interface WorkerMessage {
  id: number;
  command: WorkerCommand;
}

export interface WorkerParams extends WorkerMessage {
  display?: string | undefined;
  blob?: Blob | undefined;
}

export interface WorkerResult extends WorkerMessage {
  tensor?: Tensor | undefined;
  error?: string | undefined;
}
