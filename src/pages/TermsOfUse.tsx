import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Home as HomeIcon } from 'lucide-react';

export const TermsOfUse: React.FC = () => {
  const pageTitle = "Terms of Use | Student Toolkit";
  const pageDescription = "Read the Terms of Use for Student Toolkit, covering website usage, educational purposes, tool accuracy, and user responsibilities.";
  const canonicalUrl = "https://studentstool.online/terms-of-use/";

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
        <span className="text-comic-dark">Terms of Use</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-comic-yellow border-[3px] border-comic-dark flex items-center justify-center shadow-[4px_4px_0px_#1E1E24]">
            <FileText className="w-8 h-8 text-comic-dark" aria-hidden="true" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-comic-dark m-0">
            TERMS OF USE
          </h1>
        </div>
        <p className="text-xl font-bold text-gray-700 max-w-2xl">
          Guidelines and terms for using Student Toolkit and its educational tools.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Section 1: Acceptance & General Use */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-blue drop-shadow-[2px_2px_0px_#1E1E24]">
            1. General Use of the Website
          </h2>
          <p className="font-bold text-gray-700 leading-relaxed">
            By accessing or using Student Toolkit (accessible via studentstool.online), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please discontinue use of the website. Student Toolkit is provided free of charge for personal and non-commercial educational use by students, educators, and lifelong learners.
          </p>
        </section>

        {/* Section 2: Educational Purpose */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-green drop-shadow-[2px_2px_0px_#1E1E24]">
            2. Educational & Informational Purpose
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              The calculators, estimation utilities, study timers, and document tools provided on Student Toolkit (including but not limited to GPA, CGPA, Attendance, Pass Requirement, Pomodoro, and PDF utilities) are designed strictly for general educational and informational purposes.
            </p>
            <p>
              These tools provide estimations based on the data and grading criteria you input. They do not constitute official academic counsel, formal institutional evaluation, or binding academic records.
            </p>
          </div>
        </section>

        {/* Section 3: Tool Accuracy & User Responsibility */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-red drop-shadow-[2px_2px_0px_#1E1E24]">
            3. Tool Accuracy & User Responsibility
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              While we strive to provide reliable and mathematically accurate algorithms, grading scales, rounding rules, passing requirements, and attendance policies vary widely among schools, colleges, and universities.
            </p>
            <p>
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Verifying your institution’s specific grading scale, credit system, and attendance regulations.</li>
              <li>Confirming calculation results against your official student handbook, syllabus, or academic registry.</li>
              <li>Ensuring accurate input of grades, credits, attendance hours, and other values.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Acceptable Use & Prohibited Misuse */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-purple drop-shadow-[2px_2px_0px_#1E1E24]">
            4. Acceptable Use & Prohibited Misuse
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              You agree to use Student Toolkit lawfully and with respect for the service and other users. You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Use any automated scraping, crawling, or data extraction scripts that degrade website performance.</li>
              <li>Attempt to circumvent, interfere with, or compromise the security or functionality of the website.</li>
              <li>Upload malicious code, corrupted files, or inappropriate content through any document or QR generation tools.</li>
              <li>Use the website for any unlawful, deceptive, or unauthorized commercial activity.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Intellectual Property */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-yellow drop-shadow-[2px_2px_0px_#1E1E24]">
            5. Intellectual Property & Content Ownership
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              The original design, logos, graphics, brand identity, user interface components, and software code comprising Student Toolkit are protected by copyright and intellectual property laws.
            </p>
            <p>
              Documents, text, and inputs you process through our tools (such as presentations or PDFs) remain entirely your property. All processing is carried out locally within your browser and is not retained or claimed by Student Toolkit.
            </p>
          </div>
        </section>

        {/* Section 6: Third-Party Services & Analytics */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-blue drop-shadow-[2px_2px_0px_#1E1E24]">
            6. Third-Party Services & Analytics
          </h2>
          <p className="font-bold text-gray-700 leading-relaxed">
            Student Toolkit may utilize third-party web analytics tools (such as Google Analytics) to monitor aggregate traffic and improve tool performance. Your use of the website is also governed by our Privacy Policy, which details how analytical data and cookies are handled.
          </p>
        </section>

        {/* Section 7: Website Availability & Modifications */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-green drop-shadow-[2px_2px_0px_#1E1E24]">
            7. Service Availability & Modifications
          </h2>
          <p className="font-bold text-gray-700 leading-relaxed">
            We continuously improve Student Toolkit and may add, alter, or discontinue specific tools, features, or pages at any time without prior notice. While we strive for continuous uptime, we do not guarantee uninterrupted or error-free service availability.
          </p>
        </section>

        {/* Section 8: Limitation of Liability */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-red drop-shadow-[2px_2px_0px_#1E1E24]">
            8. Limitation of Liability & "As-Is" Disclaimer
          </h2>
          <div className="space-y-4 font-bold text-gray-700 leading-relaxed">
            <p>
              Student Toolkit is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
            </p>
            <p>
              In no event shall Student Toolkit or its maintainers be held liable for any direct, indirect, incidental, or consequential damages resulting from your use of the tools, reliance on calculation outputs, academic grading outcomes, attendance penalties, or temporary unavailability of the website.
            </p>
          </div>
        </section>

        {/* Section 9: Changes to These Terms */}
        <section className="bg-white border-[3px] border-comic-dark rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#1E1E24]">
          <h2 className="font-display text-2xl md:text-3xl mb-4 text-comic-purple drop-shadow-[2px_2px_0px_#1E1E24]">
            9. Changes to These Terms
          </h2>
          <p className="font-bold text-gray-700 leading-relaxed">
            We reserve the right to revise or update these Terms of Use at any time. Any changes will be posted on this page with an updated reference date. Continued use of Student Toolkit after updates are published signifies your acceptance of the amended terms.
          </p>
        </section>
      </div>
    </div>
  );
};
