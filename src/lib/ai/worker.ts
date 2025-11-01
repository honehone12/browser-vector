import {
  PreTrainedModel,
  Processor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";
import { WorkerCommand, type WorkerParams } from "./worker-message";
import { Siglip2CpuInitializer } from "./siglip2";
import { SiglipCpuInitializer } from "./siglip";
import type { ModelInitializer } from "./model-initializer";

let __model: PreTrainedModel | null = null;
let __processor: Processor | null = null;

function getInitializer(display: string | undefined): ModelInitializer {
  switch (display) {
    case "siglip-base-patch16-512-cpu":
      return new SiglipCpuInitializer();
    case "siglip2-base-patch16-512-cpu":
      return new Siglip2CpuInitializer();
    default:
      throw new Error("could not find initializer");
  }
}

self.onmessage = async (event: MessageEvent<WorkerParams>) => {
  const msg = event.data;
  try {
    switch (msg.command) {
      case WorkerCommand.initialize:
        {
          const initializer = getInitializer(msg.display);
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
          if (!msg.blob) {
            throw new Error("empty message");
          }

          const img = await RawImage.fromBlob(msg.blob);
          const rgb = img.rgb();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const inputs = await __processor(rgb);
          const { pooler_output }: { pooler_output: Tensor } =
            await __model(inputs);
          const raw = pooler_output.normalize().squeeze(0);
          // for int8
          const scale = 127;
          const quantized = raw.mul(scale).round();

          self.postMessage({
            id: msg.id,
            command: msg.command,
            tensor: quantized,
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
