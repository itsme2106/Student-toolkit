import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { Tool, tools } from '../data/tools';

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
  howItWorks?: React.ReactNode;
  example?: React.ReactNode;
  faq?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  toolId, 
  children, 
  howItWorks, 
  example, 
  faq 
}) => {
  const tool = tools.find(t => t.id === toolId);
  const location = useLocation();
  
  if (!tool) return <div>Tool not found</div>;

  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>{tool.name} | Student Toolkit</title>
        <meta name="description" content={tool.description} />
        <link rel="canonical" href={`https://studenttoolkit.com${location.pathname}`} />
        <meta property="og:title" content={`${tool.name} - Student Toolkit`} />
        <meta property="og:description" content={tool.description} />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-bold text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-comic-blue flex items-center gap-1">
          <HomeIcon className="w-4 h-4" /> Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/#${tool.category.split(' ')[0].toLowerCase()}`} className="hover:text-comic-blue">
          {tool.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-comic-dark">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl ${tool.color} border-[3px] border-comic-dark flex items-center justify-center shadow-[4px_4px_0px_#1E1E24]`}>
            <tool.icon className="w-8 h-8 text-comic-dark" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-comic-dark m-0">
            {tool.name}
          </h1>
        </div>
        <p className="text-xl font-bold text-gray-700 max-w-2xl">
          {tool.description}
        </p>
      </div>

      {/* Main Tool Area */}
      <div className="mb-16">
        {children}
      </div>

      {/* Explanatory Content */}
      <div className="space-y-12">
        {howItWorks && (
          <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
            <h2 className="font-display text-3xl mb-4 text-comic-blue drop-shadow-[2px_2px_0px_#1E1E24]">How It Works</h2>
            <div className="prose prose-lg font-bold text-gray-700 max-w-none">
              {howItWorks}
            </div>
          </section>
        )}

        {example && (
          <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
            <h2 className="font-display text-3xl mb-4 text-comic-green drop-shadow-[2px_2px_0px_#1E1E24]">Example</h2>
            <div className="prose prose-lg font-bold text-gray-700 max-w-none">
              {example}
            </div>
          </section>
        )}

        {faq && (
          <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
            <h2 className="font-display text-3xl mb-4 text-comic-red drop-shadow-[2px_2px_0px_#1E1E24]">FAQ</h2>
            <div className="prose prose-lg font-bold text-gray-700 max-w-none">
              {faq}
            </div>
          </section>
        )}
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mt-16 border-t-[3px] border-comic-dark pt-8">
          <h2 className="font-display text-3xl mb-6 text-comic-dark">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map(rt => (
              <Link key={rt.id} to={rt.slug} className="block group">
                <div className="bg-white border-[3px] border-comic-dark rounded-xl p-4 shadow-[4px_4px_0px_#1E1E24] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_#1E1E24] transition-all flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${rt.color} border-2 border-comic-dark flex items-center justify-center`}>
                    <rt.icon className="w-5 h-5 text-comic-dark" />
                  </div>
                  <span className="font-display text-xl">{rt.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
