// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("exact screen scaling styles", () => {
  const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

  it("fits the full source image to both viewport dimensions without cropping", () => {
    expect(css).toContain("width: min(100vw, calc(100svh * var(--screen-ratio)))");
    expect(css).toContain("aspect-ratio: var(--screen-ratio)");
    expect(css).toContain("max-height: 100svh");
    expect(css).toContain("object-fit: contain");
    expect(css).not.toContain("object-fit: cover");
    expect(css).not.toContain("background-size: cover");
  });
});
