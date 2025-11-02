import {
  PreTrainedModel,
  Processor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";
import { Base64 } from "js-base64";

export const SIGLIP_MAX_W = 512;
export const SIGLIP_MAX_H = 512;

export async function siglipProcess(
  model: PreTrainedModel,
  processor: Processor,
  blob: Blob,
): Promise<string> {
  const img = await RawImage.fromBlob(blob);
  const rgb = img.rgb();
  if (rgb.width > SIGLIP_MAX_W || rgb.height > SIGLIP_MAX_H) {
    throw new Error("image over size limit");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const inputs = await processor(rgb);
  const {
    pooler_output,
  }: {
    pooler_output: Tensor;
  } = await model(inputs);
  const raw = pooler_output.normalize().squeeze(0);
  // for int8
  const scale = 127;
  const quantized = raw.mul(scale).round();
  const b = new Uint8Array(quantized);
  return Base64.fromUint8Array(b, true);
}
