import { ImageWithFallback } from './ui/ImageWithFallback';
import Link from "next/link";

export function VillaPortal() {
  return (
    <div className="relative w-full max-w-[1280px] h-[200px] mx-auto">
      {/* Background Image */}
      <ImageWithFallback
        src="images\581025896_122112331239028391_1986668517674544899_n.jpg"
        alt="Villa Portal"
        className="w-full h-full object-cover object-center filter brightness-[0.7] rounded-md"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <h2 className="text-white text-4xl font-bold drop-shadow-xl">
          Luxury Villas Await
        </h2>
        <h2 className="text-white drop-shadow-xl">
          Book your stay in paradise today
        </h2>

        <Link href="/villas">
          <button
            className="bg-yellow-800 opacity-80 text-white text-md px-6 px-4 py-1 rounded-[2px] hover:opacity-100 transition-opacity font-medium shadow-xl"
          >
            Explore Villas
          </button>
        </Link>
      </div>
    </div>
  );
}

export default VillaPortal;