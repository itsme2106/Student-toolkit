import { Calculator, Calendar, FileText, Percent, CheckCircle, GraduationCap, Timer, Hash, QrCode, TrendingUp, AlertTriangle, Presentation } from 'lucide-react';

export type Category = 'Marks & Grades' | 'Attendance' | 'Study' | 'Everyday Tools';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  icon: any; // We'll just pass the Lucide component
  color: string;
}

export const tools: Tool[] = [
  {
    id: 'can-i-pass',
    name: 'Can I Pass?',
    slug: '/tools/can-i-pass',
    description: 'Find out exactly how many marks you need in your final exam to pass.',
    category: 'Marks & Grades',
    icon: GraduationCap,
    color: 'bg-comic-yellow'
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    slug: '/tools/cgpa-calculator',
    description: 'Calculate your Cumulative Grade Point Average easily.',
    category: 'Marks & Grades',
    icon: TrendingUp,
    color: 'bg-comic-blue'
  },
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    slug: '/tools/gpa-calculator',
    description: 'Calculate your Grade Point Average from letter grades.',
    category: 'Marks & Grades',
    icon: Calculator,
    color: 'bg-comic-red'
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: '/tools/percentage-calculator',
    description: 'Quickly calculate percentages for marks or everyday use.',
    category: 'Marks & Grades',
    icon: Percent,
    color: 'bg-comic-green'
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    slug: '/tools/attendance-calculator',
    description: 'Check your current attendance percentage.',
    category: 'Attendance',
    icon: CheckCircle,
    color: 'bg-comic-purple'
  },
  {
    id: 'classes-i-can-miss',
    name: 'Classes I Can Miss',
    slug: '/tools/classes-i-can-miss',
    description: 'Find out how many classes you can skip while maintaining your target.',
    category: 'Attendance',
    icon: Calendar,
    color: 'bg-comic-blue'
  },
  {
    id: 'classes-needed',
    name: 'Classes Needed',
    slug: '/tools/classes-needed',
    description: 'Calculate exactly how many classes you MUST attend to reach your target.',
    category: 'Attendance',
    icon: AlertTriangle,
    color: 'bg-comic-red'
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    slug: '/tools/pomodoro-timer',
    description: 'Stay focused with a classic 25-minute study timer.',
    category: 'Study',
    icon: Timer,
    color: 'bg-comic-red'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: '/tools/word-counter',
    description: 'Count words, characters, and reading time for your essays.',
    category: 'Everyday Tools',
    icon: FileText,
    color: 'bg-comic-blue'
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    slug: '/tools/pdf-tools',
    description: 'Merge, split, and analyze PDF files right in your browser.',
    category: 'Everyday Tools',
    icon: FileText,
    color: 'bg-comic-yellow'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    slug: '/tools/ppt-to-pdf',
    description: 'Convert PowerPoint presentations (.pptx) to PDF with custom slide layouts & note sheets.',
    category: 'Everyday Tools',
    icon: Presentation,
    color: 'bg-comic-red'
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    slug: '/tools/qr-generator',
    description: 'Create QR codes for links, text, or contacts.',
    category: 'Everyday Tools',
    icon: QrCode,
    color: 'bg-comic-green'
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
