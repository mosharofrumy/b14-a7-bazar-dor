
const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function fetchFromAPI<T>(
  endpoint: string,
  revalidate = 86400,
): Promise<T> {
  let lastError: unknown;

  for (const baseURL of BASE_URLS) {
    try {
      const res = await fetch(`${baseURL}${endpoint}`, {
        next: { revalidate },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        throw new Error(
          `${res.status} ${res.statusText} from ${baseURL}`,
        );
      }

      return (await res.json()) as T;
    } catch (error) {
      lastError = error;

      console.warn(
        `Trying next API after failure: ${baseURL}`,
        error,
      );
    }
  }

  throw new Error("সব API থেকে ডেটা আনা যায়নি।", {
    cause: lastError,
  });
}
