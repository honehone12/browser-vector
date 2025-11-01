export const enum WorkerCommand {
  initialize = 1,
  generate,
}

interface WorkerMessage {
  id: number;
  command: WorkerCommand;
}

export interface WorkerParams extends WorkerMessage {
  blob?: Blob | undefined;
}

export interface WorkerResult extends WorkerMessage {
  vector?: string | undefined;
  error?: string | undefined;
}
