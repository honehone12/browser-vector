import { AutoProcessor, SiglipVisionModel } from "@huggingface/transformers";
import type { AiSelector } from "./ai-selector";

export class Siglip implements AiSelector {
  public display() {
    return "siglip-base-patch16-512-gpu";
  }

  public name() {
    return "Xenova/siglip-base-patch16-512";
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

export class SiglipCpu implements AiSelector {
  public display() {
    return "siglip-base-patch16-512-cpu";
  }

  public name() {
    return "Xenova/siglip-base-patch16-512";
  }

  public model() {
    return SiglipVisionModel.from_pretrained(this.name());
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.name());
  }
}
