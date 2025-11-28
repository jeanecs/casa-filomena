import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookingForm } from '../components/BookingForm';
import { Bed, Bath, Users, Wifi, Car, Calendar } from 'lucide-react';
import { Villa } from '../../prisma/data/villas';
import { Booking } from '../../prisma/data/bookings';

interface VillaCardProps {
  villa: Villa;
  onBookingSubmit?: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
}

export function VillaCard({ villa, onBookingSubmit }: VillaCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleBookingSubmit = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    if (onBookingSubmit) {
      onBookingSubmit(booking);
    }
    setIsBookingOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-64">
          <ImageWithFallback
            src={villa.image}
            alt={villa.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-800">
              From $650/night
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">{villa.name}</h3>
            <p className="text-gray-600 line-clamp-2">{villa.description}</p>
          </div>

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{villa.bedrooms} bed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{villa.bathrooms} bath</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{villa.guests} guests</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {(typeof villa.amenities === "string" 
                ? villa.amenities.split(",") 
                : villa.amenities
              ).map((amenity: string) => (
                <Badge key={amenity} variant="secondary" className="flex items-center space-x-1">
                  {getAmenityIcon(amenity.trim())}
                  <span>{amenity.trim()}</span>
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            className="w-full bg-yellow-800 text-white text-md px-6 py-3 rounded-lg hover:bg-yellow-900 transition-colors font-medium shadow-md font-serifDisplay" 
            onClick={() => setIsBookingOpen(true)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </CardContent>
      </Card>

      <BookingForm
        villa={villa}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSubmit={handleBookingSubmit}
      />
    </>
  );
}