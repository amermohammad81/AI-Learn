// Study-AI Dashboard - Mock Data
// Design: Midnight Scholar - Dark Academia Glassmorphism

export interface Lecture {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'processed' | 'processing' | 'pending';
  progress?: number;
  hasSummary: boolean;
  hasFlashcards: boolean;
  hasQuiz: boolean;
  hasPPT: boolean;
}

export interface Course {
  id: string;
  name: string;
  professor: string;
  semester: string;
  color: string;
  colorName: string;
  lecturesCount: number;
  quizzesPending: number;
  flashcardsCount: number;
  lastActivity: string;
  lectures: Lecture[];
}

export const COURSE_COLORS = [
  { name: 'Indigo', value: '#4F46E5', class: 'from-indigo-500 to-indigo-700' },
  { name: 'Violet', value: '#7C3AED', class: 'from-violet-500 to-violet-700' },
  { name: 'Emerald', value: '#059669', class: 'from-emerald-500 to-emerald-700' },
  { name: 'Rose', value: '#E11D48', class: 'from-rose-500 to-rose-700' },
  { name: 'Amber', value: '#D97706', class: 'from-amber-500 to-amber-700' },
  { name: 'Cyan', value: '#0891B2', class: 'from-cyan-500 to-cyan-700' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    name: 'Machine Learning Fundamentals',
    professor: 'Dr. Sarah Chen',
    semester: 'Spring 2025',
    color: '#4F46E5',
    colorName: 'Indigo',
    lecturesCount: 12,
    quizzesPending: 3,
    flashcardsCount: 87,
    lastActivity: '2 hours ago',
    lectures: [
      {
        id: 'l1',
        title: 'Introduction to Neural Networks',
        date: 'Mar 10, 2025',
        duration: '1h 23m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: true,
        hasPPT: true,
      },
      {
        id: 'l2',
        title: 'Backpropagation Deep Dive',
        date: 'Mar 8, 2025',
        duration: '58m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: false,
        hasPPT: true,
      },
      {
        id: 'l3',
        title: 'Convolutional Neural Networks',
        date: 'Mar 5, 2025',
        duration: '1h 10m',
        status: 'processing',
        progress: 67,
        hasSummary: false,
        hasFlashcards: false,
        hasQuiz: false,
        hasPPT: false,
      },
      {
        id: 'l4',
        title: 'Gradient Descent Optimization',
        date: 'Mar 3, 2025',
        duration: '45m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: true,
        hasPPT: false,
      },
      {
        id: 'l5',
        title: 'Regularization Techniques',
        date: 'Feb 28, 2025',
        duration: '1h 05m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: false,
        hasQuiz: true,
        hasPPT: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Advanced Algorithms',
    professor: 'Prof. James Miller',
    semester: 'Spring 2025',
    color: '#7C3AED',
    colorName: 'Violet',
    lecturesCount: 8,
    quizzesPending: 5,
    flashcardsCount: 54,
    lastActivity: 'Yesterday',
    lectures: [
      {
        id: 'l6',
        title: 'Dynamic Programming Masterclass',
        date: 'Mar 9, 2025',
        duration: '1h 30m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: true,
        hasPPT: true,
      },
      {
        id: 'l7',
        title: 'Graph Theory & BFS/DFS',
        date: 'Mar 6, 2025',
        duration: '1h 15m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: false,
        hasPPT: false,
      },
      {
        id: 'l8',
        title: 'Divide & Conquer Strategies',
        date: 'Mar 4, 2025',
        duration: '52m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: false,
        hasQuiz: true,
        hasPPT: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Data Structures',
    professor: 'Dr. Emily Watson',
    semester: 'Spring 2025',
    color: '#059669',
    colorName: 'Emerald',
    lecturesCount: 15,
    quizzesPending: 1,
    flashcardsCount: 120,
    lastActivity: '3 days ago',
    lectures: [
      {
        id: 'l9',
        title: 'Binary Trees & AVL Trees',
        date: 'Mar 7, 2025',
        duration: '1h 20m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: true,
        hasPPT: true,
      },
      {
        id: 'l10',
        title: 'Hash Tables & Collision Resolution',
        date: 'Mar 4, 2025',
        duration: '1h 05m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: false,
        hasPPT: true,
      },
    ],
  },
  {
    id: '4',
    name: 'Computer Networks',
    professor: 'Prof. Robert Kim',
    semester: 'Spring 2025',
    color: '#0891B2',
    colorName: 'Cyan',
    lecturesCount: 6,
    quizzesPending: 2,
    flashcardsCount: 43,
    lastActivity: '1 week ago',
    lectures: [
      {
        id: 'l11',
        title: 'TCP/IP Protocol Suite',
        date: 'Mar 1, 2025',
        duration: '1h 45m',
        status: 'processed',
        hasSummary: true,
        hasFlashcards: true,
        hasQuiz: true,
        hasPPT: true,
      },
    ],
  },
];

export const GLOBAL_LIBRARY_ITEMS = [
  { id: 'g1', title: 'Linear Algebra Review', subject: 'Mathematics', downloads: 1240, rating: 4.8 },
  { id: 'g2', title: 'Calculus Fundamentals', subject: 'Mathematics', downloads: 980, rating: 4.6 },
  { id: 'g3', title: 'Statistics for Data Science', subject: 'Statistics', downloads: 2100, rating: 4.9 },
  { id: 'g4', title: 'Operating Systems Concepts', subject: 'CS', downloads: 756, rating: 4.5 },
  { id: 'g5', title: 'Database Design Patterns', subject: 'CS', downloads: 1450, rating: 4.7 },
];
