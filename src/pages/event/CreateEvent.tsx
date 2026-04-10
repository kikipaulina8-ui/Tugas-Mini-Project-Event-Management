import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Upload } from 'lucide-react';

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    totalSeats: '',
    isPaid: false,
    status: 'active' as 'active' | 'inactive' | 'draft'
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPosterFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, (formData as any)[key]);
      });
      
      if (posterFile) {
        payload.append('posterUrl', posterFile);
      } else {
        throw new Error("Poster image is required");
      }

      await eventService.createEvent(payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Create New Event</h1>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
             <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTextChange}
                  className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter a catchy title"
                />
             </div>

             <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleTextChange}
                  className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Describe your event..."
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-300">Date & Time</label>
                <input
                  type="datetime-local"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleTextChange}
                  className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 [&::-webkit-calendar-picker-indicator]:filter-invert"
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleTextChange}
                  className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Venue or Online link"
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-300">Total Seats / Capacity</label>
                <input
                  type="number"
                  name="totalSeats"
                  required
                  min="1"
                  value={formData.totalSeats}
                  onChange={handleTextChange}
                  className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g. 100"
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-300">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleTextChange}
                  className="mt-1 block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="active">Active (Published)</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
             </div>

             <div className="sm:col-span-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isPaid"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleTextChange}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 bg-slate-700"
                  />
                  <label htmlFor="isPaid" className="ml-2 block text-sm font-medium text-white">
                    This is a paid event
                  </label>
                </div>
                
                {formData.isPaid && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-300">Ticket Price (IDR)</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Rp</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        required={formData.isPaid}
                        min="0"
                        value={formData.price}
                        onChange={handleTextChange}
                        className="block w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
             </div>

             <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Poster Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 hover:border-purple-500 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-purple-500 flex-shrink-0" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold text-white">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">{posterFile ? posterFile.name : 'PNG, JPG or WEBP (MAX. 5MB)'}</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
             <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-md font-bold text-lg disabled:opacity-50 transition shadow-[0_0_15px_rgba(168,85,247,0.3)] flex justify-center items-center"
             >
                {isLoading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></span>}
                Create Event
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
