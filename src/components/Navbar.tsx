import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Rocket } from 'lucide-react';
import { tools } from '../data/tools';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down (after initial 80px), show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTools = searchQuery.trim() 
    ? tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchSelect = (slug: string) => {
    navigate(slug);
    setSearchQuery('');
    setShowSearch(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`bg-white border-b-[3px] border-comic-dark sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-comic-yellow border-[3px] border-comic-dark rounded-xl flex items-center justify-center transform group-hover:-rotate-12 transition-transform">
                <Rocket className="text-comic-dark w-6 h-6" />
              </div>
              <span className="font-display text-2xl text-comic-dark tracking-wide">
                STUDENT TOOLKIT
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#marks" className="font-bold hover:text-comic-blue transition-colors">Marks</Link>
            <Link to="/#attendance" className="font-bold hover:text-comic-green transition-colors">Attendance</Link>
            <Link to="/#study" className="font-bold hover:text-comic-red transition-colors">Study</Link>
            <Link to="/#everyday" className="font-bold hover:text-comic-purple transition-colors">Tools</Link>
            
            <div className="relative">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 border-[3px] border-comic-dark rounded-full hover:bg-comic-yellow transition-colors"
                aria-label="Search tools"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {showSearch && (
                <div className="absolute right-0 mt-2 w-80 bg-white border-[3px] border-comic-dark rounded-xl shadow-[4px_4px_0px_#1E1E24] p-4">
                  <input
                    type="text"
                    placeholder="🔍 What do you need?"
                    className="comic-input w-full mb-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <div className="max-h-60 overflow-y-auto">
                      {filteredTools.length > 0 ? (
                        filteredTools.map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => handleSearchSelect(tool.slug)}
                            className="block w-full text-left p-2 hover:bg-gray-100 font-bold border-b border-gray-200 last:border-0"
                          >
                            {tool.name}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 font-bold p-2">No tools found.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 border-[3px] border-comic-dark rounded-full hover:bg-comic-yellow transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border-[3px] border-comic-dark rounded-md bg-white hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b-[3px] border-comic-dark px-4 py-4 space-y-4">
          <Link to="/#marks" onClick={() => setIsMenuOpen(false)} className="block font-bold text-lg hover:text-comic-blue">Marks & Grades</Link>
          <Link to="/#attendance" onClick={() => setIsMenuOpen(false)} className="block font-bold text-lg hover:text-comic-green">Attendance</Link>
          <Link to="/#study" onClick={() => setIsMenuOpen(false)} className="block font-bold text-lg hover:text-comic-red">Study</Link>
          <Link to="/#everyday" onClick={() => setIsMenuOpen(false)} className="block font-bold text-lg hover:text-comic-purple">Everyday Tools</Link>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b-[3px] border-comic-dark p-4 shadow-lg z-50">
          <input
            type="text"
            placeholder="🔍 What do you need?"
            className="comic-input w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <div className="max-h-60 overflow-y-auto bg-white border-2 border-comic-dark rounded-xl p-2">
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleSearchSelect(tool.slug)}
                    className="block w-full text-left p-3 hover:bg-gray-100 font-bold border-b border-gray-200 last:border-0"
                  >
                    {tool.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 font-bold p-2">No tools found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
