declare module "html-to-text" {
  export function htmlToText(
    html: string,
    options?: {
      wordwrap?: number | boolean;
      selectors?: { selector: string; format?: string }[];
    }
  ): string;
}
