import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site name */}
          <div className="flex items-center space-x-8">
            <a href="../">
              <img
                src="/Casa Filomena Logo-Black.svg"
                alt="Casa Filomena Logo"
                className="h-16 w-auto" // Adjust height and width as needed
              />
            </a>
            <nav className="hidden md:flex space-x-6">
              <a href="/villas" className="text-gray-700 hover:text-gray-900 transition-colors">
                Villas
              </a>
              <a href="./#bulletin" className="text-gray-700 hover:text-gray-900 transition-colors">
                Bulletin
              </a>
              <a href="/location" className="text-gray-700 hover:text-gray-900 transition-colors">
                Our Location
              </a>
            </nav>
          </div>

          {/* Optional: link to booking or contact */}
          <div>
            <Link href="/location">
              <button className="bg-yellow-800 text-white text-md px-4 py-1 rounded-[2px] hover:bg-yellow-900 transition-colors font-medium shadow-xl">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}