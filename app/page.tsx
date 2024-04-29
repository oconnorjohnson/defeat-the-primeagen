import Image from "next/image";

export default function Home() {
  return (
    <>
      <Image
        src="/background.png"
        alt="background"
        className="absolute inset-0 z-100 h-screen w-screen"
        layout="fill"
      />
      <div className="min-h-screen flex flex-col text-white text-center justify-center items-center">
        hello from the game!
      </div>
    </>
  );
}
