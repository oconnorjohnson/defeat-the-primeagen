"use client";
import { useEffect, useState, MouseEvent, MouseEventHandler } from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";
import RiveCanvas from "@/components/rive-canvas";

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
  const leftThumb = useStateMachineInput(rive, "State Machine 1", "leftThumb");

  // Function to activate the rightThumb trigger
  const triggerRightThumb = () => {
    if (rightThumb) {
      rightThumb.fire();
    }
  };

  // Function to activate the leftThumb trigger
  const triggerLeftThumb = () => {
    if (leftThumb) {
      leftThumb.fire();
    }
  };

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
        aria-label="Hero element for the Explore page; an interactive graphic showing planets thru a spacesuit visor"
      ></canvas>
    </div>
  );
}
