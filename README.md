# Studio Booking Application

A modern, full-featured studio booking platform built with Next.js 15, React 19, and TypeScript. This application allows users to search, filter, and book various types of studios including recording studios, photography studios, rehearsal spaces, and art studios.

## 🌟 Features

### 🔍 Advanced Search & Filtering

- **Real-time Search**: Instant search results as you type
- **Auto-complete**: Smart suggestions with studio counts
- **Location-based Search**: Use current location with radius filtering (5km - 50km)
- **Multiple Filters**: Filter by studio type, price range, and ratings
- **Responsive Design**: Works seamlessly on all devices

### 📍 Location Services

- **GPS Integration**: Automatic location detection with error handling
- **Distance Calculation**: Shows distance from user to each studio
- **Radius Search**: Find studios within specified distance
- **Graceful Fallbacks**: Manual area search when location access is denied

### 🎯 Studio Management

- **Comprehensive Listings**: 55+ studios with detailed information
- **Rich Studio Profiles**: Images, amenities, ratings, and pricing
- **Real-time Availability**: Live availability checking
- **Studio Details**: Operating hours, contact info, and descriptions

### 📅 Booking System

- **Interactive Booking Modal**: Professional booking interface
- **Date & Time Selection**: Flexible time picker with validation
- **Real-time Availability**: Live slot availability checking
- **Form Validation**: Comprehensive input validation and error handling
- **Booking Confirmation**: Detailed confirmation with booking ID
- **Local Storage**: Persistent booking data

### 📊 Booking Management

- **Bookings Dashboard**: View all bookings with detailed information
- **Filtering Options**: Filter by all, upcoming, or past bookings
- **Search Functionality**: Search bookings by studio name or user
- **Booking Details**: Modal view with complete booking information
- **Statistics**: Quick overview of booking counts

### 🎨 User Interface

- **Modern Design**: Clean, professional Tailwind CSS styling
- **Active Navigation**: Highlighted current page indicators
- **Loading States**: Smooth loading indicators and animations
- **Error Handling**: User-friendly error messages and recovery options
- **Accessibility**: ARIA labels and keyboard navigation support

### 📱 Responsive Experience

- **Mobile Optimized**: Touch-friendly interface for mobile devices
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Fast Performance**: Optimized bundle size and lazy loading

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.4 (App Router)
- **Frontend**: React 19.1.0, TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Data Storage**: localStorage for booking persistence
- **Geolocation**: Browser Geolocation API
- **Icons**: Heroicons (SVG)
- **Image Optimization**: Next.js Image component
- **Build Tool**: Turbopack (Next.js)

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hasibul294/selise-assessment.git
   cd selise-assessment/studio-booking-application
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable React components
│   │   ├── Header.tsx       # Navigation header with active links
│   │   ├── Footer.tsx       # Site footer
│   │   ├── SearchBar.tsx    # Advanced search with location services
│   │   ├── StudiosList.tsx  # Studio listings with filtering
│   │   ├── StudioCard.tsx   # Individual studio display
│   │   └── BookingModal.tsx # Booking interface
│   ├── about/               # About Us page
│   ├── contact/             # Contact Us page
│   ├── bookings/            # Bookings management page
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── constants/
│   └── navLinks.ts          # Navigation configuration
├── data/
│   └── studios.ts           # Studio data (55+ studios)
├── types/
│   └── studio.ts            # TypeScript interfaces
└── utils/
    ├── bookingUtils.ts      # Booking management utilities
    └── locationUtils.ts     # Geolocation utilities
```

## 🎯 Usage Guide

### Basic Search

1. **Text Search**: Type area names (e.g., "Gulshan", "Dhanmondi") for auto-complete suggestions
2. **Location Search**: Click "Use Current Location" to find nearby studios
3. **Filters**: Use radius, studio type, price range, and rating filters
4. **Reset**: Click "Reset" to clear all filters

### Booking a Studio

1. Click "Book Now" on any studio card
2. Select your preferred date and time
3. Enter your contact information
4. Confirm your booking
5. Save your booking confirmation details

### Managing Bookings

1. Navigate to "Booking" page in the header
2. View all your bookings with filtering options
3. Search bookings by studio name or user
4. Click on any booking for detailed information

### Location Features

1. **Enable Location**: Click "Use Current Location" button
2. **Allow Access**: Grant location permission when prompted
3. **View Results**: Studios sorted by distance with radius filtering
4. **Fallback**: Use manual area search if location access is denied

## 🔧 Configuration

### Studio Data

Studios are configured in `src/data/studios.ts` with the following structure:

```typescript
interface Studio {
  Id: number;
  Name: string;
  Type: string;
  Location: {
    City: string;
    Area: string;
    Address: string;
    Coordinates: { Latitude: number; Longitude: number };
  };
  Contact: { Phone: string; Email: string };
  Amenities: string[];
  Description: string;
  PricePerHour: number;
  Currency: string;
  Availability: { Open: string; Close: string };
  Rating: number;
  Images: string[];
}
```

### Adding New Studios

1. Add studio data to `src/data/studios.ts`
2. Ensure all required fields are included
3. Add appropriate coordinates for location-based search

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Geolocation**: Requires HTTPS in production for location services
- **JavaScript**: Progressive enhancement - basic functionality without JS

## 📱 Mobile Features

- **Touch Optimized**: Large touch targets and gesture support
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Mobile Navigation**: Collapsible mobile menu
- **Touch Gestures**: Swipe and tap interactions

## 🔒 Privacy & Security

- **Location Data**: Not stored permanently, only used for search
- **User Data**: Booking information stored locally in browser
- **No Tracking**: No third-party analytics or tracking
- **Secure**: HTTPS required for location services in production

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Manual Deployment

1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Ensure HTTPS for location features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the Selise Assessment and is for educational/evaluation purposes.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Ensure location services are enabled for location-based search
3. Try clearing browser cache and localStorage
4. Contact: [Your Contact Information]

## 🔗 Links

- **GitHub Repository**: [https://github.com/Hasibul294/selise-assessment](https://github.com/Hasibul294/selise-assessment)
- **Live Demo**: [Add your deployment URL]
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

**Built with ❤️ using Next.js 15 and React 19**
