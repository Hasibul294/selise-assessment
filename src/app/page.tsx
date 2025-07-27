import Image from "next/image";
import StudiosList from "./components/StudiosList";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Studio Booking
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Book recording studios, photography studios, and event spaces with ease. 
            Find the perfect creative space for your next project.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Start Booking Now
          </button>
        </div>
      </section>

      {/* Studios List Section */}
      <StudiosList />
    </div>
  );
}
