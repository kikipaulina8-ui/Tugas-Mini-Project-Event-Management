import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verify_password: '',
    first_name: '',
    last_name: '',
    role: 'customer' as 'customer' | 'organizer',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.verify_password) {
      setError("Password requirements do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || err.response?.data?.message || 'Registration failed. Backend Error 500.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join Venuly today
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex gap-2">
              <input
                name="first_name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 sm:text-sm"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <input
                name="last_name"
                type="text"
                className="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 sm:text-sm"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="verify_password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 sm:text-sm"
                placeholder="Verify Password"
                value={formData.verify_password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <select
                name="role"
                className="appearance-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-purple-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">I am a Customer</option>
                <option value="organizer">I am an Organizer</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
