"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Truck, Clock, MapPin, Users, CalendarDays } from "lucide-react";

type Step = 1 | 2 | 3;

const PACKAGES = [
  { id: 'p1', name: 'Classic Truck', type: 'TRUCK', duration: 45, price: 250, desc: 'Includes up to 50 servings.' },
  { id: 'p2', name: 'Premium Truck', type: 'TRUCK', duration: 60, price: 350, desc: 'Includes up to 100 servings.' },
  { id: 'p3', name: 'Van Express', type: 'VAN', duration: 45, price: 300, desc: 'Sleek sprinter van, up to 75 servings.' },
];

export default function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    city: '',
    zip: '',
    guests: 50,
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [quote, setQuote] = useState<any>(null);
  const [availability, setAvailability] = useState<any>(null);

  const handleNext = async () => {
    if (step === 2) {
      setLoading(true);
      try {
        // 1. Check Availability
        const availRes = await fetch('/api/availability', {
          method: 'POST',
          body: JSON.stringify({
            date: formData.date,
            startTime: formData.time,
            durationMins: selectedPkg.duration,
            vehicleType: selectedPkg.type
          })
        });
        const availData = await availRes.json();
        setAvailability(availData);

        // 2. Get Quote
        // Mock distance calculation: random between 5 and 40 miles
        const mockDistance = Math.floor(Math.random() * 35) + 5; 
        
        const quoteRes = await fetch('/api/quotes', {
          method: 'POST',
          body: JSON.stringify({
            basePrice: selectedPkg.price,
            durationMins: selectedPkg.duration, // requested duration (assuming same as pkg for MVP)
            packageDurationMins: selectedPkg.duration,
            distanceMiles: mockDistance,
            guests: formData.guests
          })
        });
        const quoteData = await quoteRes.json();
        setQuote(quoteData.quote);
        
        setStep(3);
      } catch (err) {
        console.error(err);
        alert('Error calculating quote.');
      } finally {
        setLoading(false);
      }
    } else {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step >= s ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-16 sm:w-32 h-1 mx-2 transition-all ${step > s ? 'bg-primary-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="card-premium p-6 sm:p-10">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Truck className="text-primary-500"/> Select Service Package</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedPkg?.id === pkg.id ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-slate-200 hover:border-primary-300'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                    <span className="font-semibold text-primary-700">${pkg.price}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{pkg.desc}</p>
                  <div className="flex gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {pkg.duration}m</span>
                    <span className="flex items-center gap-1"><Truck className="w-4 h-4"/> {pkg.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                disabled={!selectedPkg}
                onClick={handleNext}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next Details <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CalendarDays className="text-primary-500"/> Event Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label-premium">Date</label>
                <input type="date" className="input-premium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="label-premium">Start Time</label>
                <input type="time" className="input-premium" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-premium">Event Address</label>
                <input type="text" placeholder="123 Main St" className="input-premium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="label-premium">City</label>
                <input type="text" placeholder="Boston" className="input-premium" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="label-premium">ZIP Code</label>
                <input type="text" placeholder="02151" className="input-premium" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
              </div>
              <div>
                <label className="label-premium">Estimated Guests</label>
                <input type="number" className="input-premium" value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})} />
              </div>
            </div>
            
            <hr className="my-8 border-slate-100" />
            
            <h2 className="text-xl font-bold mb-4">Contact Info</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-premium">Full Name</label>
                <input type="text" className="input-premium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="label-premium">Email</label>
                <input type="email" className="input-premium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="label-premium">Phone</label>
                <input type="tel" className="input-premium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-slate-500 font-medium hover:text-slate-800 transition-colors">Back</button>
              <button 
                disabled={loading || !formData.date || !formData.time || !formData.address || !formData.name || !formData.email}
                onClick={handleNext}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Calculating...' : 'Get Quote'} <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}

        {step === 3 && quote && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold">Your Custom Quote</h2>
              <p className="text-slate-500 mt-2">Please review your pricing and availability below.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="font-semibold text-lg">{selectedPkg.name}</span>
                <span className="font-medium">${quote.basePrice.toFixed(2)}</span>
              </div>
              
              {quote.guestFee > 0 && (
                <div className="flex justify-between items-center mb-2 text-slate-600">
                  <span>Extra Guest Fee (>50)</span>
                  <span>${quote.guestFee.toFixed(2)}</span>
                </div>
              )}
              
              {quote.travelFee > 0 && (
                <div className="flex justify-between items-center mb-2 text-slate-600">
                  <span>Travel Fee ({quote.distanceMiles} miles)</span>
                  <span>${quote.travelFee.toFixed(2)}</span>
                </div>
              )}

              {quote.overtimeFee > 0 && (
                <div className="flex justify-between items-center mb-2 text-slate-600">
                  <span>Overtime Fee</span>
                  <span>${quote.overtimeFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                <span className="font-bold text-xl">Total</span>
                <span className="font-bold text-2xl text-primary-600">${quote.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {availability?.available ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-8 flex gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Great news!</h4>
                  <p className="text-sm mt-1">We have a {selectedPkg.type.toLowerCase()} available for your date and time.</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-8">
                <h4 className="font-bold">Currently Unavailable</h4>
                <p className="text-sm mt-1">We do not have a {selectedPkg.type.toLowerCase()} available for the selected time. You can still submit a request, and we will contact you with options.</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button onClick={() => setStep(2)} className="text-slate-500 font-medium hover:text-slate-800 transition-colors">Back</button>
              <button className="btn-primary flex items-center gap-2">
                Proceed to Checkout <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
