import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PAINTED_MOCKUP } from "@/lib/art/painted";
import "./globals.css";
import "./polish.css";
import "./scenes.css";
import "./final.css";
import "./painted.css";
import "./scene-lock.css";

export const metadata: Metadata = {
  title: "Princess and the Prepo",
  description: "An interactive storybook adventure for learning prepositions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const style = { "--painted-atlas": `url(${PAINTED_MOCKUP})` } as CSSProperties;
  return <html lang="en"><body style={style}>{children}</body></html>;
}
