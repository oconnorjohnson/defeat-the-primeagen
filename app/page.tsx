import Game from "@/components/game/game";
import Image from "next/image";
import "@/app/globals.css";
export default function Root() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/background.png"
        layout="fill"
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        priority
      />
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <Game />
      </div>
    </div>
  );
}
