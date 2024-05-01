"use client";
import { useEffect } from "react";
import RiveHero from "@/components/rive-hero";
import { useAtom } from "jotai";
import {
  triggerRightThumbAtom,
  triggerRightIndexAtom,
  triggerRightRingAtom,
  triggerRightPinkyAtom,
  triggerLeftThumbAtom,
  triggerLeftIndexAtom,
  triggerLeftRingAtom,
  triggerLeftPinkyAtom,
} from "@/state/atoms";

export default function Simple() {
  const [, setTriggerRightThumb] = useAtom(triggerRightThumbAtom);
  const [, setTriggerRightIndex] = useAtom(triggerRightIndexAtom);
  const [, setTriggerRightRing] = useAtom(triggerRightRingAtom);
  const [, setTriggerRightPinky] = useAtom(triggerRightPinkyAtom);
  const [, setTriggerLeftThumb] = useAtom(triggerLeftThumbAtom);
  const [, setTriggerLeftIndex] = useAtom(triggerLeftIndexAtom);
  const [, setTriggerLeftRing] = useAtom(triggerLeftRingAtom);
  const [, setTriggerLeftPinky] = useAtom(triggerLeftPinkyAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setTriggerLeftThumb(true); // Trigger Left thumb on left arrow key press
      } else if (event.key === "ArrowRight") {
        setTriggerRightThumb(true); // Trigger Right thumb on right arrow key press
      } else if (event.key === "s") {
        setTriggerRightIndex(true); // Trigger Right index on up arrow key press
      } else if (event.key === "d") {
        setTriggerRightRing(true); // Trigger Right ring on down arrow key press
      } else if (event.key === "f") {
        setTriggerRightPinky(true); // Trigger Right pinky on space key press
      } else if (event.key === "j") {
        setTriggerLeftIndex(true); // Trigger Left index on left arrow key press
      } else if (event.key === "k") {
        setTriggerLeftRing(true); // Trigger Left ring on right arrow key press
      } else if (event.key === "l") {
        setTriggerLeftPinky(true); // Trigger Left pinky on up arrow key press
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    setTriggerRightThumb,
    setTriggerLeftThumb,
    setTriggerRightIndex,
    setTriggerRightRing,
    setTriggerRightPinky,
    setTriggerLeftIndex,
    setTriggerLeftRing,
    setTriggerLeftPinky,
  ]);
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
