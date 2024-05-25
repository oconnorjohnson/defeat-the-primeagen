"use client";
import { useAtom } from "jotai";
import { gamePausedAtom } from "@/state/atoms";

export default function PauseMenu() {
  const [isGamePaused] = useAtom(gamePausedAtom);
  if (!isGamePaused) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="flex items-center bg-gray-500 justify-center w-[1050px] h-[800px]">
        <h1 className="text-white text-4xl">Pause Menu</h1>
      </div>
    </div>
  );
}
