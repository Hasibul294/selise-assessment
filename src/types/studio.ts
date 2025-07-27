export interface Studio {
  Id: number;
  Name: string;
  Type: string;
  Location: {
    City: string;
    Area: string;
    Address: string;
    Coordinates: {
      Latitude: number;
      Longitude: number;
    };
  };
  Contact: {
    Phone: string;
    Email: string;
  };
  Amenities: string[];
  Description: string;
  PricePerHour: number;
  Currency: string;
  Availability: {
    Open: string;
    Close: string;
  };
  Rating: number;
  Images: string[];
}

export interface StudiosData {
  Studios: Studio[];
}

export interface SearchFilters {
  location: string;
  radius: number;
  type: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  useCurrentLocation?: boolean;
}

export interface BookingFormData {
  date: string;
  timeSlot: string;
  userName: string;
  userEmail: string;
}

export interface Booking {
  id: string;
  studioId: number;
  studioName: string;
  studioType: string;
  studioLocation: {
    city: string;
    area: string;
    address: string;
  };
  date: string;
  timeSlot: string;
  userName: string;
  userEmail: string;
  bookingTime: string;
  totalPrice: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
