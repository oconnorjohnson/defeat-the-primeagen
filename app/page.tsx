"use client";
import RiveHero from "@/components/rive-hero";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function Simple() {
  // return <RiveDemo />;
  return (
    <>
      <RiveHero />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        hello
      </div>
    </>
  );
}
