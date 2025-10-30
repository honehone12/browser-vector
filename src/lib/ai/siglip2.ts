import {
  AutoProcessor,
  CLIPPreTrainedModel,
  PreTrainedModel,
} from "@huggingface/transformers";
import type { AiSelector } from "./ai-selector";

class Siglip2PreTrainedModel extends PreTrainedModel {}

class Siglip2Model extends Siglip2PreTrainedModel {}

class Siglip2TextModel extends Siglip2PreTrainedModel {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(pretrained_model_name_or_path, options = {}) {
    return super.from_pretrained(pretrained_model_name_or_path, {
      ...options,
      // Update default model file name if not provided
      model_file_name: options.model_file_name ?? "text_model",
    });
  }
}

class Siglip2VisionModel extends CLIPPreTrainedModel {
  /** @type {typeof PreTrainedModel.from_pretrained} */
  static async from_pretrained(pretrained_model_name_or_path, options = {}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return super.from_pretrained(pretrained_model_name_or_path, {
      ...options,
      // Update default model file name if not provided
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      model_file_name: options.model_file_name ?? "vision_model",
    });
  }
}

export class Siglip2 implements AiSelector {
  public name() {
    return "siglip2-base-patch16-512";
  }

  public fullName() {
    return "onnx-community/siglip2-base-patch16-512-ONNX";
  }

  public model() {
    return Siglip2VisionModel.from_pretrained(this.fullName(), {
      device: "webgpu",
    });
  }

  public processor() {
    return AutoProcessor.from_pretrained(this.fullName(), { device: "webgpu" });
  }
}
