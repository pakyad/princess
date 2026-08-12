// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Princess responsive storybook styles", () => {
  const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8").replace(/\s+/g, "");

  it("locks the experience to a simple landscape storybook system", () => {
    expect(css).toContain(".game-canvas,.title-screen{position:relative;width:min(100vw,calc(100svh*16/9));aspect-ratio:16/9");
    expect(css).toContain(".open-book{left:6%;right:6%;top:11%;bottom:6%;display:grid;grid-template-columns:1fr1fr");
    expect(css).toContain(".book-nav{margin-top:auto;display:grid;grid-template-columns:auto1frauto");
    expect(css).toContain(".learn-word{color:#cc3c75}");
    expect(css).toContain("Turnyourdevicesidewaystocontinuetheadventure");
  });
});
