import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import type { Event } from '../../types';
import { EventCard } from '../../components/ui/EventCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { useDebounce } from '../../hooks/useDebounce';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, free, paid
  
  const debouncedSearch = useDebounce(search, 500);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      if (filterType === 'active') {
        params.status = 'active';
      }

      let data = await eventService.getEvents(params);
      
      if (filterType === 'free') {
        data = data.filter(e => !e.eventPaid || e.eventPrice === '0');
      } else if (filterType === 'paid') {
        data = data.filter(e => e.eventPaid && e.eventPrice !== '0');
      }
      
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [debouncedSearch, filterType]);

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 pt-16 pb-32 border-b border-purple-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Amazing Events</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Find and book the best events happening right now.
          </p>
          
          <SearchBar 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Filters */}
        <div className="bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-800 flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
          >
            All Events
          </button>
          <button 
            onClick={() => setFilterType('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'active' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
          >
            Active Only
          </button>
          <button 
            onClick={() => setFilterType('free')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'free' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
          >
            Free
          </button>
          <button 
            onClick={() => setFilterType('paid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'paid' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
          >
            Paid
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
