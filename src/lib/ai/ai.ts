import {
  AutoModel,
  AutoProcessor,
  PreTrainedModel,
  Processor,
} from "@huggingface/transformers";
import type { AiSelector } from "./ai-selector";

class Ai {
  private _selector: AiSelector | null = null;
  private _initialized = false;
  private _model: PreTrainedModel | null = null;
  private _tokenizer: Processor | null = null;

  async init(selector: AiSelector) {
    this._initialized = false;
    this._selector = selector;
    const name = selector.fullName();
    this._model ??= await AutoModel.from_pretrained(name);
    this._tokenizer ??= await AutoProcessor.from_pretrained(name);
    this._initialized = true;
  }

  initialized(): boolean {
    return this._initialized;
  }

  name(): string | null {
    return this._initialized && this._selector ? this._selector.name() : null;
  }
}

const ai = new Ai();

export default ai;
