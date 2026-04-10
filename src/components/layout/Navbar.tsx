import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">
                Venuly
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition">Events</Link>
            
            {isAuthenticated && user ? (
              <>
                {user.role === 'organizer' && (
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
                )}
                {user.role === 'organizer' && (
                  <Link to="/create-event" className="text-gray-300 hover:text-white transition">Create Event</Link>
                )}
                <Link to="/transactions" className="text-gray-300 hover:text-white transition">Transactions</Link>
                
                <div className="relative group ml-4 flex items-center">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex justify-center items-center border border-purple-500/50 overflow-hidden">
                      {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon size={16} />}
                    </div>
                    <span>{user.name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    <div className="bg-slate-800 rounded-md shadow-lg py-1 border border-slate-700">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">Profile</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300">
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-4 items-center pl-4 border-l border-slate-700">
                <Link to="/login" className="text-gray-300 hover:text-white transition">Log in</Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Events</Link>
            
            {isAuthenticated && user ? (
              <>
                {user.role === 'organizer' && (
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Dashboard</Link>
                )}
                {user.role === 'organizer' && (
                  <Link to="/create-event" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Create Event</Link>
                )}
                <Link to="/transactions" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Transactions</Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800">Log in</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-purple-400 hover:text-purple-300 hover:bg-slate-800">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
