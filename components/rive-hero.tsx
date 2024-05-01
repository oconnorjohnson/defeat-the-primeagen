"use client";
import { useEffect } from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";
import { useAtom } from "jotai";
import {
  triggerRightThumbAtom,
  triggerLeftThumbAtom,
  triggerRightIndexAtom,
  triggerRightRingAtom,
  triggerRightPinkyAtom,
  triggerLeftIndexAtom,
  triggerLeftRingAtom,
  triggerLeftPinkyAtom,
} from "@/state/atoms";
export default function RiveHero() {
  const {
    rive,
    setCanvasRef,
    setContainerRef,
    canvas: canvasRef,
    container: containerRef,
  } = useRive(
    {
      src: "/wrapper.riv",
      artboard: "New Artboard",
      stateMachines: "State Machine 1",
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      }),
      autoplay: true,
    },
    {
      shouldResizeCanvasToContainer: true,
    }
  );
  // Use useStateMachineInput to get the triggers
  const rightThumb = useStateMachineInput(
    rive,
    "State Machine 1",
    "rightThumb"
  );
  const rightIndex = useStateMachineInput(
    rive,
    "State Machine 1",
    "rightIndex"
  );
  const rightRing = useStateMachineInput(rive, "State Machine 1", "rightRing");
  const rightPinky = useStateMachineInput(
    rive,
    "State Machine 1",
    "rightPinky"
  );
  const leftThumb = useStateMachineInput(rive, "State Machine 1", "leftThumb");
  const leftIndex = useStateMachineInput(rive, "State Machine 1", "leftIndex");
  const leftRing = useStateMachineInput(rive, "State Machine 1", "leftRing");
  const leftPinky = useStateMachineInput(rive, "State Machine 1", "leftPinky");

  const [triggerRightThumb, setTriggerRightThumb] = useAtom(
    triggerRightThumbAtom
  );

  const [triggerRightIndex, setTriggerRightIndex] = useAtom(
    triggerRightIndexAtom
  );
  const [triggerRightRing, setTriggerRightRing] = useAtom(triggerRightRingAtom);
  const [triggerRightPinky, setTriggerRightPinky] = useAtom(
    triggerRightPinkyAtom
  );
  const [triggerLeftThumb, setTriggerLeftThumb] = useAtom(triggerLeftThumbAtom);

  const [triggerLeftIndex, setTriggerLeftIndex] = useAtom(triggerLeftIndexAtom);
  const [triggerLeftRing, setTriggerLeftRing] = useAtom(triggerLeftRingAtom);
  const [triggerLeftPinky, setTriggerLeftPinky] = useAtom(triggerLeftPinkyAtom);

  useEffect(() => {
    if (triggerRightThumb && rightThumb) {
      rightThumb.fire();
      setTriggerRightThumb(false);
    }
  }, [triggerRightThumb, rightThumb, setTriggerRightThumb]);

  useEffect(() => {
    if (triggerRightIndex && rightIndex) {
      rightIndex.fire();
      setTriggerRightIndex(false);
    }
  }, [triggerRightIndex, rightIndex, setTriggerRightIndex]);

  useEffect(() => {
    if (triggerRightRing && rightRing) {
      rightRing.fire();
      setTriggerRightRing(false);
    }
  }, [triggerRightRing, rightRing, setTriggerRightRing]);

  useEffect(() => {
    if (triggerRightPinky && rightPinky) {
      rightPinky.fire();
      setTriggerRightPinky(false);
    }
  }, [triggerRightPinky, rightPinky, setTriggerRightPinky]);

  useEffect(() => {
    if (triggerLeftThumb && leftThumb) {
      leftThumb.fire();
      setTriggerLeftThumb(false);
    }
  }, [triggerLeftThumb, leftThumb, setTriggerLeftThumb]);

  useEffect(() => {
    if (triggerLeftIndex && leftIndex) {
      leftIndex.fire();
      setTriggerLeftIndex(false);
    }
  }, [triggerLeftIndex, leftIndex, setTriggerLeftIndex]);

  useEffect(() => {
    if (triggerLeftRing && leftRing) {
      leftRing.fire();
      setTriggerLeftRing(false);
    }
  }, [triggerLeftRing, leftRing, setTriggerLeftRing]);

  useEffect(() => {
    if (triggerLeftPinky && leftPinky) {
      leftPinky.fire();
      setTriggerLeftPinky(false);
    }
  }, [triggerLeftPinky, leftPinky, setTriggerLeftPinky]);

  return (
    <div
      className="rive-canvas-container w-full h-full"
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      ref={setContainerRef}
    >
      <canvas
        className="rive-canvas absolute top-0 left-0 w-full h-full"
        ref={setCanvasRef}
        style={{ width: "100%", height: "100%" }}
        aria-label="game wrapper that displays a perspective of a cyborg at a computer witha split keyboard in a server room"
      ></canvas>
    </div>
  );
}
