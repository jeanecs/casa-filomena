import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site name */}
          <div className="flex items-center space-x-8">
            <a
                href="./"
              >
                <h1 className="text-2xl font-bold text-gray-900">Casa Filomena</h1>
              </a>
            <nav className="hidden md:flex space-x-6">
              <a href="/villas" className="text-gray-700 hover:text-gray-900 transition-colors">
                Villas
              </a>
              <a href="#bulletin" className="text-gray-700 hover:text-gray-900 transition-colors">
                Bulletin
              </a>
              <a href="#map" className="text-gray-700 hover:text-gray-900 transition-colors">
                Resort Map
              </a>
            </nav>
          </div>

          {/* Optional: link to booking or contact */}
          <div>
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
