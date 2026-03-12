import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Layers, HelpCircle, Presentation,
  Check, ChevronRight, Sparkles, Menu, X,
  Mic, Brain, BookOpen, BarChart3, ArrowRight,
} from "lucide-react";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRANSLATIONS  â€” EN is default, AR is alternate
// Section indices: 0=hero  1=how-it-works  2=features  3=register
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const T = {
  en: {
    brand: "Lerrn", brandSub: "AI",
    nav: ["How it Works", "Features", "Get Access"],
    // navTargets maps each nav item â†’ scroll section index
    navTargets: [1, 2, 3],
    ctaNav: "Start Free",
    announcementBar: "ðŸŽ“ Beta launching soon â€” Register now for free early access",
    subheadline: "AI Lecture Assistant",
    headline: "Watch the AI Magic\nStudy for You",
    recordIdle: "Tap to record your lecture",
    recordActive: "Listeningâ€¦",
    recordStop: "Stop & Analyze",
    processing: "AI Analyzing audioâ€¦",
    scrollHint: "Scroll down",
    summaryPoints: [
      "Covalent bonds form by sharing electrons between atoms in a molecule",
      "Octet rule governs molecular stability in all chemical compounds",
      "Energy released during reaction = 412 kJ/mol at standard conditions",
      "Ionic bonds are stronger than covalent bonds in the solid state",
    ],
    flashFront: "Ionic Bond",
    flashBack: "Complete electron transfer between two atoms with differing electronegativity values",
    flipHint: "Click to flip â†©",
    quizQ: "What type of chemical bond exists in a water molecule Hâ‚‚O?",
    quizOpts: ["Ionic Bond", "Polar Covalent Bond", "Metallic Bond", "Van der Waals"],
    correctAnswer: 1,
    pptSlides: ["Intro to Chemistry", "Chemical Bonds", "Properties & Uses", "Summary"],
    features: ["Smart Summary", "AI Flashcards", "Instant Quizzes", "Auto-PPT"],
    featureDescs: [
      "Converts your lecture into structured key points in seconds",
      "Interactive flashcards that reinforce long-term memory retention",
      "Smart quizzes to test your understanding instantly",
      "Professional slide decks generated automatically from lectures",
    ],
    showcaseTitle: "Everything You Need from One Lecture",
    showcaseSub: "Four powerful tools working in harmony",
    howTitle: "How It Works",
    howSub: "From recording to a full study kit in under 10 seconds",
    howSteps: [
      { icon: "ðŸŽ™ï¸", title: "Record Your Lecture", desc: "Tap the mic and record any lecture, lesson, or study session in real time." },
      { icon: "ðŸ§ ", title: "AI Analyzes Instantly", desc: "Our AI engine processes the audio, extracts key concepts, and structures content automatically." },
      { icon: "ðŸ“š", title: "Get Your Study Kit", desc: "Receive a smart summary, flashcards, quiz questions, and a slide deck â€” ready in seconds." },
      { icon: "ðŸ“ˆ", title: "Track Your Progress", desc: "Review performance across quizzes and flashcards to find weak spots and improve faster." },
    ],
    formHeadline: "Be an Early Bird.",
    formSub: "4 Free Classes, Just for You.",
    nameLabel: "Full Name",
    namePlaceholder: "Your name",
    contactMethodLabel: "Preferred Contact",
    contactByPhone: "Phone Number",
    contactByEmail: "Email",
    phonePlaceholder: "e.g. +973 3XXX XXXX",
    invalidPhone: "Enter a valid Bahrain phone number",
    invalidName: "Enter a valid full name",
    emailPlaceholder: "Enter your email address",
    universityLabel: "University",
    universityPlaceholder: "Select your university",
    universities: [
      "UOB â€” University of Bahrain",
      "AOU â€” Arab Open University",
      "UTB â€” University of Technology Bahrain",
      "AGU â€” Arabian Gulf University",
      "AHLIA â€” Ahlia University",
      "ASU â€” Applied Science University",
      "BPU â€” Bahrain Polytechnic",
      "KU â€” Kingdom University",
      "RUW â€” Royal University for Women",
      "GU â€” Gulf University",
      "UCB â€” University College of Bahrain",
      "Other",
    ],
    ctaBtn: "Get Early Access",
    noSpam: "No spam. Unsubscribe anytime.",
    successTitle: "You're on the list! ðŸŽ‰",
    successSub: "We'll reach out soon.",
    madeIn: "Made in Bahrain with AI â¤ï¸",
    earlyBird: "Early Bird Program",
    stats: [{ v: "4", l: "Free Classes" }, { v: "âˆž", l: "Summaries" }, { v: "AI", l: "Powered" }],
  },
  ar: {
    brand: "Ù„ÙÙŠØ±Ù†", brandSub: "AI",
    nav: ["ÙƒÙŠÙ ÙŠØ¹Ù…Ù„", "Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª", "Ø§Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ù…Ø¨ÙƒØ±"],
    navTargets: [1, 2, 3],
    ctaNav: "Ø§Ø¨Ø¯Ø£ Ù…Ø¬Ø§Ù†Ø§Ù‹",
    announcementBar: "ðŸŽ“ Ø§Ù„Ø¥Ø·Ù„Ø§Ù‚ Ø§Ù„ØªØ¬Ø±ÙŠØ¨ÙŠ Ù‚Ø±ÙŠØ¨Ø§Ù‹ â€” Ø³Ø¬Ù‘Ù„ Ø§Ù„Ø¢Ù† ÙˆØ§Ø­ØµÙ„ Ø¹Ù„Ù‰ ÙˆØµÙˆÙ„ Ù…Ø¨ÙƒØ± Ù…Ø¬Ø§Ù†ÙŠ",
    subheadline: "Ù…Ø³Ø§Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§Ø¶Ø±Ø§Øª Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    headline: "Ø´Ø§Ù‡Ø¯ Ø³Ø­Ø± Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ\nÙŠØ°Ø§ÙƒØ± Ù„Ùƒ",
    recordIdle: "Ø§Ø¶ØºØ· Ù„ØªØ³Ø¬ÙŠÙ„ Ù…Ø­Ø§Ø¶Ø±ØªÙƒ",
    recordActive: "Ø¬Ø§Ø±Ù Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø¹...",
    recordStop: "Ø£ÙˆÙ‚Ù ÙˆØ­Ù„Ù‘Ù„",
    processing: "Ø¬Ø§Ø±Ù Ø§Ù„ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø°ÙƒÙŠ...",
    scrollHint: "Ø§Ø³Ø­Ø¨ Ù„Ù„Ø£Ø³ÙÙ„",
    summaryPoints: [
      "Ø§Ù„Ø±Ø§Ø¨Ø·Ø© Ø§Ù„ØªØ³Ø§Ù‡Ù…ÙŠØ© ØªÙ†ØªØ¬ Ù…Ù† Ù…Ø´Ø§Ø±ÙƒØ© Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†Ø§Øª Ø¨ÙŠÙ† Ø§Ù„Ø°Ø±Ø§Øª",
      "Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø«Ù…Ø§Ù†ÙŠØ© ØªØ­ÙƒÙ… Ø§Ø³ØªÙ‚Ø±Ø§Ø± Ø§Ù„Ø¬Ø²ÙŠØ¦Ø§Øª ÙÙŠ Ø§Ù„ØªÙØ§Ø¹Ù„Ø§Øª",
      "Ø§Ù„Ø·Ø§Ù‚Ø© Ø§Ù„Ù…Ø­Ø±Ø±Ø© Ø®Ù„Ø§Ù„ Ø§Ù„ØªÙØ§Ø¹Ù„ = 412 ÙƒÙŠÙ„Ùˆ Ø¬ÙˆÙ„/Ù…ÙˆÙ„",
      "Ø§Ù„Ø±Ø§Ø¨Ø·Ø© Ø§Ù„Ø£ÙŠÙˆÙ†ÙŠØ© Ø£Ù‚ÙˆÙ‰ Ù…Ù† Ø§Ù„ØªØ³Ø§Ù‡Ù…ÙŠØ© ÙÙŠ Ø§Ù„Ø­Ø§Ù„Ø© Ø§Ù„ØµÙ„Ø¨Ø©",
    ],
    flashFront: "Ø§Ù„Ø±Ø§Ø¨Ø·Ø© Ø§Ù„Ø£ÙŠÙˆÙ†ÙŠØ©",
    flashBack: "Ø§Ù†ØªÙ‚Ø§Ù„ ÙƒØ§Ù…Ù„ Ù„Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†Ø§Øª Ø¨ÙŠÙ† Ø°Ø±ØªÙŠÙ† Ù…Ø®ØªÙ„ÙØªÙŠÙ† ÙÙŠ ÙƒÙ‡Ø±ÙˆØ³Ù„Ø¨ÙŠØªÙ‡Ù…Ø§",
    flipHint: "Ø§Ù†Ù‚Ø± Ù„Ù„Ù‚Ù„Ø¨ â†©",
    quizQ: "Ù…Ø§ Ù†ÙˆØ¹ Ø§Ù„Ø±Ø§Ø¨Ø·Ø© Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ© ÙÙŠ Ø¬Ø²ÙŠØ¡ Ø§Ù„Ù…Ø§Ø¡ Hâ‚‚OØŸ",
    quizOpts: ["Ø±Ø§Ø¨Ø·Ø© Ø£ÙŠÙˆÙ†ÙŠØ©", "Ø±Ø§Ø¨Ø·Ø© ØªØ³Ø§Ù‡Ù…ÙŠØ© Ù‚Ø·Ø¨ÙŠØ©", "Ø±Ø§Ø¨Ø·Ø© ÙÙ„Ø²ÙŠØ©", "Ù‚ÙˆÙ‰ ÙØ§Ù† Ø¯ÙŠØ± ÙØ§Ù„"],
    correctAnswer: 1,
    pptSlides: ["Ù…Ù‚Ø¯Ù…Ø© Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¡", "Ø§Ù„Ø±ÙˆØ§Ø¨Ø· Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ©", "Ø§Ù„Ø®ØµØ§Ø¦Øµ ÙˆØ§Ù„ØªØ·Ø¨ÙŠÙ‚Ø§Øª", "Ø§Ù„Ø®Ù„Ø§ØµØ©"],
    features: ["Ø§Ù„Ù…Ù„Ø®Øµ Ø§Ù„Ø°ÙƒÙŠ", "Ø§Ù„Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠØ©", "Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø§Ù„ÙÙˆØ±ÙŠØ©", "Ø¹Ø±ÙˆØ¶ ØªÙ„Ù‚Ø§Ø¦ÙŠØ©"],
    featureDescs: [
      "ÙŠÙØ­ÙˆÙ‘Ù„ Ù…Ø­Ø§Ø¶Ø±ØªÙƒ Ø¥Ù„Ù‰ Ù†Ù‚Ø§Ø· Ù…ÙÙ†Ø¸ÙŽÙ‘Ù…Ø© ÙÙŠ Ø«ÙˆØ§Ù†Ù Ù…Ø¹Ø¯ÙˆØ¯Ø©",
      "Ø¨Ø·Ø§Ù‚Ø§Øª ØªÙØ§Ø¹Ù„ÙŠØ© ØªÙØ¹Ø²Ø² Ø§Ù„Ø­ÙØ¸ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø¯Ù‰ Ø§Ù„Ø¨Ø¹ÙŠØ¯",
      "Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø°ÙƒÙŠØ© Ù„Ù‚ÙŠØ§Ø³ Ù…Ø³ØªÙˆÙ‰ ÙÙ‡Ù…Ùƒ Ø§Ù„ÙÙˆØ±ÙŠ",
      "Ø´Ø±Ø§Ø¦Ø­ Ø§Ø­ØªØ±Ø§ÙÙŠØ© ØªÙÙˆÙ„ÙŽÙ‘Ø¯ ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹ Ù…Ù† Ø§Ù„Ù…Ø­Ø§Ø¶Ø±Ø©",
    ],
    showcaseTitle: "ÙƒÙ„ Ù…Ø§ ØªØ­ØªØ§Ø¬Ù‡ Ù…Ù† Ù…Ø­Ø§Ø¶Ø±Ø© ÙˆØ§Ø­Ø¯Ø©",
    showcaseSub: "Ø£Ø±Ø¨Ø¹ Ø£Ø¯ÙˆØ§Øª Ù‚ÙˆÙŠØ© ØªØ¹Ù…Ù„ Ø¨ØªÙ†Ø§ØºÙ… ØªØ§Ù…",
    howTitle: "ÙƒÙŠÙ ÙŠØ¹Ù…Ù„",
    howSub: "Ù…Ù† Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ø¥Ù„Ù‰ ÙƒØªÙŠØ¨ Ø§Ù„Ø¯Ø±Ø§Ø³Ø© ÙÙŠ Ø£Ù‚Ù„ Ù…Ù† Ù¡Ù  Ø«ÙˆØ§Ù†Ù",
    howSteps: [
      { icon: "ðŸŽ™ï¸", title: "Ø³Ø¬Ù‘Ù„ Ù…Ø­Ø§Ø¶Ø±ØªÙƒ", desc: "Ø§Ø¶ØºØ· Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙŠÙƒØ±ÙˆÙÙˆÙ† ÙˆØ³Ø¬Ù‘Ù„ Ø£ÙŠ Ù…Ø­Ø§Ø¶Ø±Ø© Ø£Ùˆ Ø¯Ø±Ø³ ÙÙŠ Ø§Ù„ÙˆÙ‚Øª Ø§Ù„ÙØ¹Ù„ÙŠ." },
      { icon: "ðŸ§ ", title: "Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙŠØ­Ù„Ù„ ÙÙˆØ±Ø§Ù‹", desc: "ÙŠØ¹Ø§Ù„Ø¬ Ø§Ù„Ù…Ø­Ø±Ùƒ Ø§Ù„Ø°ÙƒÙŠ Ø§Ù„ØµÙˆØª ÙˆÙŠØ³ØªØ®Ø±Ø¬ Ø§Ù„Ù…ÙØ§Ù‡ÙŠÙ… ÙˆÙŠÙ‡ÙŠÙƒÙ„ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹." },
      { icon: "ðŸ“š", title: "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ ÙƒØªÙŠØ¨ Ø¯Ø±Ø§Ø³ØªÙƒ", desc: "Ø§Ø³ØªÙ„Ù… Ù…Ù„Ø®ØµØ§Ù‹ ÙˆØ¨Ø·Ø§Ù‚Ø§Øª ØªØ¹Ù„ÙŠÙ…ÙŠØ© ÙˆØ£Ø³Ø¦Ù„Ø© Ø§Ø®ØªØ¨Ø§Ø± ÙˆØ¹Ø±Ø¶ Ø´Ø±Ø§Ø¦Ø­ Ø®Ù„Ø§Ù„ Ø«ÙˆØ§Ù†Ù." },
      { icon: "ðŸ“ˆ", title: "ØªØªØ¨Ø¹ ØªÙ‚Ø¯Ù…Ùƒ", desc: "Ø±Ø§Ø¬Ø¹ Ø£Ø¯Ø§Ø¡Ùƒ ÙÙŠ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ù„ØªØ­Ø¯ÙŠØ¯ Ù†Ù‚Ø§Ø· Ø§Ù„Ø¶Ø¹Ù ÙˆØ§Ù„ØªØ­Ø³Ù† Ø¨Ø´ÙƒÙ„ Ø£Ø³Ø±Ø¹." },
    ],
    formHeadline: "ÙƒÙ† Ù…Ù† Ø§Ù„Ø£ÙˆØ§Ø¦Ù„.",
    formSub: "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ 4 ÙƒÙ„Ø§Ø³Ø§Øª Ù…Ø¬Ø§Ù†Ø§Ù‹",
    nameLabel: "Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„",
    namePlaceholder: "Ø§Ø³Ù…Ùƒ",
    contactMethodLabel: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…ÙØ¶Ù„Ø©",
    contactByPhone: "Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ",
    contactByEmail: "Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ",
    phonePlaceholder: "Ù…Ø«Ø§Ù„: +973 3XXX XXXX",
    invalidPhone: "Ø£Ø¯Ø®Ù„ Ø±Ù‚Ù… Ù‡Ø§ØªÙ Ø¨Ø­Ø±ÙŠÙ†ÙŠ ØµØ­ÙŠØ­",
    invalidName: "Ø£Ø¯Ø®Ù„ Ø§Ø³Ù…Ø§Ù‹ ØµØ­ÙŠØ­Ø§Ù‹",
    emailPlaceholder: "Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ",
    universityLabel: "Ø§Ù„Ø¬Ø§Ù…Ø¹Ø©",
    universityPlaceholder: "Ø§Ø®ØªØ± Ø¬Ø§Ù…Ø¹ØªÙƒ",
    universities: [
      "UOB â€” University of Bahrain",
      "AOU â€” Arab Open University",
      "UTB â€” University of Technology Bahrain",
      "AGU â€” Arabian Gulf University",
      "AHLIA â€” Ahlia University",
      "ASU â€” Applied Science University",
      "BPU â€” Bahrain Polytechnic",
      "KU â€” Kingdom University",
      "RUW â€” Royal University for Women",
      "GU â€” Gulf University",
      "UCB â€” University College of Bahrain",
      "Other",
    ],
    ctaBtn: "Ø§Ø­Ø¬Ø² Ù…Ù‚Ø¹Ø¯Ùƒ Ø§Ù„Ø¢Ù†",
    noSpam: "Ù„Ø§ Ø¨Ø±ÙŠØ¯ Ù…Ø²Ø¹Ø¬. Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ ÙÙŠ Ø£ÙŠ ÙˆÙ‚Øª.",
    successTitle: "Ø£Ù†Øª Ø¹Ù„Ù‰ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©! ðŸŽ‰",
    successSub: "Ø³Ù†ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ù‚Ø±ÙŠØ¨Ø§Ù‹",
    madeIn: "ØµÙÙ†Ø¹ ÙÙŠ Ø§Ù„Ø¨Ø­Ø±ÙŠÙ† Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ â¤ï¸",
    earlyBird: "Ø¨Ø±Ù†Ø§Ù…Ø¬ Ø§Ù„Ù…Ø¨ÙƒØ±ÙŠÙ†",
    stats: [{ v: "4", l: "ÙƒÙ„Ø§Ø³Ø§Øª Ù…Ø¬Ø§Ù†ÙŠØ©" }, { v: "âˆž", l: "Ù…Ù„Ø®ØµØ§Øª" }, { v: "AI", l: "Ù…Ø¯Ø¹ÙˆÙ… Ø¨Ù€" }],
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SHARED ATOMS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GridBg = ({ opacity = 0.04 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `linear-gradient(rgba(168,85,247,${opacity}) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,${opacity}) 1px,transparent 1px)`,
    backgroundSize: "48px 48px",
  }} />
);
const RadialGlow = ({ opacity = 0.12, size = "80% 60%", pos = "50% 40%" }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    background: `radial-gradient(ellipse ${size} at ${pos}, rgba(168,85,247,${opacity}) 0%, transparent 70%)`,
  }} />
);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HEADER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Header({ lang, setLang, t, isRTL, scrollTo, activeSection }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = activeSection > 0;

  return (
    <>
      {/* â”€â”€ Announcement bar â”€â”€ */}
      <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
        style={{ height: scrolled ? 0 : 36, transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
        <div className="h-9 flex items-center justify-center gap-2 text-xs font-medium"
          style={{ background: "linear-gradient(90deg,#a855f7,#c026d3 50%,#ec4899)" }}>
          <Sparkles size={12} className="text-indigo-200 shrink-0" />
          <span className="text-white/90">{t.announcementBar}</span>
        </div>
      </div>

      {/* â”€â”€ Main navbar â”€â”€ */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="fixed left-0 right-0 z-40 px-4 md:px-8"
        style={{ top: scrolled ? 8 : 36, height: 60, transition: "top 0.4s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <motion.div
          className="w-full h-full flex items-center justify-between px-4 md:px-6 rounded-2xl"
          animate={{
            background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.74)",
            borderColor: scrolled ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.18)",
            boxShadow: scrolled
              ? "0 0 0 1px rgba(168,85,247,0.25),0 8px 32px rgba(168,85,247,0.14),0 0 50px rgba(236,72,153,0.08)"
              : "0 0 0 1px rgba(168,85,247,0.12)",
          }}
          transition={{ duration: 0.35 }}
          style={{ border: "1px solid", backdropFilter: "blur(22px)" }}
        >
          {/* Logo */}
          <motion.div
            className={`flex items-center gap-2 cursor-pointer select-none ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={() => scrollTo(0)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
          >
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", boxShadow: "0 0 20px rgba(168,85,247,0.45)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 5.5V10.5L8 14L14 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
                <circle cx="8" cy="8" r="2" fill="white" fillOpacity="0.95" />
                <path d="M8 2V6M8 10V14M2 5.5L5.5 7.5M10.5 8.5L14 10.5" stroke="white" strokeWidth="0.7" strokeOpacity="0.55" />
              </svg>
              <motion.div className="absolute inset-0 rounded-xl border border-indigo-400/50"
                animate={{ scale: [1, 1.45, 1], opacity: [0.45, 0, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-slate-900 font-black text-lg tracking-tight">{t.brand}</span>
              <span className="font-bold px-1 py-0.5 rounded-md text-white leading-none"
                style={{ background: "linear-gradient(135deg,#c026d3,#f472b6)", fontSize: "9px", letterSpacing: "0.08em" }}>
                {t.brandSub}
              </span>
            </div>
          </motion.div>

          {/* Desktop nav */}
          <nav className={`hidden md:flex items-center gap-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
            {t.nav.map((label, i) => {
              const target = t.navTargets[i];
              const isActive = activeSection === target;
              return (
                <motion.button key={i} onClick={() => scrollTo(target)}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ color: isActive ? "#6b21a8" : "rgba(107,114,128,0.95)" }}
                  whileHover={{ color: "#6b21a8" }}
                  transition={{ duration: 0.15 }}>
                  {isActive && (
                    <motion.div layoutId="navPill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "rgba(168,85,247,0.18)" }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }} />
                  )}
                  <span className="relative z-10">{label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Lang pill */}
            <div className="flex items-center rounded-xl overflow-hidden border border-purple-200"
              style={{ background: "rgba(255,255,255,0.86)" }}>
              {["en", "ar"].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className="px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={{
                    background: lang === l ? "rgba(168,85,247,0.8)" : "transparent",
                    color: lang === l ? "#fff" : "rgba(107,114,128,0.9)",
                  }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* CTA */}
            <motion.button onClick={() => scrollTo(3)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", boxShadow: "0 0 22px rgba(168,85,247,0.35)" }}>
              <Sparkles size={11} />
              {t.ctaNav}
            </motion.button>

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-purple-600"
              style={{ background: "rgba(168,85,247,0.12)" }}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed z-30 left-4 right-4 rounded-2xl border border-purple-200 overflow-hidden"
            style={{
              top: scrolled ? 76 : 104,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(28px)",
              boxShadow: "0 12px 48px rgba(168,85,247,0.12),0 0 0 1px rgba(168,85,247,0.16)",
            }}>
            <div className="p-3 space-y-1">
              {t.nav.map((label, i) => (
                <button key={i}
                  onClick={() => { scrollTo(t.navTargets[i]); setMobileOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-700 ${isRTL ? "text-right" : "text-left"}`}
                  style={{ background: "rgba(255,255,255,0.86)" }}>
                  {label}
                </button>
              ))}
              <button onClick={() => { scrollTo(3); setMobileOpen(false); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white mt-1"
                style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
                {t.ctaNav}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// VOICE WAVE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VoiceWave({ active }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-14 w-full">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i} className="w-[3px] rounded-full"
          style={{ background: active ? "#6366f1" : "#1e293b", minHeight: 4 }}
          animate={active
            ? { height: [`${6 + Math.random() * 8}px`, `${18 + Math.random() * 28}px`, `${6 + Math.random() * 8}px`], opacity: [0.45, 1, 0.45] }
            : { height: "4px", opacity: 0.2 }}
          transition={active
            ? { duration: 0.5 + Math.random() * 0.4, delay: (i / 30) * 0.22, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5 }} />
      ))}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PROCESSING VIEW  (neural ring + particles + EQ bars)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProcessingView({ progress, label }) {
  const r = 52, circ = 2 * Math.PI * r;
  return (
    <motion.div
      key="proc"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center py-6 gap-4 relative overflow-hidden"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              left: `${8 + Math.random() * 84}%`,
              top: `${8 + Math.random() * 84}%`,
              background: `hsl(${228 + Math.random() * 55},82%,${52 + Math.random() * 32}%)`,
            }}
            animate={{ y: [0, -(55 + Math.random() * 65), 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.6 + Math.random() * 1.4, delay: Math.random() * 1, repeat: Infinity }} />
        ))}
      </div>

      {/* Neural ring */}
      <div className="relative flex items-center justify-center z-10">
        <svg width="132" height="132" className="-rotate-90">
          <circle cx="66" cy="66" r={r} fill="none" stroke="#1e1b4b" strokeWidth="6" />
          <motion.circle
            cx="66" cy="66" r={r} fill="none"
            stroke="url(#procGrad)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * circ} ${circ - (progress / 100) * circ}`}
            transition={{ duration: 0.04 }}
          />
          <defs>
            <linearGradient id="procGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-white font-mono tabular-nums">{progress}%</div>
          <div className="text-xs text-indigo-300 mt-0.5">AI</div>
        </div>
      </div>

      <p className="text-indigo-300 text-sm font-medium animate-pulse z-10">{label}</p>

      {/* EQ bars */}
      <div className="flex gap-1.5 z-10">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div key={i} className="w-1 rounded-full bg-indigo-500"
            animate={{ height: ["5px", "20px", "5px"] }}
            transition={{ duration: 0.7, delay: i * 0.13, repeat: Infinity }} />
        ))}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HERO SECTION  â€” section 0
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HeroSection({ lang, t, isRTL }) {
  // phase: idle â†’ recording â†’ processing â†’ results
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [recTime, setRecTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const timerRef = useRef(null);

  const startRecording = () => {
    setPhase("recording");
    setRecTime(0);
    timerRef.current = setInterval(() => setRecTime(v => v + 1), 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setPhase("processing");
    setProgress(0);
  };

  // Processing: ramp 0â†’100 in ~2 seconds (40ms tick, +3-7 per tick)
  useEffect(() => {
    if (phase !== "processing") return;
    let val = 0;
    const iv = setInterval(() => {
      val += Math.floor(Math.random() * 5) + 3;
      if (val >= 100) { val = 100; setPhase("results"); clearInterval(iv); }
      setProgress(val);
    }, 40);
    return () => clearInterval(iv);
  }, [phase]);

  // Auto demo: start recording after 1.2s, auto-stop 2s later
  useEffect(() => {
    const t1 = setTimeout(startRecording, 1200);
    const t2 = setTimeout(stopRecording, 3200); // 2 seconds of recording
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(timerRef.current); };
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <section id="hero"
      style={{ scrollSnapAlign: "start", height: "100vh", position: "relative", overflow: "hidden" }}
      className="flex flex-col items-center justify-center px-4 pt-16">
      <GridBg />
      <RadialGlow />

      {/* Headline */}
      <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="text-center mb-8 z-10">
        <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">{t.subheadline}</p>
        <h1 className="font-black leading-tight text-3xl md:text-5xl whitespace-pre-line" style={{ maxWidth: 680 }}>
          {t.headline}
        </h1>
      </motion.div>

      {/* Demo card */}
      <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="relative z-10 w-full rounded-3xl border backdrop-blur-sm p-6"
        style={{ maxWidth: 520, borderColor: "#d9c4ff", background: "#f8f4ff", boxShadow: "0 0 40px rgba(168,85,247,0.12)" }}>

        <AnimatePresence mode="wait">

          {/* IDLE */}
          {phase === "idle" && (
            <motion.div key="idle" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5 py-4">
              <VoiceWave active={false} />
              <motion.button onClick={startRecording} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-white font-semibold py-3 px-8 rounded-2xl text-sm"
                style={{ background: "#4f46e5", boxShadow: "0 0 28px rgba(99,102,241,0.5)" }}>
                <span>ðŸŽ™ï¸</span>{t.recordIdle}
              </motion.button>
            </motion.div>
          )}

          {/* RECORDING */}
          {phase === "recording" && (
            <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="flex flex-col items-center gap-4 py-4">
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.div className="w-2.5 h-2.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.1, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">{t.recordActive}</span>
                <span className="text-slate-500 text-xs font-mono ml-2">{fmt(recTime)}</span>
              </div>
              <VoiceWave active={true} />
              <motion.button onClick={stopRecording} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 text-white font-semibold py-3 px-8 rounded-2xl text-sm mt-1"
                style={{ background: "#dc2626" }}>
                <span>â¹</span>{t.recordStop}
              </motion.button>
            </motion.div>
          )}

          {/* PROCESSING â€” neural ring */}
          {phase === "processing" && (
            <ProcessingView key="processing" progress={progress} label={t.processing} />
          )}

          {/* RESULTS */}
          {phase === "results" && (
            <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {/* Summary */}
              <motion.div initial={{ opacity: 0, x: isRTL ? 16 : -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="rounded-2xl border p-4" style={{ borderColor: "rgba(147,51,234,0.35)", background: "rgba(167,139,250,0.25)" }}>
                <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span>ðŸ“‹</span>
                  <span className="text-purple-700 font-semibold text-sm">{lang === "ar" ? "Ø§Ù„Ù…Ù„Ø®Øµ" : "Summary"}</span>
                </div>
                {t.summaryPoints.slice(0, 3).map((pt, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.14, duration: 0.4 }}
                    className={`flex gap-2 text-xs text-slate-700 leading-relaxed mb-1.5 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <span className="text-indigo-400 shrink-0 mt-0.5">â–¸</span>{pt}
                  </motion.div>
                ))}
              </motion.div>

              {/* Flashcard */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.45 }}>
                <div style={{ perspective: "800px" }}>
                  <motion.div animate={{ rotateY: flashFlipped ? 180 : 0 }}
                    transition={{ duration: 0.75 }} onClick={() => setFlashFlipped(f => !f)}
                    style={{ transformStyle: "preserve-3d", position: "relative", height: "68px", cursor: "pointer" }}>
                    <div style={{ backfaceVisibility: "hidden" }}
                      className="absolute inset-0 rounded-2xl border flex items-center justify-center gap-3 px-4" style={{ borderColor: "rgba(168,85,247,0.5)", background: "linear-gradient(135deg,#c4b5fd,#f0abfc)" }}>
                      <span className="text-purple-900 font-semibold text-sm">{t.flashFront}</span>
                      <span className="text-purple-700 text-xs opacity-80">{t.flipHint}</span>
                    </div>
                    <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      className="absolute inset-0 rounded-2xl border flex items-center justify-center px-4" style={{ borderColor: "rgba(167,139,250,0.6)", background: "linear-gradient(135deg,#e9d5ff,#ddd6fe)" }}>
                      <span className="text-purple-900 text-xs text-center leading-snug">{t.flashBack}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quiz */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.45 }}
                className="rounded-2xl border p-4" style={{ borderColor: "rgba(16,185,129,0.45)", background: "rgba(209,250,229,0.55)" }}>
                <p className={`text-slate-800 text-xs mb-2 leading-relaxed ${isRTL ? "text-right" : ""}`}>{t.quizQ}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {t.quizOpts.map((opt, i) => (
                    <motion.button key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.25 + i * 0.09, duration: 0.3 }}
                      onClick={() => setSelectedAnswer(i)}
                      className={`text-xs px-2.5 py-2 rounded-xl border transition-all ${selectedAnswer === i
                        ? i === t.correctAnswer ? "border-emerald-400 bg-emerald-900/60 text-emerald-200" : "border-red-400/50 bg-red-900/30 text-red-300"
                        : "border-slate-300 bg-white text-slate-700 hover:border-purple-400"} ${isRTL ? "text-right" : "text-left"}`}>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-slate-600 z-10">
        <span className="text-xs tracking-wide">{t.scrollHint}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M6 12l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HOW IT WORKS  â€” section 1
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HowItWorksSection({ t, isRTL }) {
  const stepIcons = [Mic, Brain, BookOpen, BarChart3];
  const stepColors = [
    { border: "rgba(99,102,241,0.38)", glow: "rgba(99,102,241,0.11)", text: "#a5b4fc" },
    { border: "rgba(167,139,250,0.38)", glow: "rgba(167,139,250,0.11)", text: "#c4b5fd" },
    { border: "rgba(52,211,153,0.32)",  glow: "rgba(52,211,153,0.09)",  text: "#6ee7b7" },
    { border: "rgba(251,191,36,0.32)",  glow: "rgba(251,191,36,0.09)",  text: "#fde68a" },
  ];

  return (
    <section id="how-it-works"
      style={{ scrollSnapAlign: "start", minHeight: "100vh", position: "relative", overflow: "hidden" }}
      className="flex flex-col items-center justify-center px-4 py-20">
      <GridBg opacity={0.03} />
      <RadialGlow opacity={0.08} size="100% 80%" pos="50% 50%" />

      {/* Section header */}
      <motion.div initial={{ opacity: 0, y: -18 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
        className="text-center mb-14 z-10">
        <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">
          {isRTL ? "Ø§Ù„Ø¹Ù…Ù„ÙŠØ©" : "The Process"}
        </p>
        <h2 className="font-black leading-tight text-3xl md:text-4xl mb-3">{t.howTitle}</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">{t.howSub}</p>
      </motion.div>

      {/* Cards grid */}
      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        style={{ maxWidth: 980 }}>
        {t.howSteps.map((step, i) => {
          const Icon = stepIcons[i];
          const col = stepColors[i];
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative rounded-2xl border p-6 flex flex-col gap-4"
                style={{
                  borderColor: col.border,
                  background: "rgba(255,255,255,0.92)",
                  boxShadow: `0 0 36px ${col.glow}`,
                }}>

              {/* Step number watermark */}
              <div className="absolute top-4 text-2xl font-black opacity-[0.12] text-purple-500 select-none"
                style={isRTL ? { left: 16 } : { right: 16 }}>
                0{i + 1}
              </div>

              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: col.glow, border: `1px solid ${col.border}` }}>
                <Icon size={20} style={{ color: col.text }} />
              </div>

              {/* Emoji */}
              <div className="text-2xl leading-none">{step.icon}</div>

              <div className={isRTL ? "text-right" : ""}>
                <h3 className="text-slate-900 font-bold text-base mb-2 leading-snug">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow connector */}
              {i < t.howSteps.length - 1 && (
                <div className="hidden lg:flex absolute z-20 top-1/2 -translate-y-1/2"
                  style={isRTL ? { left: -13 } : { right: -13 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.28)", border: "1px solid rgba(99,102,241,0.35)" }}>
                    <ArrowRight size={10} className="text-indigo-400"
                      style={isRTL ? { transform: "scaleX(-1)" } : {}} />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom hint */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }} viewport={{ once: true }}
        className="mt-12 z-10 flex flex-col items-center gap-3">
        <p className="text-slate-600 text-xs">
          {isRTL ? "Ø¬Ø§Ù‡Ø²ØŸ Ø§Ø±Ø¬Ø¹ Ù„Ù„Ø£Ø¹Ù„Ù‰ ÙˆØ§Ø¨Ø¯Ø£ Ø§Ù„ØªØ³Ø¬ÙŠÙ„" : "Ready to try it? Scroll up and hit Record"}
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(99,102,241,0.4)" }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.3, delay: i * 0.2, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FEATURE PANELS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SummaryPanel({ t, isRTL }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [highlighted, setHighlighted] = useState([]);
  useEffect(() => {
    setVisibleLines(0); setHighlighted([]);
    let i = 0;
    const iv = setInterval(() => {
      if (i >= t.summaryPoints.length) { clearInterval(iv); return; }
      setVisibleLines(v => v + 1);
      const idx = i;
      setTimeout(() => setHighlighted(h => [...h, idx]), 600);
      i++;
    }, 900);
    return () => clearInterval(iv);
  }, [t]);
  return (
    <div className="rounded-2xl border border-purple-300 bg-purple-50 p-5 h-full">
      <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <motion.div className="w-2 h-2 rounded-full bg-indigo-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <span className="text-purple-600 text-xs font-semibold tracking-wider uppercase">{isRTL ? "ÙŠÙƒØªØ¨ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ..." : "AI Writingâ€¦"}</span>
      </div>
      <div className="space-y-3">
        {t.summaryPoints.map((pt, i) => (
          <AnimatePresence key={i}>
            {i < visibleLines && (
              <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
                className={`flex gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <span className={`shrink-0 mt-0.5 text-sm font-bold transition-colors duration-700 ${highlighted.includes(i) ? "text-indigo-400" : "text-slate-700"}`}>â–¸</span>
                <p className={`text-sm leading-relaxed transition-all duration-700 ${highlighted.includes(i) ? "text-slate-900" : "text-slate-600"}`}
                  style={highlighted.includes(i) ? { textShadow: "0 0 16px rgba(99,102,241,0.4)" } : {}}>
                  {pt}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}

function FlashcardPanel({ t, isRTL }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <div style={{ perspective: "1000px" }} className="w-full" onClick={() => setFlipped(f => !f)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d", position: "relative", height: "188px", cursor: "pointer" }}>
          <div style={{ backfaceVisibility: "hidden", boxShadow: "0 0 38px rgba(139,92,246,0.16)" }}
            className="absolute inset-0 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 to-fuchsia-100 flex flex-col items-center justify-center px-6 gap-3"
          >
            <span className="text-4xl">ðŸ”¬</span>
            <span className="text-xl font-bold text-slate-900">{t.flashFront}</span>
            <span className="text-purple-600 text-xs">{t.flipHint}</span>
          </div>
          <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-fuchsia-100 to-purple-100 flex flex-col items-center justify-center px-6 gap-3">
            <span className="text-4xl">ðŸ’¡</span>
            <p className="text-slate-800 text-sm text-center leading-relaxed">{t.flashBack}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-2.5">
        {[0, 1, 2].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-8 bg-indigo-500" : "w-4 bg-purple-200"}`} />)}
      </div>
      <p className="text-slate-500 text-xs">{isRTL ? "Ù£ Ø¨Ø·Ø§Ù‚Ø§Øª Ù…Ù† Ø£ØµÙ„ Ù¡Ù¢" : "3 of 12 cards"}</p>
    </div>
  );
}

function QuizPanel({ t, isRTL }) {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    setSelected(null);
    const tm = setTimeout(() => setSelected(t.correctAnswer), 1500);
    return () => clearTimeout(tm);
  }, [t]);
  return (
    <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 h-full">
      <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <span>â“</span>
        <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">{isRTL ? "Ø³Ø¤Ø§Ù„ Ù¡ Ù…Ù† Ù¡Ù " : "Question 1 of 10"}</span>
      </div>
      <p className={`text-slate-800 font-semibold text-sm mb-4 leading-relaxed ${isRTL ? "text-right" : ""}`}>{t.quizQ}</p>
      <div className="space-y-2">
        {t.quizOpts.map((opt, i) => (
          <motion.button key={i} initial={{ opacity: 0, x: isRTL ? 16 : -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
            onClick={() => setSelected(i)}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all relative overflow-hidden ${isRTL ? "text-right" : "text-left"} ${
              selected === i ? i === t.correctAnswer ? "border-emerald-400 bg-emerald-500/20 text-emerald-900" : "border-red-400/60 bg-red-500/10 text-red-700"
              : "border-purple-200 bg-white text-slate-700 hover:border-purple-400"
            }`}>
            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <span>{opt}</span>
              <AnimatePresence>
                {selected === i && i === t.correctAnswer && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 14 }}>
                    <Check size={14} className="text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {selected === i && i === t.correctAnswer && (
              <motion.div className="absolute inset-0 rounded-xl bg-emerald-400/10"
                initial={{ scale: 0, opacity: 0.7 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.65 }} />
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected === t.correctAnswer && (
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className={`text-emerald-400 text-xs mt-3 font-semibold ${isRTL ? "text-right" : ""}`}>
            âœ“ {isRTL ? "Ø¥Ø¬Ø§Ø¨Ø© ØµØ­ÙŠØ­Ø©! Ø£Ø­Ø³Ù†Øª" : "Correct! Well done"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PPTPanel({ t, isRTL }) {
  const [active, setActive] = useState(0);
  const gradients = ["from-indigo-900 to-violet-900", "from-violet-900 to-indigo-900", "from-indigo-900 to-blue-900", "from-blue-900 to-indigo-900"];
  const icons = ["âš—ï¸", "ðŸ”—", "ðŸ“Š", "ðŸ“"];
  useEffect(() => {
    const iv = setInterval(() => setActive(s => (s + 1) % t.pptSlides.length), 2000);
    return () => clearInterval(iv);
  }, [t]);
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-300 bg-indigo-50 flex-1 min-h-36"
        style={{ boxShadow: "0 0 28px rgba(99,102,241,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ x: isRTL ? -65 : 65, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: isRTL ? 65 : -65, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute inset-0 bg-gradient-to-br ${gradients[active]} flex flex-col items-center justify-center p-6 gap-3`}>
            <span className="text-4xl">{icons[active]}</span>
            <h3 className="text-white font-bold text-lg text-center">{t.pptSlides[active]}</h3>
            <div className="flex flex-col gap-1.5 w-full max-w-48">
              {[0.7, 0.5, 0.85].map((w, i) => <div key={i} className="h-1.5 rounded-full bg-white/20" style={{ width: `${w * 100}%` }} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        {t.pptSlides.map((slide, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`flex-1 rounded-xl border text-xs py-2 px-1 transition-all truncate ${i === active ? "border-indigo-500 bg-indigo-600/30 text-white" : "border-purple-200 bg-white text-slate-600 hover:border-purple-300"}`}>
            {slide}
          </button>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FEATURES SHOWCASE  â€” section 2
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FEAT_ICONS = [FileText, Layers, HelpCircle, Presentation];

function ShowcaseSection({ lang, t, isRTL }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const iv = setInterval(() => setActive(a => (a + 1) % 4), 5000);
    return () => clearInterval(iv);
  }, [auto]);

  const panels = [
    <SummaryPanel key="s" t={t} isRTL={isRTL} />,
    <FlashcardPanel key="f" t={t} isRTL={isRTL} />,
    <QuizPanel key="q" t={t} isRTL={isRTL} />,
    <PPTPanel key="p" t={t} isRTL={isRTL} />,
  ];

  const pick = i => { setActive(i); setAuto(false); };

  return (
    <section id="features"
      style={{ scrollSnapAlign: "start", minHeight: "100vh", position: "relative", overflow: "hidden" }}
      className="flex flex-col items-center justify-center px-4 py-16">
      <GridBg opacity={0.03} />
      <RadialGlow opacity={0.09} size="90% 70%" pos="50% 50%" />

      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
        className="text-center mb-10 z-10">
        <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">{isRTL ? "Ø§Ù„Ù…ÙŠØ²Ø§Øª" : "Features"}</p>
        <h2 className="font-black leading-tight text-2xl md:text-4xl">{t.showcaseTitle}</h2>
        <p className="text-slate-500 text-sm mt-2">{t.showcaseSub}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.18 }} viewport={{ once: true }}
        className="relative z-10 w-full flex flex-col md:flex-row gap-4" style={{ maxWidth: 920 }}>

        {/* Sidebar tabs */}
        <div className="md:w-60 shrink-0 flex md:flex-col flex-row gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
          {t.features.map((feat, i) => {
            const Icon = FEAT_ICONS[i];
            const isActive = active === i;
            return (
              <motion.button key={i} onClick={() => pick(i)}
                className={`relative flex-shrink-0 md:flex-shrink rounded-2xl border px-4 py-3 overflow-hidden transition-all ${isRTL ? "text-right" : "text-left"} ${isActive ? "border-indigo-500/55 bg-indigo-100" : "border-purple-200 bg-white hover:border-purple-300"}`}
                style={isActive ? { boxShadow: "0 0 30px rgba(99,102,241,0.26), inset 0 0 22px rgba(99,102,241,0.06)" } : {}}>
                {isActive && (
                  <motion.div layoutId="tabGlow" className="absolute inset-0 rounded-2xl bg-indigo-600/10"
                    transition={{ type: "spring", stiffness: 180, damping: 22 }} />
                )}
                <div className={`relative flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`p-2 rounded-xl ${isActive ? "bg-indigo-600/32" : "bg-purple-100"}`}>
                    <Icon size={14} className={isActive ? "text-indigo-300" : "text-slate-500"} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold ${isActive ? "text-indigo-900" : "text-slate-600"}`}>{feat}</div>
                    <div className="text-xs text-slate-600 hidden md:block mt-0.5 leading-tight line-clamp-1">{t.featureDescs[i]}</div>
                  </div>
                  {isActive && !isRTL && <ChevronRight size={11} className="text-indigo-400 ml-auto hidden md:block shrink-0" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Display panel */}
        <div className="flex-1 rounded-3xl border border-purple-200 bg-white p-5 relative overflow-hidden"
          style={{ minHeight: 340, boxShadow: "0 0 55px rgba(99,102,241,0.07)" }}>
          <motion.div key={`bg-${active}`} className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}
            style={{ background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
              transition={{ duration: 0.48 }}
              className="relative z-10 h-full">
              {panels[active]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress dots */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}
        viewport={{ once: true }} className="flex gap-2 mt-6 z-10">
        {[0, 1, 2, 3].map(i => (
          <button key={i} onClick={() => pick(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-8 bg-indigo-500" : "w-3 bg-white/15 hover:bg-white/25"}`} />
        ))}
      </motion.div>
    </section>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REGISTRATION  â€” section 3
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RegistrationSection({ t, isRTL }) {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValidName = (value) => {
    const trimmed = value.trim();
    if (trimmed.length < 3) return false;
    const hasTwoWords = trimmed.split(/\s+/).length >= 2;
    if (!hasTwoWords) return false;
    return /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF' -]*$/.test(trimmed);
  };

  const isValidBahrainPhone = (value) => {
    const compact = value.replace(/[^\d+]/g, "");
    let local = compact;
    if (local.startsWith("+973")) local = local.slice(4);
    if (local.startsWith("973")) local = local.slice(3);
    if (local.startsWith("0")) local = local.slice(1);
    return /^\d{8}$/.test(local) && /^[13679]/.test(local);
  };

  const canSubmit = Boolean(
    isValidName(name) &&
    university &&
    (contactMethod === "email" ? email.trim() : isValidBahrainPhone(phone))
  );

  const submit = () => {
    if (!isValidName(name)) {
      setError(t.invalidName);
      return;
    }
    if (!university) return;
    if (contactMethod === "phone" && !isValidBahrainPhone(phone)) {
      setError(t.invalidPhone);
      return;
    }
    if (contactMethod === "email" && !email.trim()) return;
    setError("");
    setSubmitted(true);
  };

  return (
    <section id="register"
      style={{ scrollSnapAlign: "start", height: "100vh", position: "relative", overflow: "hidden" }}
      className="flex flex-col items-center justify-center px-4">
      <GridBg opacity={0.03} />
      <RadialGlow opacity={0.15} size="70% 55%" pos="50% 50%" />

      <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 85, damping: 15, delay: 0.1 }}
        viewport={{ once: true }}
        className="relative z-10 w-full rounded-3xl border backdrop-blur-sm p-8 md:p-12 text-center"
        style={{ maxWidth: 460, borderColor: "#d9c4ff", background: "#f8f4ff", boxShadow: "0 0 40px rgba(168,85,247,0.12)" }}>

        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.45 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <span>ðŸ¦</span><span>{t.earlyBird}</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} viewport={{ once: true }}
          className="font-black leading-tight mb-1 text-3xl md:text-4xl">{t.formHeadline}</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ delay: 0.44 }} viewport={{ once: true }}
          className="text-purple-500 text-lg font-semibold mb-8">{t.formSub}</motion.p>

        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56 }} viewport={{ once: true }} className="space-y-3">
            <div className="text-left">
              <label className={`block text-xs text-slate-400 mb-2 ${isRTL ? "text-right" : ""}`}>{t.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && canSubmit && submit()}
                placeholder={t.namePlaceholder}
                dir={isRTL ? "rtl" : "ltr"}
                className="w-full bg-white border border-purple-300 text-slate-800 placeholder-slate-400 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div className="text-left">
              <label className={`block text-xs text-slate-500 mb-2 ${isRTL ? "text-right" : ""}`}>{t.contactMethodLabel}</label>
              <div className={`grid grid-cols-2 gap-2 ${isRTL ? "text-right" : ""}`}>
                <button
                  type="button"
                  onClick={() => { setContactMethod("phone"); setError(""); }}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${contactMethod === "phone"
                    ? "border-indigo-500 bg-indigo-600/30 text-white"
                    : "border-purple-200 bg-white text-slate-600"
                    }`}
                >
                  {t.contactByPhone}
                </button>
                <button
                  type="button"
                  onClick={() => { setContactMethod("email"); setError(""); }}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${contactMethod === "email"
                    ? "border-indigo-500 bg-indigo-600/30 text-white"
                    : "border-purple-200 bg-white text-slate-600"
                    }`}
                >
                  {t.contactByEmail}
                </button>
              </div>
            </div>

            {contactMethod === "phone" ? (
              <input
                type="text"
                value={phone}
                onChange={e => {
                  const raw = e.target.value;
                  const normalized = raw
                    .replace(/[^\d+]/g, "")
                    .replace(/(?!^)\+/g, "");
                  setPhone(normalized);
                  if (error) setError("");
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (canSubmit) submit();
                    return;
                  }
                  const allowed = [
                    "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End",
                  ];
                  if (allowed.includes(e.key)) return;
                  if (e.key === "+" && e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes("+")) return;
                  if (/^\d$/.test(e.key)) return;
                  e.preventDefault();
                }}
                placeholder={t.phonePlaceholder}
                dir="ltr"
                inputMode="numeric"
                autoComplete="tel"
                className="w-full bg-white border border-purple-300 text-slate-800 placeholder-slate-400 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500 transition-all"
              />
            ) : (
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && canSubmit && submit()}
                placeholder={t.emailPlaceholder}
                dir={isRTL ? "rtl" : "ltr"}
                className="w-full bg-white border border-purple-300 text-slate-800 placeholder-slate-400 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-purple-500 transition-all"
              />
            )}

            {error && (
              <p className={`text-xs text-red-400 ${isRTL ? "text-right" : "text-left"}`}>{error}</p>
            )}

            <div className="text-left">
              <label className={`block text-xs text-slate-400 mb-2 ${isRTL ? "text-right" : ""}`}>{t.universityLabel}</label>
              <select
                value={university}
                onChange={e => setUniversity(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
                className="w-full bg-white border border-purple-300 text-slate-800 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-purple-500 transition-all"
              >
                <option value="" className="bg-white text-slate-500">{t.universityPlaceholder}</option>
                {t.universities.map((uni) => (
                  <option key={uni} value={uni} className="bg-white text-slate-800">
                    {uni}
                  </option>
                ))}
              </select>
            </div>
            <motion.button onClick={submit}
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.02 } : undefined}
              whileTap={canSubmit ? { scale: 0.97 } : undefined}
              className={`w-full text-white font-bold py-3.5 rounded-2xl text-sm transition-opacity ${canSubmit ? "" : "opacity-50 cursor-not-allowed"}`}
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", boxShadow: "0 0 32px rgba(168,85,247,0.4)" }}>
              {t.ctaBtn}
            </motion.button>
            <p className="text-slate-600 text-xs">{t.noSpam}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 190 }} className="py-8">
            <div className="text-5xl mb-4">ðŸŽ‰</div>
            <p className="text-slate-900 font-bold text-lg">{t.successTitle}</p>
            <p className="text-slate-600 text-sm mt-2">{t.successSub}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }} viewport={{ once: true }}
          className="flex justify-center gap-8 mt-8 pt-6 border-t border-purple-200/80">
          {t.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-indigo-400">{s.v}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }} viewport={{ once: true }}
        className="absolute bottom-6 z-10 flex flex-col items-center gap-3">
        <div className="flex gap-5">
          {["ð•", "ðŸ“˜", "ðŸ“¸", "ðŸ’¼"].map((icon, i) => (
            <button key={i} className="text-slate-600 hover:text-indigo-400 transition-colors text-lg">{icon}</button>
          ))}
        </div>
        <p className="text-slate-600 text-xs">{t.madeIn}</p>
      </motion.footer>
    </section>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ROOT  â€” sections: 0=hero  1=how-it-works  2=features  3=register
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function App() {
  const [lang, setLang] = useState("en");   // â† English is default
  const t = T[lang];
  const isRTL = lang === "ar";
  const scrollRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  // Track which snap section is active
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setActiveSection(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Programmatic scroll to any section by index
  const scrollTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * el.clientHeight, behavior: "smooth" });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="bg-white text-slate-900"
      style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; background: #fff; }
      `}</style>

      <Header
        lang={lang} setLang={setLang}
        t={t} isRTL={isRTL}
        scrollTo={scrollTo}
        activeSection={activeSection}
      />

      {/* Snap scroll container */}
      <div ref={scrollRef} className="overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory", height: "100vh" }}>
        <HeroSection lang={lang} t={t} isRTL={isRTL} />          {/* 0 */}
        <HowItWorksSection t={t} isRTL={isRTL} />                {/* 1 */}
        <ShowcaseSection lang={lang} t={t} isRTL={isRTL} />      {/* 2 */}
        <RegistrationSection t={t} isRTL={isRTL} />              {/* 3 */}
      </div>
    </div>
  );
}

