import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { User as UserIcon, Upload, Gift, Star, Shield } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await profileService.updateProfile(formData);
      await checkAuth();
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formPayload = new FormData();
      formPayload.append('picture', e.target.files[0]);
      await profileService.updatePicture(formPayload);
      await checkAuth();
      setSuccess('Avatar updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white border-b border-slate-800 pb-4">My Profile</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
             {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
             {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / Photo Card */}
          <div className="col-span-1 border border-slate-800 rounded-xl p-6 bg-slate-900 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
             <div className="w-32 h-32 rounded-full bg-slate-800 flex justify-center items-center border-4 border-purple-500/30 overflow-hidden mb-4 relative group">
                {user.avatarUrl ? (
                   <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                   <UserIcon size={48} className="text-gray-500" />
                )}
                
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                   <Upload size={24} className="text-white mb-1" />
                   <span className="text-white text-xs font-semibold">Change</span>
                   <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isLoading} />
                </label>
             </div>
             
             <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
             <p className="text-gray-400 text-sm mb-4">{user.email}</p>
             
             <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold uppercase tracking-wider">
               <Shield size={14} />
               <span>{user.role}</span>
             </div>
          </div>

          {/* Details / Edit Form */}
          <div className="col-span-1 md:col-span-2 space-y-6">
             <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Personal Information</h3>
                    {!isEditing ? (
                       <button onClick={() => setIsEditing(true)} className="text-sm text-purple-400 hover:text-purple-300">Edit</button>
                    ) : (
                       <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                    )}
                 </div>

                 {!isEditing ? (
                    <div className="space-y-4 text-gray-300">
                       <div>
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-medium text-white">{user.name}</p>
                       </div>
                       <div>
                          <p className="text-sm text-gray-500 mb-1">Email Address</p>
                          <p className="font-medium text-white">{user.email}</p>
                       </div>
                    </div>
                 ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                       <div>
                          <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                          <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
                          />
                       </div>
                       <div>
                          <label className="block text-sm text-gray-400 mb-1">Email Address (Read-only)</label>
                          <input 
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md text-gray-500 cursor-not-allowed"
                          />
                       </div>
                       <button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition">
                          {isLoading ? 'Saving...' : 'Save Changes'}
                       </button>
                    </form>
                 )}
             </div>

             {user.role === 'customer' && (
                <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 shadow-xl grid md:grid-cols-2 gap-6">
                   <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex items-start space-x-4">
                      <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-500">
                         <Star size={24} />
                      </div>
                      <div>
                         <p className="text-sm text-yellow-500/80 font-bold mb-1 uppercase tracking-wide">My Points</p>
                         <p className="text-3xl font-extrabold text-yellow-500">{user.points?.toLocaleString() || 0}</p>
                      </div>
                   </div>

                   <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-start space-x-4">
                      <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
                         <Gift size={24} />
                      </div>
                      <div>
                         <p className="text-sm text-blue-500/80 font-bold mb-1 uppercase tracking-wide">Referral Code</p>
                         <div className="flex items-center space-x-2">
                           <code className="text-xl font-mono font-bold text-blue-400 bg-slate-950 px-2 py-1 rounded border border-blue-500/30">
                             {user.referralCode || 'N/A'}
                           </code>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
