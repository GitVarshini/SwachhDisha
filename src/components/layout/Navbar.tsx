import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, switchRoleDemo } = useAuth();

  const navLinks = [
    { label: 'Waste Map', path: '/map' },
    { label: 'My Reports', path: '/my-reports' },
    { label: 'High-Risk Zones', path: '/high-risk' },
    { label: 'Awareness', path: '/awareness' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Sparkles className="w-4 h-4 text-emerald-100" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Swachh<span className="text-emerald-600">Disha</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors whitespace-nowrap hover:text-emerald-700 ${
                isActive(link.path)
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600 pb-0.5'
                  : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Waste Issue</span>
          </Link>

          {/* Quick Admin Access / Role Switcher */}
          {isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap border border-slate-200"
            >
              <span>Admin Login</span>
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg shadow-xs mb-3"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a Waste Issue</span>
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Demo Mode:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  switchRoleDemo('CITIZEN');
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded text-xs ${!isAdmin ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-600'}`}
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  switchRoleDemo('ADMIN');
                  setMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded text-xs ${isAdmin ? 'bg-indigo-100 text-indigo-800 font-medium' : 'text-slate-600'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
