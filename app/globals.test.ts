// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Princess responsive styles", () => {
  const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8").replace(/\s+/g, "");

  it("keeps the title fitted and the learning journey locked to 16:9", () => {
    expect(css).toContain(".exact-screen-frame{position:relative;width:min(100vw,calc(100svh*var(--screen-ratio)))");
    expect(css).toContain(".prepo-frame{width:min(100vw,calc(100svh*16/9));aspect-ratio:16/9");
    expect(css).toContain(".exact-screen{display:block;width:100%;height:100%;object-fit:cover");
    expect(css).toContain(".prepo-ribbon");
    expect(css).toContain(".prepo-scroll");
    expect(css).toContain(".story-spread");
  });
});
