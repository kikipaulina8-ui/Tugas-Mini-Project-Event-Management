import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../hooks/useAuth';
import type { Event, Review } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Calendar, MapPin, Tag, Users, AlertCircle, ShoppingCart, Star } from 'lucide-react';
import { format } from 'date-fns';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Order state
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEventData();
    }
  }, [id]);

  const fetchEventData = async () => {
    setIsLoading(true);
    try {
        const [eventData, reviewsData] = await Promise.all([
          eventService.getEventDetail(id!),
          eventService.getEventReviews(id!)
        ]);
        setEvent(eventData);
        setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch event details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role === 'organizer') {
      alert("Organizers cannot buy tickets.");
      return;
    }

    setIsModalOpen(true);
  };

  const submitOrder = async () => {
    if (!event) return;
    setIsOrdering(true);
    setOrderError('');
    
    try {
      await transactionService.createOrder({
        event_id: event.id,
        quantity: quantity,
      });
      setIsModalOpen(false);
      navigate('/transactions');
    } catch (error: any) {
      setOrderError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
     return <div className="min-h-screen bg-slate-950 flex justify-center items-center p-8">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
     </div>;
  }

  if (!event) {
     return <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Event not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-purple-400 hover:underline">Go back home</button>
     </div>;
  }

  const isFree = !event.eventPaid || event.eventPrice === '0';
  const isSoldOut = event.capacity <= 0;

  // Intercept broken example.com images from backend
  const getDisplayImage = (url: string) => {
    if (!url || url.includes('example.com/event1')) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'; // Tech
    if (url.includes('example.com/event2')) return 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80'; // Music
    if (url.includes('example.com/event3')) return 'https://images.unsplash.com/photo-1515169065258-7460ebecd18e?w=1200&q=80'; // Meetup
    if (url.includes('example.com/event4')) return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80'; // Seminar
    return url;
  };
  const displayImage = getDisplayImage(event.image);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero section */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img 
          src={displayImage} 
          alt={event.name} 
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1200&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 mb-10 max-w-7xl mx-auto md:left-1/2 md:-translate-x-1/2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border tracking-wide uppercase ${
              event.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'
            }`}>
              {event.status}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{event.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
             <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-4">About this event</h2>
             <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {event.description}
             </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-white">{review.customer?.name || 'Anonymous User'}</span>
                          <span className="text-gray-500 text-sm ml-3">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-yellow-500">
                           <Star size={16} className="fill-current mr-1" />
                           <span className="font-bold">{review.rating}</span>/5
                        </div>
                     </div>
                     <p className="text-gray-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-gray-500 italic">No reviews yet for this event.</p>
            )}
          </div>
        </div>

        {/* Sidebar / Booking Card */}
        <div className="col-span-1">
           <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl sticky top-24">
              <div className="text-center mb-6 border-b border-slate-800 pb-6">
                 <p className="text-sm text-gray-400 mb-1">Ticket Price</p>
                 <p className={`text-4xl font-extrabold ${isFree ? 'text-green-400' : 'text-purple-400'}`}>
                    {isFree ? 'FREE' : `IDR ${Number(event.eventPrice).toLocaleString()}`}
                 </p>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex items-start text-gray-300">
                    <Calendar className="mt-1 mr-3 text-purple-500 flex-shrink-0" />
                    <div>
                       <p className="font-semibold text-white">Date & Time</p>
                       <p className="text-sm">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                       <p className="text-sm">{format(new Date(event.date), 'HH:mm')}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-start text-gray-300">
                    <MapPin className="mt-1 mr-3 text-purple-500 flex-shrink-0" />
                    <div>
                       <p className="font-semibold text-white">Location</p>
                       <p className="text-sm">{event.location}</p>
                    </div>
                 </div>

                 <div className="flex items-start text-gray-300">
                    <Users className="mt-1 mr-3 text-purple-500 flex-shrink-0" />
                    <div>
                       <p className="font-semibold text-white">Capacity</p>
                       <p className="text-sm">
                         {event.capacity} total capacity
                       </p>
                    </div>
                 </div>
              </div>

              <button
                onClick={handleBuyTicket}
                disabled={isSoldOut}
                className="w-full py-4 rounded-xl flex items-center justify-center font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
              >
                <ShoppingCart className="mr-2" size={20} />
                {isSoldOut ? 'Sold Out' : 'Get Tickets'}
              </button>
           </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Purchase Tickets"
        footer={
           <>
             <button
               onClick={() => setIsModalOpen(false)}
               className="px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition"
             >
               Cancel
             </button>
             <button
               onClick={submitOrder}
               disabled={isOrdering || quantity <= 0 || quantity > event.capacity}
               className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md disabled:opacity-50 flex items-center shadow-[0_0_10px_rgba(168,85,247,0.3)] transition"
             >
               {isOrdering && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>}
               Confirm Order
             </button>
           </>
        }
      >
        <div className="space-y-4">
          {orderError && (
             <div className="p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                {orderError}
             </div>
          )}
          
          <div className="flex justify-between items-center border-b border-slate-700 pb-4">
             <div>
                <h4 className="text-white font-semibold">{event.name}</h4>
                <p className="text-sm text-gray-400">{isFree ? 'Free Ticket' : `IDR ${Number(event.eventPrice).toLocaleString()}`}</p>
             </div>
          </div>

          <div className="flex justify-between items-center pt-2">
             <label className="text-gray-300 font-medium">Quantity</label>
             <div className="flex items-center space-x-3">
                <button 
                  className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="text-white font-bold text-xl">{quantity}</span>
                <button 
                  className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 disabled:opacity-50"
                  onClick={() => setQuantity(Math.min(event.capacity, quantity + 1))}
                  disabled={quantity >= event.capacity}
                >+</button>
             </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
             <span className="text-gray-400 text-lg">Total Amount</span>
             <span className="text-3xl font-bold text-purple-400">
               {isFree ? 'FREE' : `IDR ${(Number(event.eventPrice) * quantity).toLocaleString()}`}
             </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
