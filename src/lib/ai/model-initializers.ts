import type { ModelInitializer } from "./model-initializer";
import { Siglip2CpuInitializer, Siglip2GpuInitializer } from "./siglip2";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ModelInitializers {
  public static cpu(): ModelInitializer {
    return new Siglip2CpuInitializer();
  }

  public static gpu(): ModelInitializer {
    return new Siglip2GpuInitializer();
  }
}
