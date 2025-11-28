import { ImageWithFallback } from './ui/ImageWithFallback';
import Link from "next/link";

export function VillaPortal() {
  return (
    <div className="relative w-full max-w-[1280px] h-[200px] mx-auto">
      {/* Background Image */}
      <ImageWithFallback
        src="https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/581025896_122112331239028391_1986668517674544899_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=HYJ4aU5r36AQ7kNvwGz-T7Q&_nc_oc=AdltNaGnL5jRrgeKY7shtAcUvEahUealYQLmrEYcoxfHIt2BXZE66_c5X2-FFqcr5HQ&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=x7vMcAu9PnABKNDDU28-ww&oh=00_AfgaYi1yeOh1G14iOUdmx_r1FDmuyuZf1SUQzz4luB5A6w&oe=692CC514"
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