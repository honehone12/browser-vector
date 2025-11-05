import { PreTrainedModel, Processor } from "@huggingface/transformers";
import { WorkerCommand, type WorkerParams } from "./worker-message";
import { vectorProcess } from "./vector-process";
import { ModelInitializers } from "./model-initializers";

let __model: PreTrainedModel | null = null;
let __processor: Processor | null = null;

self.onmessage = async (event: MessageEvent<WorkerParams>) => {
  const msg = event.data;
  try {
    switch (msg.command) {
      case WorkerCommand.initialize:
        {
          const initializer = ModelInitializers.cpu();
          __model = await initializer.model();
          __processor = await initializer.processor();
          self.postMessage({
            id: msg.id,
            command: msg.command,
          });
        }
        break;
      case WorkerCommand.generate:
        {
          if (!__model || !__processor) {
            throw new Error("worker is not initialized");
          }
          if (!msg.file) {
            throw new Error("empty message");
          }

          const vector = await vectorProcess(
            __model,
            __processor,
            msg.file,
            false,
          );

          self.postMessage({
            id: msg.id,
            command: msg.command,
            vector,
          });
        }
        break;
      default:
        throw new Error("unexpected command");
    }
  } catch (e) {
    console.error(e);
    self.postMessage({
      id: msg.id,
      error: `${e}`,
    });
  }
};
