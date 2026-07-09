/// <reference types="vite/client" />

interface ImportMeta {
  readonly glob: <T>(
    pattern: string,
    options?: {
      eager?: boolean;
      import?: string;
      query?: string;
    },
  ) => Record<string, T>;
}
