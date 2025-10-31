import {
  AutoProcessor,
  CLIPPreTrainedModel,
  PreTrainedModel,
  type PretrainedModelOptions,
} from "@huggingface/transformers";
import type { AiSelector } from "./ai-selector";

class Siglip2PreTrainedModel extends PreTrainedModel {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Siglip2Model extends Siglip2PreTrainedModel {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Siglip2TextModel extends Siglip2PreTrainedModel {
  static async from_pretrained(
    pretrained_model_name_or_path: string,
    options: PretrainedModelOptions = {},
  ) {
    return super.from_pretrained(pretrained_model_name_or_path, {
      ...options,
      // Update default model file name if not provided
      model_file_name: options.model_file_name ?? "text_model",
    });
  }
}

class Siglip2VisionModel extends CLIPPreTrainedModel {
  static async from_pretrained(
    pretrained_model_name_or_path: string,
    options: PretrainedModelOptions = {},
  ) {
    return super.from_pretrained(pretrained_model_name_or_path, {
      ...options,
      // Update default model file name if not provided
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
