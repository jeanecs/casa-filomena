import { ImageWithFallback } from './ui/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://scontent.fcgy1-1.fna.fbcdn.net/v/t39.30808-6/561601915_122106831063028391_138386498224499306_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=62dXsxPN4dIQ7kNvwGPYwTw&_nc_oc=AdlTDv1Dy4IF0gmR4jLIw3nRbDc7lQP4LNA1LScSMmYBUOCsr4JHuk7IfaKVsWPSd7I&_nc_zt=23&_nc_ht=scontent.fcgy1-1.fna&_nc_gid=lif4ySTN1padc86vhnh5AQ&oh=00_Afgsc79j4wcU3-jAEN1blNp3XiYNyvL4XpgvkmkGCMQDpw&oe=692C7187"
          alt="Luxury beach villa with ocean view"
          className="w-full h-full object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <ImageWithFallback
          src="/images/Casa Filomena Logo-White.png"
          alt="Casa Filomena Logo"
          className="w-auto h-48 md:h-96 mx-auto"
        />
        <p className="text-xl md:text-2xl mb-8 font-light">
          Two exclusive luxury villas where the ocean meets paradise
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/villas"
            className="bg-yellow-800 opacity-80 text-white text-md px-4 py-1 rounded-[2px] hover:opacity-100 transition-opacity font-medium shadow-xl"
          >
            Explore Villas
          </a>
          <a
            href="/location"
            className="bg-yellow-800 opacity-80 text-white text-md px-6 px-4 py-1 rounded-[2px] hover:opacity-100 transition-opacity font-medium shadow-xl"
          >
            Where We Are
          </a>
        </div>
      </div>
    </section>
  );
}