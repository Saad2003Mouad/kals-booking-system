import Link from "next/link";
import { Calendar, IceCream, Truck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-4xl mx-auto">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <IceCream className="w-12 h-12 text-primary-600" />
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
        Book the Legend for <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
          Your Next Event
        </span>
      </h1>
      
      <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
        Reserve an Americano ice cream truck or a modern Sprinter van. Instant pricing, live availability, and seamless online booking.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link href="/booking" className="btn-primary flex items-center justify-center gap-2 text-lg">
          <Calendar className="w-5 h-5" />
          Start Booking
        </Link>
        <Link href="/admin" className="btn-secondary flex items-center justify-center gap-2 text-lg">
          <Truck className="w-5 h-5" />
          Driver/Admin Portal
        </Link>
      </div>
    </main>
  );
}
