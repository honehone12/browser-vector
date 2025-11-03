import { AutoProcessor, SiglipVisionModel } from "@huggingface/transformers";
import type { ModelInitializer } from "./model-initializer";

export class Siglip2GpuInitializer implements ModelInitializer {
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
    return SiglipVisionModel.from_pretrained(this.name(), {
      device: "webgpu",
    });
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.name(), { device: "webgpu" });
  }
}

export class Siglip2CpuInitializer implements ModelInitializer {
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
    return SiglipVisionModel.from_pretrained(this.name());
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.name());
  }
}
