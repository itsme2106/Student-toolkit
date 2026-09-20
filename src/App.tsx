import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import ScrollToTop from './components/ScrollToTop';

// Tools
import { CanIPass } from './pages/tools/CanIPass';

import { AttendanceCalculator } from './pages/tools/AttendanceCalculator';
import { ClassesICanMiss } from './pages/tools/ClassesICanMiss';
import { GPACalculator } from './pages/tools/GPACalculator';
import { ClassesNeeded } from './pages/tools/ClassesNeeded';
import { CGPACalculator } from './pages/tools/CGPACalculator';

import { PercentageCalculator } from './pages/tools/PercentageCalculator';
import { PomodoroTimer } from './pages/tools/PomodoroTimer';
import { WordCounter } from './pages/tools/WordCounter';
import { QRGenerator } from './pages/tools/QRGenerator';
import { PDFTools } from './pages/tools/PDFTools';
import { PptToPdf } from './pages/tools/PptToPdf';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} />
            
            {/* Tools Routes */}
            <Route path="tools/can-i-pass" element={<CanIPass />} />
            <Route path="tools/attendance-calculator" element={<AttendanceCalculator />} />
            <Route path="tools/classes-i-can-miss" element={<ClassesICanMiss />} />
            <Route path="tools/classes-needed" element={<ClassesNeeded />} />
            <Route path="tools/cgpa-calculator" element={<CGPACalculator />} />
            <Route path="tools/gpa-calculator" element={<GPACalculator />} />
            <Route path="tools/percentage-calculator" element={<PercentageCalculator />} />

            <Route path="tools/pomodoro-timer" element={<PomodoroTimer />} />
            <Route path="tools/word-counter" element={<WordCounter />} />
            <Route path="tools/qr-generator" element={<QRGenerator />} />
            <Route path="tools/pdf-tools" element={<PDFTools />} />
            <Route path="tools/ppt-to-pdf" element={<PptToPdf />} />
            
            {/* Privacy Policy */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="privacy-policy/" element={<PrivacyPolicy />} />
            
            {/* 404 Fallback */}
            <Route path="*" element={
              <div className="text-center py-20">
                <Helmet>
                  <title>404 - Page Not Found | Student Toolkit</title>
                  <meta name="robots" content="noindex, follow" />
                </Helmet>
                <h1 className="font-display text-6xl text-comic-dark mb-4">404 - Not Found</h1>
                <p className="font-bold text-xl">The tool you are looking for doesn't exist (yet).</p>
                <Link to="/" className="inline-block mt-8 comic-btn comic-btn-primary px-6 py-3">Go Home</Link>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
