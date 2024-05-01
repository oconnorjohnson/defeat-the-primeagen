import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RiveCanvas() {
  const { rive, RiveComponent } = useRive({
    src: "/wrapper.riv",
    artboard: "New Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
    shouldDisableRiveListeners: true,
  });

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="rive-button-container relative w-3/4 pt-[37.88%] mx-auto">
        <div className="absolute top-0 left-0 bottom-0 right-0">
          <RiveComponent aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
