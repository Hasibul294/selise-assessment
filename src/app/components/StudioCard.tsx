import React, { useState } from 'react';
import Image from 'next/image';
import { Studio } from '@/types/studio';
import BookingModal from './BookingModal';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

interface StudioCardProps {
  studio: Studio;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, userLocation }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Calculate distance if user location is available
  const distance = userLocation ? calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    studio.Location.Coordinates.Latitude,
    studio.Location.Coordinates.Longitude
  ) : null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Studio Image */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={"/default-image.webp"}
          alt={studio.Name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {studio.Type}
          </span>
        </div>
      </div>

      {/* Studio Info */}
      <div className="p-4">
        {/* Name and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {studio.Name}
          </h3>
          <div className="flex items-center ml-2">
            <div className="flex">{renderStars(studio.Rating)}</div>
            <span className="ml-1 text-sm text-gray-600">
              {studio.Rating}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">
            {studio.Location.City}, {studio.Location.Area}, {studio.Location.Address}
            {distance !== null && (
              <span className="ml-2 text-blue-600 font-medium">
                • {formatDistance(distance)} away
              </span>
            )}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center text-green-600 font-semibold mb-3">
          <span className="text-lg">৳{studio.PricePerHour}</span>
          <span className="text-sm text-gray-500 ml-1">/hour</span>
        </div>

        {/* Amenities */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Amenities:</h4>
          <div className="flex flex-wrap gap-1">
            {studio.Amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
              >
                {amenity}
              </span>
            ))}
            {studio.Amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                +{studio.Amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Hours:</span> {studio.Availability.Open} - {studio.Availability.Close}
        </div>

        {/* Book Now Button */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Book Now
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        studio={studio}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default StudioCard;
