import { AutoProcessor, SiglipVisionModel } from "@huggingface/transformers";
import type { ModelInitializer } from "./model-initializer";

export class SiglipGpuInitializer implements ModelInitializer {
  public display() {
    return "siglip-base-patch16-512-gpu";
  }

  public name() {
    return "Xenova/siglip-base-patch16-512";
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

export class SiglipCpuInitializer implements ModelInitializer {
  public display() {
    return "siglip-base-patch16-512-cpu";
  }

  public name() {
    return "Xenova/siglip-base-patch16-512";
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
