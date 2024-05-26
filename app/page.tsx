import Game from "@/components/game/game";
import Image from "next/image";
import PauseMenu from "@/components/pause-menu";
import "@/app/globals.css";
export default function Root() {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden lg:hidden">
        <Image
          src="/background.png"
          fill={true}
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          priority
        />
        <div className="absolute top-0 left-0 w-full h-full z-10">
          Come back on a real computer to play the game.
        </div>
      </div>
      <div className="hidden lg:block lg:relative w-full h-screen overflow-hidden">
        <Image
          src="/background.png"
          fill={true}
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          priority
        />
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <PauseMenu />
          <Game />
        </div>
      </div>
    </>
  );
}
