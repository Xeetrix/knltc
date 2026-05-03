type FbqArg =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: FbqArg[]) => void;
  }
}

export function fbq(...args: FbqArg[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}
