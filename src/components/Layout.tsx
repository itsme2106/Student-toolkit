import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white border-t-[3px] border-comic-dark py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-bold text-gray-600 mb-2">Student Toolkit</p>
          <p className="text-sm text-gray-500 font-bold mb-3">Your academic survival adventure.</p>
          <div className="flex justify-center items-center gap-4 text-sm font-bold text-gray-600">
            <Link to="/privacy-policy/" className="hover:text-comic-blue transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
