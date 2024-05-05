"use client";
import { useEffect } from "react";
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
import Game from "@/components/game";

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
      if (event.key === "f") {
        setTriggerLeftThumb(true);
      } else if (event.key === "j") {
        setTriggerRightThumb(true);
      } else if (event.key === "k") {
        setTriggerRightIndex(true);
      } else if (event.key === "l") {
        setTriggerRightRing(true);
      } else if (event.key === ";") {
        setTriggerRightPinky(true);
      } else if (event.key === "d") {
        setTriggerLeftIndex(true);
      } else if (event.key === "s") {
        setTriggerLeftRing(true);
      } else if (event.key === "a") {
        setTriggerLeftPinky(true);
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
    <div className="fixed w-screen h-screen bg-transparent z-20 flex flex-col items-center pt-20 pb-4 pl-12 pr-10">
      <div className="h-2/3 w-2/3 z-50 rounded-3xl">
        <Game />
      </div>
    </div>
  );
}

// top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center
// laptop-sm:w-[600px] laptop-sm:h-[386px] laptop-md:w-[825px] laptop-md:h-[575px] laptop-lg:h-[630px] laptop-lg:w-[905px] desktop-sm:h-[660px] desktop-sm:w-[1245px] desktop-md:h-[660px] desktop-md:w-[1245px] desktop-lg:h-[660px] desktop-lg:w-[1245px]
