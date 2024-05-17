import Game from "@/components/game/game";

export default function Simple() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-transparent z-20 flex justify-center items-center">
      <Game />
    </div>
  );
}
