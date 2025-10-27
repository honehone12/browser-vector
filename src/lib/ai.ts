import {
  AutoModel,
  AutoProcessor,
  PreTrainedModel,
  Processor,
} from "@huggingface/transformers";

const MODEL_NAME = "Xenova/siglip-base-patch16-512";

class Ai {
  private _model: PreTrainedModel | null = null;
  private _tokenizer: Processor | null = null;

  async init() {
    this._model ??= await AutoModel.from_pretrained(MODEL_NAME);
    this._tokenizer ??= await AutoProcessor.from_pretrained(MODEL_NAME);
  }
}

const ai = new Ai();

export default ai;
