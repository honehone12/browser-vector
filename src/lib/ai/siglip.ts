import { AutoProcessor, SiglipVisionModel } from "@huggingface/transformers";
import type { AiSelector } from "./ai-selector";

export class Siglip implements AiSelector {
  public name() {
    return "siglip-base-patch16-512";
  }

  public fullName() {
    return "Xenova/siglip-base-patch16-512";
  }

  public model() {
    return SiglipVisionModel.from_pretrained(this.fullName());
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.fullName());
  }
}
