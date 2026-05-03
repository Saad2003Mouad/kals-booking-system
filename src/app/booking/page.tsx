import BookingForm from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <main className="flex-1 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Book Your Experience
        </h1>
        <p className="text-slate-600 text-lg">
          Fill out the details below to get an instant quote and check availability.
        </p>
      </div>

      <BookingForm />
    </main>
  );
}
