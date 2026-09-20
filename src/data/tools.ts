import { Calculator, Calendar, FileText, Percent, CheckCircle, GraduationCap, Timer, Hash, QrCode, TrendingUp, AlertTriangle, Presentation } from 'lucide-react';

export type Category = 'Marks & Grades' | 'Attendance' | 'Study' | 'Everyday Tools';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  icon: any; // We'll just pass the Lucide component
  color: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedToolIds?: string[];
  faqItems?: FAQItem[];
}

export const tools: Tool[] = [
  {
    id: 'can-i-pass',
    name: 'Can I Pass?',
    slug: '/tools/can-i-pass',
    description: 'Find out exactly how many marks you need in your final exam to pass.',
    category: 'Marks & Grades',
    icon: GraduationCap,
    color: 'bg-comic-yellow',
    seoTitle: 'Can I Pass? Exam Final Marks Calculator | Student Toolkit',
    seoDescription: 'Find out exactly what score or percentage you need on your final exam to pass your course. Supports points-based and weighted syllabus calculations.',
    relatedToolIds: ['gpa-calculator', 'percentage-calculator', 'classes-needed'],
    faqItems: [
      {
        question: 'What is the difference between Points and Weighted?',
        answer: 'Use Points / Marks if your professor grades on raw scores (e.g., 30/50 on midterms, final out of 50). Use Weighted % if your syllabus specifies percentages like "Midterm 60%, Final 40%".'
      },
      {
        question: 'What if my school requires a separate final exam cutoff?',
        answer: 'Some universities require both an overall pass and an independent minimum (like 35% on the final exam itself). Be sure to check your course syllabus for any separate sub-minimums!'
      }
    ]
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    slug: '/tools/cgpa-calculator',
    description: 'Calculate your Cumulative Grade Point Average easily.',
    category: 'Marks & Grades',
    icon: TrendingUp,
    color: 'bg-comic-blue',
    seoTitle: 'CGPA Calculator - Cumulative Grade Point Average | Student Toolkit',
    seoDescription: 'Calculate your Cumulative Grade Point Average (CGPA) quickly across all college or university semesters with semester GPAs and credit hours.',
    relatedToolIds: ['gpa-calculator', 'percentage-calculator', 'can-i-pass']
  },
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    slug: '/tools/gpa-calculator',
    description: 'Calculate your Grade Point Average from letter grades.',
    category: 'Marks & Grades',
    icon: Calculator,
    color: 'bg-comic-red',
    seoTitle: 'GPA Calculator - College & High School Grade Calculator | Student Toolkit',
    seoDescription: 'Calculate your college or high school GPA on a 4.0 scale. Enter course letter grades and credits to find your semester Grade Point Average instantly.',
    relatedToolIds: ['cgpa-calculator', 'percentage-calculator', 'can-i-pass']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: '/tools/percentage-calculator',
    description: 'Quickly calculate percentages for marks or everyday use.',
    category: 'Marks & Grades',
    icon: Percent,
    color: 'bg-comic-green',
    seoTitle: 'Percentage Calculator - Quick Marks & Math Calculator | Student Toolkit',
    seoDescription: 'Calculate percentages for exam marks, grade improvements, discounts, and everyday student calculations quickly and accurately.',
    relatedToolIds: ['gpa-calculator', 'cgpa-calculator', 'can-i-pass']
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    slug: '/tools/attendance-calculator',
    description: 'Check your current attendance percentage.',
    category: 'Attendance',
    icon: CheckCircle,
    color: 'bg-comic-purple',
    seoTitle: 'Attendance Calculator - Calculate Attendance Percentage | Student Toolkit',
    seoDescription: 'Check your current class attendance percentage instantly. Know whether you meet the 75% or 80% requirement with our simple attendance tracker.',
    relatedToolIds: ['classes-i-can-miss', 'classes-needed', 'can-i-pass']
  },
  {
    id: 'classes-i-can-miss',
    name: 'Classes I Can Miss',
    slug: '/tools/classes-i-can-miss',
    description: 'Find out how many classes you can skip while maintaining your target.',
    category: 'Attendance',
    icon: Calendar,
    color: 'bg-comic-blue',
    seoTitle: 'Classes I Can Miss Calculator - Attendance Safe Bunk Calculator | Student Toolkit',
    seoDescription: 'Find out how many classes or lectures you can safely skip or miss while keeping your attendance above 75% or your custom university requirement.',
    relatedToolIds: ['attendance-calculator', 'classes-needed', 'can-i-pass']
  },
  {
    id: 'classes-needed',
    name: 'Classes Needed',
    slug: '/tools/classes-needed',
    description: 'Calculate exactly how many classes you MUST attend to reach your target.',
    category: 'Attendance',
    icon: AlertTriangle,
    color: 'bg-comic-red',
    seoTitle: 'Classes Needed Calculator - How Many Classes to Attend | Student Toolkit',
    seoDescription: 'Calculate exactly how many consecutive classes you must attend to raise your attendance percentage back to your required 75% or 80% goal.',
    relatedToolIds: ['attendance-calculator', 'classes-i-can-miss', 'can-i-pass']
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    slug: '/tools/pomodoro-timer',
    description: 'Stay focused with a classic 25-minute study timer.',
    category: 'Study',
    icon: Timer,
    color: 'bg-comic-red',
    seoTitle: 'Pomodoro Study Timer - 25-Minute Focus & Break Clock | Student Toolkit',
    seoDescription: 'Boost your study focus and productivity with a customizable Pomodoro timer. Work in intervals, take structured breaks, and crush your study sessions.',
    relatedToolIds: ['word-counter', 'ppt-to-pdf', 'can-i-pass']
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: '/tools/word-counter',
    description: 'Count words, characters, and reading time for your essays.',
    category: 'Everyday Tools',
    icon: FileText,
    color: 'bg-comic-blue',
    seoTitle: 'Word Counter - Words, Characters & Reading Time | Student Toolkit',
    seoDescription: 'Free online word counter for essays, assignments, and papers. Count words, characters, sentences, paragraphs, and estimated reading time.',
    relatedToolIds: ['pomodoro-timer', 'pdf-tools', 'ppt-to-pdf']
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    slug: '/tools/pdf-tools',
    description: 'Merge, split, and analyze PDF files right in your browser.',
    category: 'Everyday Tools',
    icon: FileText,
    color: 'bg-comic-yellow',
    seoTitle: 'PDF Tools - Merge, Split & Inspect PDFs Online | Student Toolkit',
    seoDescription: 'Free client-side PDF tools for students. Merge multiple PDFs, split documents, and inspect page counts securely in your browser with zero uploads.',
    relatedToolIds: ['ppt-to-pdf', 'word-counter', 'qr-generator']
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    slug: '/tools/ppt-to-pdf',
    description: 'Convert PowerPoint presentations (.pptx) to PDF with custom slide layouts & note sheets.',
    category: 'Everyday Tools',
    icon: Presentation,
    color: 'bg-comic-red',
    seoTitle: 'PPT to PDF Converter - Convert Slides & Lecture Handouts | Student Toolkit',
    seoDescription: 'Convert PowerPoint (.pptx) presentations to PDF with custom handout layouts and lecture note ruled lines. 100% private in-browser conversion.',
    relatedToolIds: ['pdf-tools', 'word-counter', 'pomodoro-timer'],
    faqItems: [
      {
        question: 'What PowerPoint formats are supported?',
        answer: 'Modern .pptx files created in Microsoft PowerPoint, Google Slides (File > Download > Microsoft PowerPoint), Apple Keynote, and LibreOffice are fully supported.'
      },
      {
        question: 'Can I print lecture handouts with note lines?',
        answer: 'Yes! Select the "3 Slides + Notes Lines" layout to print traditional university-style handout pages with ruled notebook lines for your handwriting.'
      }
    ]
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    slug: '/tools/qr-generator',
    description: 'Create QR codes for links, text, or contacts.',
    category: 'Everyday Tools',
    icon: QrCode,
    color: 'bg-comic-green',
    seoTitle: 'QR Code Generator - Create Free Custom QR Codes | Student Toolkit',
    seoDescription: 'Generate custom QR codes instantly for website links, notes, text, or contacts. Free, fast, and downloadable in your browser.',
    relatedToolIds: ['pdf-tools', 'word-counter', 'percentage-calculator']
  }
];

export const getToolsByCategory = () => {
  const grouped: Record<Category, Tool[]> = {
    'Marks & Grades': [],
    'Attendance': [],
    'Study': [],
    'Everyday Tools': []
  };
  
  tools.forEach(tool => {
    grouped[tool.category].push(tool);
  });
  
  return grouped;
};
