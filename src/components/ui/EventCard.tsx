import React from 'react';
import type { Event } from '../../types';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isFree = !event.eventPaid || event.eventPrice === '0' || !event.eventPrice;

  // Intercept broken example.com images from backend and swap with realistic Unsplash images
  const getDisplayImage = (url: string) => {
    if (!url || url.includes('example.com/event1')) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'; // Tech
    if (url.includes('example.com/event2')) return 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80'; // Music
    if (url.includes('example.com/event3')) return 'https://images.unsplash.com/photo-1515169065258-7460ebecd18e?w=800&q=80'; // Meetup
    if (url.includes('example.com/event4')) return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80'; // Seminar
    return url;
  };

  const displayImage = getDisplayImage(event.image);

  return (
    <Link to={`/event/${event.id}`} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition duration-300 flex flex-col h-full">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={displayImage} 
          alt={event.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80'; }}
        />
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/10">
          {isFree ? 'FREE' : `IDR ${Number(event.eventPrice).toLocaleString()}`}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {event.name}
        </h3>
        
        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={16} className="mr-2 text-purple-500" />
            <span>{format(new Date(event.date), 'MMM dd, yyyy - HH:mm')}</span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin size={16} className="mr-2 text-purple-500" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <Tag size={16} className="mr-2 text-purple-500" />
            <span>Capacity: {event.capacity} seats</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
