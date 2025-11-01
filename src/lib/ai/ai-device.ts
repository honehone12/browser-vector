export interface AiDevice {
  init(): Promise<void>;
  initialized(): boolean;
  display(): string | null;
  generateVector(blob: Blob): Promise<string>;
}
