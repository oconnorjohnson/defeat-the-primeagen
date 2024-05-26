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
  // const [isGamePaused] = useAtom(gamePausedAtom);
  // if (!isGamePaused) return null;

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
            <div className="flex flex-col px-4 py-2 text-xl font-semibold text-zinc-800">
              Best Match
            </div>
            <div className="flex flex-row items-center bg-zinc-300 border-2 border-zinc-500 px-12 pt-1 pb-3">
              <Image
                src="/primeColor.png"
                width={75}
                height={75}
                alt="primeagen"
                className="pr-2"
              />
              <div className="flex flex-col justify-start items-between text-xl font-semibold text-zinc-800 pt-3">
                Defeat the Primeagen
                <span className="text-zinc-700 text-base font-light">
                  Application
                </span>
              </div>
            </div>
            <div className="pb-24">
              <div className="flex flex-col p-4 text-xl font-semibold text-zinc-800">
                Apps
              </div>
              <div className="flex flex-row items-center justify-between pr-4">
                <div className="flex flex-row items-center  px-12 pt-1 pb-3">
                  <Image
                    src="/primeGray.png"
                    width={40}
                    height={40}
                    alt="primeagen"
                    className="pr-2"
                  />
                  <div className="flex flex-row justify-start items-center text-xl font-semibold text-zinc-800 pt-3">
                    Defeat the Primeagen
                    <span className="font-light text-zinc-600 pl-2 text-lg">
                      PBE
                    </span>
                  </div>
                </div>
                <MdKeyboardArrowRight className="h-8 w-8" />
              </div>
              <div className="flex flex-row items-center justify-between pr-4">
                <div className="flex flex-row items-center  px-12 pt-1 pb-3">
                  <Image
                    src="/primeColor.png"
                    width={40}
                    height={40}
                    alt="primeagen"
                    className="pr-2"
                  />
                  <div className="flex flex-row justify-start items-center text-xl font-semibold text-zinc-800 pt-3">
                    <span className="font-light text-zinc-600 pr-2">
                      Install{" "}
                    </span>
                    Defeat the Primeagen
                    <span className="font-light text-zinc-600 pl-2 text-lg">
                      na.exe
                    </span>
                  </div>
                </div>
                <MdKeyboardArrowRight className="h-8 w-8" />
              </div>
              <div className="flex flex-row items-center justify-between pr-4">
                <div className="flex flex-row items-center  px-12 pt-1 pb-3">
                  <Image
                    src="/primeGray.png"
                    width={40}
                    height={40}
                    alt="primeagen"
                    className="pr-2"
                  />
                  <div className="flex flex-row justify-start items-center text-xl font-semibold text-zinc-800 pt-3">
                    <span className="font-light text-zinc-600 pr-2">
                      Install{" "}
                    </span>
                    Defeat the Primeagen
                    <span className="font-light text-zinc-600 pl-2 text-lg">
                      PBE
                    </span>
                  </div>
                </div>
                <MdKeyboardArrowRight className="h-8 w-8" />
              </div>
            </div>
            <div className="flex flex-col p-6 text-xl font-semibold text-zinc-800">
              Search the web
            </div>
            <div className="w-full flex flex-row items-center text-zinc-600 text-xl ">
              <div className="px-4" />
              <GoSearch className="h-6 w-6 pt-1" />
              <div className="pt-1.5 pl-2">Defeat the Primeagen</div>
              <div className="pt-2 pl-2 text-zinc-500 text-sm">
                {"-"} See more web results
              </div>
            </div>

            <div className="flex flex-col p-6 text-xl font-semibold text-zinc-800">
              Settings {"("}3{")"}
            </div>
          </div>
          <div className="px-2" />
          <div className="flex flex-col h-full w-1/2 bg-zinc-100 text-zinc-600">
            <div className="flex flex-col text-center items-center h-[225px] py-8">
              <Image
                src="/primeColor.png"
                width={125}
                height={125}
                alt="primeagen"
                className="pl-6"
              />
              <span className="text-2xl pt-4">Defeat the Primeagen</span>
              Application
            </div>
            <div className="flex flex-row justify-between items-center h-[50px] border-t-2 border-b-2 border-zinc-300 text-zinc-500 py-2 px-4">
              <div>Location</div>
              <div>{"C:Windows|System32DefeatThePrimeagen\v1.0"}</div>
            </div>
            <div className="flex flex-col h-full items-start justify-start p-8">
              <button
                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-400 transition-all"
                type="button"
              >
                Resume
              </button>
              <div className="py-2"></div>
              <button
                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-400 transition-all"
                type="button"
              >
                Restart
              </button>
              <div className="py-2"></div>
              <button
                className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-400 transition-all"
                type="button"
              >
                I have a date with a real girl, you wouldn&apos;t understand{" "}
                <br />
                {"("}Save {"&"} Exit{")"}
              </button>
              <div className="flex flex-col items-start">
                <span className="font-bold pt-4">Game Play:</span>
                Move left and right to move the portal. Try to accept all safe
                requests while dodging nefarious ones. Defend yourself with your
                lasers, but be sparing, because you only get 10 every 30
                seconds.
                <br />
                {
                  "Use `H` or `left arrow` key to move left, and `L` or `right arrow` key to move right. Use `F` or or `backspace` key to fire a laser. Use `spacebar` key to pause at any time. Use `:wq` to save and exit at any time."
                }
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-start h-full border-t-2 border-zinc-700 text-zinc-600 text-xl ">
          <div className="flex flex-row items-center pt-1.5 pl-1">
            <GoSearch className="h-10 w-10 px-2" />{" "}
            <div className="">Defeat the Primeagen</div>
          </div>
        </div>
      </div>
    </div>
  );
}
