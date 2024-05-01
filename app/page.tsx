"use client";
import { useEffect } from "react";
import RiveHero from "@/components/rive-hero";
import { useAtom } from "jotai";
import { triggerRightThumbAtom, triggerLeftThumbAtom } from "@/state/atoms";

export default function Simple() {
  const [, setTriggerRightThumb] = useAtom(triggerRightThumbAtom);
  const [, setTriggerLeftThumb] = useAtom(triggerLeftThumbAtom);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setTriggerLeftThumb(true); // Trigger Left thumb on left arrow key press
      } else if (event.key === "ArrowRight") {
        setTriggerRightThumb(true); // Trigger Right thumb on right arrow key press
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setTriggerRightThumb, setTriggerLeftThumb]);
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
