"use client";

import dynamic from "next/dynamic";

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(() => import("./LocationMap"), { ssr: false });

export default function Location() {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 mx-auto max-w-4xl my-10">
      {/* Map Section */}
      <div className="w-[400px] h-[500px] rounded-lg overflow-hidden shadow-md">
        <MapWithNoSSR />
      </div>

      {/* Text Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Located in the Heart of Dauis, Minutes Away From Panglao’s Best</h2>
        <p className="text-gray-700">
          Nestled in the peaceful town of Totolan, Dauis, Casa Filomena Resort & Restaurant sits in a 
          serene spot where the charm of local living meets the beauty of Bohol’s world-famous destinations. 
          Our location offers the perfect balance—quiet and relaxing, yet conveniently close to everything you 
          want to explore.
        </p>
        <p className="text-gray-700 mt-4">
          Just a short drive from Panglao’s pristine white-sand beaches, vibrant island activities, 
          and top attractions, guests can enjoy the best of both worlds: a tranquil retreat and easy 
          access to adventure. Whether you’re visiting for family bonding, a romantic escape, or a 
          refreshing break with friends, Casa Filomena makes exploring Bohol simple and enjoyable.
        </p>
        <p className="text-gray-700 mt-4">
          From sunrise views, nearby cafes and cultural spots, to the stunning natural wonders that 
          have made Panglao a world-class destination, your stay with us places you right where unforgettable 
          experiences begin. Relax, explore, dine, and discover—Casa Filomena brings you closer to the beauty 
          of Bohol in every moment.
        </p>
        <p className="text-gray-700 mt-4">
          <strong>Contact Us:</strong> (038) 501 7421
          <br />
          <strong>Email:</strong>{" "}
          <a
            href="mailto:info@casafilomena.com"
            className="text-blue-500 hover:underline"
          >
            info@casafilomena.com
          </a>
        </p>
      </div>
    </div>
  );
}