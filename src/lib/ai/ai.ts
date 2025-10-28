import {
  PreTrainedModel,
  Processor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";
import type { AiSelector } from "./ai-selector";

class Ai {
  private _selector: AiSelector | null = null;
  private _model: PreTrainedModel | null = null;
  private _processor: Processor | null = null;

  public async init(selector: AiSelector) {
    this._selector = selector;
    this._model = await selector.model();
    this._processor = await selector.processor();
  }

  public initialized(): boolean {
    return (
      this._selector !== null &&
      this._model !== null &&
      this._processor !== null
    );
  }

  public name(): string | null {
    return (this, this._selector ? this._selector.name() : null);
  }

  public async generateVector(imgBlob: Blob): Promise<Tensor> {
    if (!this._selector || !this._model || !this._processor) {
      throw new Error("ai is not initialized yet");
    }

    const img = await RawImage.fromBlob(imgBlob);
    const rgb = img.rgb();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputs = await this._processor(rgb);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { pooler_output } = await this._model(inputs);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const raw: Tensor = pooler_output.normalize().squeeze(0);
    // for int8
    const scale = 127;
    const quantized = raw.mul(scale).round();
    return quantized;
  }
}

const ai = new Ai();

export default ai;
