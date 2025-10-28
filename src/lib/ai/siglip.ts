import type { AiSelector } from "./ai-selector";

export class Siglip implements AiSelector {
  public name() {
    return "siglip-base-patch16-512";
  }

  public fullName() {
    return "Xenova/siglip-base-patch16-512";
  }
}
