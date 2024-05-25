"use client";
import { useAtom } from "jotai";
import { gamePausedAtom } from "@/state/atoms";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
} from "react-icons/vsc";
import { GoSearch } from "react-icons/go";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";

export default function PauseMenu() {
  //   const [isGamePaused] = useAtom(gamePausedAtom);
  //   if (!isGamePaused) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="flex flex-col bg-zinc-200 w-[1075px] h-[825px] rounded-xl">
        <div className="w-full flex flex-row justify-end items-end h-[40px] text-zinc-600">
          <div className="flex flex-col h-full justify-end">
            <VscChromeMinimize className="h-6 w-6 icon" />
          </div>
          <div className="flex flex-col h-full justify-center">
            <VscChromeMaximize className="h-6 w-6 icon" />
          </div>
          <div className="flex flex-col h-full justify-center">
            <VscChromeClose className="h-6 w-6 icon" />
          </div>
          <div className="px-1" />
        </div>
        <div className="w-full h-full flex flex-row">
          <div className="flex flex-col h-full w-1/2 bg-zinc-100 text-zinc-600">
            <div className="flex flex-col px-4 py-2 text-xl font-bold text-zinc-800">
              Best Match
            </div>
            <div className="flex flex-row items-center bg-zinc-300 border-2 border-zinc-500 px-12 pt-2 pb-4">
              <Image
                src="/primeColor.png"
                width={75}
                height={75}
                alt="primeagen"
                className="pr-2"
              />
              <div className="flex flex-col justify-start items-between text-xl font-bold text-zinc-800 pt-4">
                Defeat the Primeagen
                <span className="text-zinc-700 text-base font-light">
                  Application
                </span>
              </div>
            </div>
            <div className="flex flex-col">Apps</div>
            <div className="flex flex-col">Defeat the Primeagen</div>
            <div className="flex flex-col">
              Install Defeat the Primeagen na.exe
            </div>
            <div className="flex flex-col">
              Install Defeat the Primeagen PBE
            </div>
            <div className="flex flex-col">Search the web</div>
            <div className="flex flex-col">
              Defeat the Primeagen - see more results
            </div>
            <div className="flex flex-col">Settings</div>
          </div>
          <div className="px-2" />
          <div className="flex flex-col h-full w-1/2 bg-zinc-100 text-zinc-600">
            <div className="flex flex-col">Best Match</div>
            <div className="flex flex-col">Best Match</div>
            <div className="flex flex-col">Best Match</div>
          </div>
        </div>
        <div className="w-full flex flex-row h-[80px] border-t-2 border-zinc-700 text-zinc-600 p-4 text-xl ">
          <GoSearch className="h-10 w-10 pr-4" />{" "}
          <div className="pt-1.5">Defeat the Primeagen</div>
        </div>
      </div>
    </div>
  );
}
