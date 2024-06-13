import { fromBech32 } from "@filosof-copilot-cosmjs/encoding";

export function isValidAddress(input: string, requiredPrefix: string): boolean {
  try {
    const { prefix, data } = fromBech32(input);
    if (prefix !== requiredPrefix) {
      return false;
    }
    return data.length === 20;
  } catch {
    return false;
  }
}
