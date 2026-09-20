import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { getToolsByCategory, Tool } from '../data/tools';
import { ArrowRight, Star } from 'lucide-react';

export const Home = () => {
  const categories = getToolsByCategory();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Student Toolkit",
    "url": "https://studenttoolkit.com/",
    "description": "Free academic survival tools for students: GPA & CGPA calculators, attendance planners, pass calculators, Pomodoro timer, and PDF utilities."
  };

  return (
    <>
      <Helmet>
        <title>Student Toolkit | Academic Calculators & Everyday Student Tools</title>
        <meta name="description" content="Free academic survival tools for students: GPA & CGPA calculators, attendance planners, pass calculators, Pomodoro timer, and PDF utilities." />
        <link rel="canonical" href="https://studenttoolkit.com/" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Student Toolkit" />
        <meta property="og:title" content="Student Toolkit | Academic Calculators & Everyday Student Tools" />
        <meta property="og:description" content="Free academic survival tools for students: GPA & CGPA calculators, attendance planners, pass calculators, Pomodoro timer, and PDF utilities." />
        <meta property="og:url" content="https://studenttoolkit.com/" />
        <meta property="og:image" content="https://studenttoolkit.com/favicon.svg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Student Toolkit | Academic Calculators & Everyday Student Tools" />
        <meta name="twitter:description" content="Free academic survival tools for students: GPA & CGPA calculators, attendance planners, pass calculators, Pomodoro timer, and PDF utilities." />
        <meta name="twitter:image" content="https://studenttoolkit.com/favicon.svg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-comic-light py-20 border-b-[3px] border-comic-dark">
        {/* Floating background elements for comic feel */}
        <div className="absolute top-10 left-10 text-comic-yellow animate-pulse" aria-hidden="true"><Star size={40} fill="currentColor" /></div>
        <div className="absolute bottom-20 right-10 text-comic-red animate-bounce" style={{animationDuration: '3s'}} aria-hidden="true"><Star size={30} fill="currentColor" /></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-6xl md:text-8xl text-comic-dark mb-6 drop-shadow-[4px_4px_0px_#FFD500]">
              STUDENT TOOLKIT
            </h1>
            <div className="inline-block bg-white border-[3px] border-comic-dark rounded-2xl p-4 mb-8 transform -rotate-2">
              <p className="font-display text-2xl text-comic-blue tracking-wide">
                Your academic adventure starts here!
              </p>
            </div>
            <p className="max-w-2xl mx-auto text-xl font-bold text-gray-700 mb-10 leading-relaxed">
              Smart, simple tools for marks, grades, attendance, studying and everyday student life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/#tools-grid" 
                className="comic-btn comic-btn-primary px-8 py-4 text-xl flex items-center gap-2"
              >
                Explore Tools <ArrowRight className="w-6 h-6" aria-hidden="true" />
              </Link>
              <Link 
                to="/tools/can-i-pass" 
                className="comic-btn comic-btn-secondary px-8 py-4 text-xl border-[3px] border-comic-dark"
              >
                I Need Help With My Marks
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16" id="tools-grid">
        {Object.entries(categories).map(([category, tools], idx) => {
          const catId = category.split(' ')[0].toLowerCase();
          const bgColors = ['bg-comic-yellow', 'bg-comic-green', 'bg-comic-red', 'bg-comic-blue'];
          const titleBg = bgColors[idx % bgColors.length];

          return (
            <div key={category} id={catId} className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <h2 className={`font-display text-4xl px-4 py-2 border-[3px] border-comic-dark rounded-xl shadow-[4px_4px_0px_#1E1E24] ${titleBg}`}>
                  {category}
                </h2>
                <div className="h-[3px] flex-grow bg-comic-dark rounded hidden sm:block opacity-20"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const Icon = tool.icon;
  return (
    <Link to={tool.slug} className="block group">
      <motion.div 
        className="comic-card h-full p-6 flex flex-col relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${tool.color} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
        
        <div className={`w-14 h-14 rounded-2xl ${tool.color} border-[3px] border-comic-dark flex items-center justify-center mb-4 shadow-[4px_4px_0px_#1E1E24] z-10`}>
          <Icon className="w-7 h-7 text-comic-dark" aria-hidden="true" />
        </div>
        
        <h3 className="font-display text-2xl mb-2 z-10">{tool.name}</h3>
        <p className="font-bold text-gray-600 flex-grow z-10">{tool.description}</p>
        
        <div className="mt-4 flex items-center font-bold text-comic-blue group-hover:text-comic-red transition-colors z-10">
          Open Tool <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
        </div>
      </motion.div>
    </Link>
  );
};
