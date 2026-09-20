import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Home as HomeIcon } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const pageTitle = "Privacy Policy | Student Toolkit";
  const pageDescription = "Learn how Student Toolkit handles website analytics, cookies, and data privacy.";
  const canonicalUrl = "https://studentstool.online/privacy-policy/";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Student Toolkit" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://studentstool.online/favicon.svg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://studentstool.online/favicon.svg" />
      </Helmet>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-bold text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-comic-blue flex items-center gap-1">
          <HomeIcon className="w-4 h-4" aria-hidden="true" /> Home
        </Link>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
        <span className="text-comic-dark">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-comic-blue border-[3px] border-comic-dark flex items-center justify-center shadow-[4px_4px_0px_#1E1E24]">
            <ShieldCheck className="w-8 h-8 text-comic-dark" aria-hidden="true" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-comic-dark m-0">
            PRIVACY POLICY
          </h1>
        </div>
        <p className="text-xl font-bold text-gray-700 max-w-2xl">
          Transparency and privacy for everyone using Student Toolkit.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Section 1: About */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-blue drop-shadow-[2px_2px_0px_#1E1E24]">
            1. What is Student Toolkit?
          </h2>
          <p className="font-bold text-gray-700 leading-relaxed">
            Student Toolkit is a web-based suite of smart, simple tools designed to assist students with marks, grades, attendance tracking, study sessions, and everyday academic tasks. Most calculations and tool operations run entirely within your web browser.
          </p>
        </section>

        {/* Section 2: Information Collected */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-green drop-shadow-[2px_2px_0px_#1E1E24]">
            2. Information We May Collect
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              When you use Student Toolkit, information may be collected in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <span className="text-comic-dark">Tool Inputs & Local State:</span> Academic information, grades, attendance records, or documents you enter into our tools are processed locally in your browser.
              </li>
              <li>
                <span className="text-comic-dark">Website Analytics & Usage Data:</span> Standard technical and behavioral usage information may be collected as you navigate through our pages.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Google Analytics */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-red drop-shadow-[2px_2px_0px_#1E1E24]">
            3. Google Analytics & Cookies
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              We may use Google Analytics, a web analysis service provided by Google LLC, to help us understand how users discover and interact with the website.
            </p>
            <p>
              Google Analytics may collect website usage information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Pages and tools visited</li>
              <li>Traffic sources, referring sites, and navigation paths</li>
              <li>Device and browser information (such as operating system, browser type, and screen resolution)</li>
              <li>General user interactions, session duration, and approximate geographic region (e.g. city/country level)</li>
            </ul>
            <p>
              Google Analytics may use cookies or similar tracking technologies to gather this data. Cookies are small text files stored on your device that allow analysis of your site usage. Appropriate cookie consent will be obtained where legally required. You can adjust your browser settings to decline or delete cookies at any time.
            </p>
          </div>
        </section>

        {/* Section 4: How We Use Analytics Data */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-purple drop-shadow-[2px_2px_0px_#1E1E24]">
            4. Purpose of Analytics Information
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              Analytics information is used to understand website usage and improve Student Toolkit.
            </p>
            <p>
              Student Toolkit does not intentionally send personally identifiable information (such as your name, personal email address, or physical address) to Google Analytics.
            </p>
          </div>
        </section>

        {/* Section 5: Third-Party Services */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-yellow drop-shadow-[2px_2px_0px_#1E1E24]">
            5. Third-Party Services
          </h2>
          <p className="font-bold text-gray-700 leading-relaxed">
            Third-party services may process information according to their own privacy policies.
          </p>
        </section>
      </div>
    </div>
  );
};
