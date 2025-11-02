export const enum WorkerCommand {
  initialize = 1,
  generate,
}

interface WorkerMessage {
  id: number;
  command: WorkerCommand;
}

export interface WorkerParams extends WorkerMessage {
  file?: File | undefined;
}

export interface WorkerResult extends WorkerMessage {
  vector?: string | undefined;
  error?: string | undefined;
}
