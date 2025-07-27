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

## 🔗 Links

- **GitHub Repository**: [https://github.com/Hasibul294/selise-assessment](https://github.com/Hasibul294/selise-assessment)
- **Live Demo**: [https://selise-assessment-ioex.vercel.app/]
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

**Built with ❤️ using Next.js 15 and React 19**
