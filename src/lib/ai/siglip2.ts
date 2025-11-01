import {
  AutoProcessor,
  SiglipPreTrainedModel,
  SiglipTextModel,
  SiglipVisionModel,
} from "@huggingface/transformers";
import type { AiSelector } from "./model-initializer";

class Siglip2PreTrainedModel extends SiglipPreTrainedModel {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Siglip2Model extends Siglip2PreTrainedModel {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Siglip2TextModel extends SiglipTextModel {}

class Siglip2VisionModel extends SiglipVisionModel {}

export class Siglip2GpuInitializer implements AiSelector {
  public display() {
    return "siglip2-base-patch16-512-gpu";
  }

  public name() {
    return "onnx-community/siglip2-base-patch16-512-ONNX";
  }

  public useCpu(): boolean {
    return false;
  }

  public model() {
    return Siglip2VisionModel.from_pretrained(this.name(), {
      device: "webgpu",
    });
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.name(), { device: "webgpu" });
  }
}

export class Siglip2CpuInitializer implements AiSelector {
  public display() {
    return "siglip2-base-patch16-512-cpu";
  }

  public name() {
    return "onnx-community/siglip2-base-patch16-512-ONNX";
  }

  public useCpu(): boolean {
    return true;
  }

  public model() {
    return Siglip2VisionModel.from_pretrained(this.name());
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.name());
  }
}
