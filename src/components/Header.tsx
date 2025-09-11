import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, User } from 'lucide-react';

interface HeaderProps {
  currentLocation?: string;
  onLocationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLocation = "New York, NY", onLocationClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TC</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">Tennis Courts</span>
            </Link>
            
            <button
              onClick={onLocationClick}
              className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MapPin size={16} />
              <span>{currentLocation}</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Find Courts
            </Link>
            <Link to="/favorites" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Favorites
            </Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              My Bookings
            </Link>
            <Link
              to="/account"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User size={18} />
              <span>Account</span>
            </Link>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container py-4 space-y-3">
            <button
              onClick={onLocationClick}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors w-full"
            >
              <MapPin size={16} />
              <span>{currentLocation}</span>
            </button>
            
            <nav className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Find Courts
              </Link>
              <Link
                to="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Favorites
              </Link>
              <Link
                to="/bookings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                My Bookings
              </Link>
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <User size={18} />
                <span>Account</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;