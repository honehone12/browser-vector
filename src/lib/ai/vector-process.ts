import {
  PreTrainedModel,
  Processor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";
import imageCompression from "browser-image-compression";
import { Base64 } from "js-base64";

export const SIGLIP_MAX_SIZE = 512;

async function getRgb(file: File, useWebWorker: boolean): Promise<RawImage> {
  const img = await RawImage.fromBlob(file);
  if (img.width <= SIGLIP_MAX_SIZE && img.height <= SIGLIP_MAX_SIZE) {
    return img.rgb();
  }

  const resizedFile = await imageCompression(file, {
    maxWidthOrHeight: SIGLIP_MAX_SIZE,
    useWebWorker,
  });
  const resizedImg = await RawImage.fromBlob(resizedFile);
  return resizedImg.rgb();
}

export async function vectorProcess(
  model: PreTrainedModel,
  processor: Processor,
  file: File,
  useNewWorker: boolean,
): Promise<string> {
  const rgb = await getRgb(file, useNewWorker);

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
