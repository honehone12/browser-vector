import { PreTrainedModel, Processor } from "@huggingface/transformers";
import { WorkerCommand, type WorkerParams } from "./worker-message";
import { Siglip2CpuInitializer } from "./siglip2";
import { siglipProcess } from "./singlip-impl";

let __model: PreTrainedModel | null = null;
let __processor: Processor | null = null;

self.onmessage = async (event: MessageEvent<WorkerParams>) => {
  const msg = event.data;
  try {
    switch (msg.command) {
      case WorkerCommand.initialize:
        {
          const initializer = new Siglip2CpuInitializer();
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

          const vector = await siglipProcess(
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
