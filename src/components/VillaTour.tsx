"use client";

import { useState, useEffect } from "react";

export function VillaTour() {
  // Array of images for the carousel
  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
  ];

  // State to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Autoscroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 m-6 rounded-lg scale-90">
      {/* Carousel Section */}
      <div className="w-full md:w-1/3 relative">
        <div className="aspect-[1/1] bg-black rounded-[3px] overflow-hidden relative">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Villa ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 hover:bg-white hover:text-gray-900 transition-colors text-white p-2 rounded-full shadow-md"
        >
          &#8592;
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 hover:bg-white hover:text-gray-900 transition-colors text-white p-2 rounded-full shadow-md"
        >
          &#8594;
        </button>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-2/3">
        <h2 className="text-4xl font-bold mb-4">About Us</h2>
        <p className="text-xl text-gray-700">
          Welcome to Casa Filomena, where luxury, comfort, and warm Filipino hospitality 
          come together to create an unforgettable getaway. Our collection of beautifully 
          designed villas is thoughtfully crafted to offer guests a serene escape, blending 
          contemporary elegance with the natural charm of Bohol’s island landscape.
        </p>
        <p className="text-xl text-gray-700 mt-4">
          As you explore our photo carousel, you’ll get a glimpse of the refined interiors, 
          inviting living spaces, and the tranquil surroundings that make Casa Filomena truly 
          special. Every corner is curated to inspire relaxation—from the soft lighting and 
          stylish décor to the lush greenery that envelopes the property. Here, you can slow 
          down, breathe, and enjoy the simple pleasures of island living.
        </p>
        <p className="text-xl text-gray-700 mt-4">
          Whether you're dreaming of a romantic retreat with your loved one, planning a 
          memorable vacation with family and friends, or seeking a peaceful sanctuary to 
          unwind, our villas provide the perfect setting. Each stay is designed with your 
          comfort in mind, offering spacious rooms, premium amenities, and thoughtful touches 
          that make you feel right at home.
        </p>
        <p className="text-xl text-gray-700 mt-4">
          At Casa Filomena, we believe that meaningful moments are made in beautiful places. 
          Book your stay today and indulge in an experience that blends elegance, tranquility, 
          and heartfelt service—creating memories that will stay with you long after your visit.
        </p>
      </div>
    </div>
  );
}

export default VillaTour;