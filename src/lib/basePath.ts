const BASE_PATH = process.env.__NEXT_ROUTER_BASEPATH || process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetPath(path: string): string {
  if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.basePath) {
    return `${(window as any).__NEXT_DATA__.basePath}${path}`;
  }
  return `${BASE_PATH}${path}`;
}
