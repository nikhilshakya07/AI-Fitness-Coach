# 💪 AI Fitness Coach App - Implementation Plan

## 📋 Project Overview
An AI-powered fitness assistant built with Next.js that generates personalized workout and diet plans using LLMs, with voice and image generation features.

---

## 📦 Dependencies to Install

### Core Dependencies
```bash
# UI Components & Styling
npm install shadcn-ui @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-toast
npm install lucide-react clsx tailwind-merge class-variance-authority

# Form Management
npm install react-hook-form @hookform/resolvers zod

# Animations
npm install framer-motion

# PDF Export
npm install jspdf html2canvas

# Storage (localStorage wrapper)
npm install use-local-storage-state

# API Clients
npm install openai @google/generative-ai @anthropic-ai/sdk

# Voice (ElevenLabs)
npm install axios

# Image Generation (Replicate)
npm install replicate

# Dark Mode
npm install next-themes

# Date handling
npm install date-fns
```

### Dev Dependencies (if needed)
```bash
npm install -D @types/jspdf
```

---

## 🏗️ Proposed Project Structure

```
ai-fitness-coach/
├── app/
│   ├── (routes)/
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main dashboard with plans
│   │   └── generate/
│   │       └── page.tsx              # Plan generation page
│   ├── api/
│   │   ├── generate-plan/
│   │   │   └── route.ts             # API route for plan generation
│   │   ├── generate-image/
│   │   │   └── route.ts             # API route for image generation
│   │   ├── generate-voice/
│   │   │   └── route.ts             # API route for TTS
│   │   └── motivation-quote/
│   │       └── route.ts             # API route for daily quotes
│   ├── components/
│   │   └── ui/                      # Shadcn UI components
│   ├── layout.tsx
│   ├── page.tsx                     # Landing/Input form page
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── ui/                          # Reusable UI components (shadcn)
│   ├── forms/
│   │   ├── UserInputForm.tsx        # Main user input form
│   │   └── FormField.tsx            # Reusable form field
│   ├── plan/
│   │   ├── WorkoutPlan.tsx          # Workout plan display
│   │   ├── DietPlan.tsx             # Diet plan display
│   │   ├── AITips.tsx               # AI tips section
│   │   └── PlanCard.tsx             # Reusable plan card
│   ├── features/
│   │   ├── VoicePlayer.tsx          # TTS player component
│   │   ├── ImageGenerator.tsx       # Image generation modal
│   │   ├── PDFExporter.tsx          # PDF export button
│   │   ├── DarkModeToggle.tsx       # Theme switcher
│   │   └── MotivationQuote.tsx      # Daily quote component
│   ├── layout/
│   │   ├── Header.tsx               # App header
│   │   └── Footer.tsx               # App footer
│   └── providers/
│       └── ThemeProvider.tsx        # Dark mode provider
├── lib/
│   ├── utils/
│   │   ├── cn.ts                    # Classname utility
│   │   └── formatters.ts            # Date/number formatters
│   ├── api/
│   │   ├── openai.ts                # OpenAI client
│   │   ├── gemini.ts                # Gemini client
│   │   ├── claude.ts                # Claude client
│   │   ├── elevenlabs.ts            # ElevenLabs TTS client
│   │   ├── replicate.ts             # Replicate image client
│   │   └── ai-provider.ts            # AI provider abstraction
│   ├── prompts/
│   │   ├── workout-prompt.ts        # Workout plan prompts
│   │   ├── diet-prompt.ts           # Diet plan prompts
│   │   ├── tips-prompt.ts           # Tips & motivation prompts
│   │   └── quote-prompt.ts          # Daily quote prompts
│   ├── storage/
│   │   ├── localStorage.ts          # LocalStorage utilities
│   │   └── supabase.ts              # Supabase client (optional)
│   ├── pdf/
│   │   └── generator.ts             # PDF generation utility
│   └── types/
│       └── index.ts                 # TypeScript types/interfaces
├── hooks/
│   ├── usePlanGeneration.ts         # Plan generation hook
│   ├── useVoiceGeneration.ts        # Voice generation hook
│   ├── useImageGeneration.ts        # Image generation hook
│   ├── useLocalStorage.ts           # LocalStorage hook
│   └── useTheme.ts                  # Theme hook
├── public/
│   └── assets/                      # Static assets
├── .env.local                       # Environment variables
├── .env.example                     # Example env file
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts               # Tailwind config
├── components.json                  # Shadcn config
└── package.json
```

---

## 🎯 Step-by-Step Implementation Plan

### Phase 1: Project Setup & Foundation (Commit 1)
- [ ] Install all dependencies
- [ ] Set up Shadcn UI components
- [ ] Configure Tailwind CSS properly
- [ ] Set up project folder structure
- [ ] Create TypeScript types/interfaces
- [ ] Set up environment variables structure
- [ ] Create utility functions (cn, formatters)
- [ ] **Commit:** "Setup: Project structure and dependencies"

### Phase 2: UI Components & Styling (Commit 2)
- [ ] Create reusable UI components (Button, Input, Card, etc. from shadcn)
- [ ] Implement Dark Mode provider and toggle
- [ ] Create Header and Footer components
- [ ] Set up responsive layout
- [ ] Add basic styling and theme
- [ ] **Commit:** "Feat: UI components and dark mode setup"

### Phase 3: User Input Form (Commit 3)
- [ ] Create user input form component
- [ ] Implement form validation with Zod
- [ ] Add all required fields:
  - Name, Age, Gender
  - Height & Weight
  - Fitness Goal (dropdown)
  - Fitness Level (dropdown)
  - Workout Location (radio/select)
  - Dietary Preferences (select)
  - Optional fields (Medical history, stress level)
- [ ] Create form submission handler
- [ ] **Commit:** "Feat: User input form with validation"

### Phase 4: AI Integration Setup (Commit 4)
- [ ] Set up AI provider abstraction layer
- [ ] Implement OpenAI client
- [ ] Create prompt templates for:
  - Workout plans
  - Diet plans
  - Tips & motivation
  - Daily quotes
- [ ] Set up API routes structure
- [ ] Test API connection
- [ ] **Commit:** "Feat: AI provider setup and prompt templates"

### Phase 5: Plan Generation (Commit 5)
- [ ] Create API route for plan generation (`/api/generate-plan`)
- [ ] Implement plan generation logic
- [ ] Create WorkoutPlan component
- [ ] Create DietPlan component
- [ ] Create AITips component
- [ ] Connect form submission to plan generation
- [ ] Add loading states
- [ ] **Commit:** "Feat: AI-powered plan generation"

### Phase 6: Plan Display & UI (Commit 6)
- [ ] Create plan display dashboard page
- [ ] Style workout plan cards
- [ ] Style diet plan cards
- [ ] Add animations with Framer Motion
- [ ] Implement "Regenerate Plan" feature
- [ ] Add error handling and retry logic
- [ ] **Commit:** "Feat: Plan display with animations"

### Phase 7: Voice Features (Commit 7)
- [ ] Set up ElevenLabs API integration
- [ ] Create API route for TTS (`/api/generate-voice`)
- [ ] Create VoicePlayer component
- [ ] Add "Read My Plan" functionality
- [ ] Implement section selection (Workout/Diet)
- [ ] Add audio controls (play, pause, stop)
- [ ] **Commit:** "Feat: Text-to-speech voice features"

### Phase 8: Image Generation (Commit 8)
- [ ] Set up Replicate or image generation API
- [ ] Create API route for image generation (`/api/generate-image`)
- [ ] Create ImageGenerator modal component
- [ ] Add click handlers to exercise/meal items
- [ ] Implement image generation on click
- [ ] Add loading states for image generation
- [ ] Display generated images
- [ ] **Commit:** "Feat: AI image generation for exercises and meals"

### Phase 9: Daily Motivation Quote (Commit 9)
- [ ] Create API route for quotes (`/api/motivation-quote`)
- [ ] Create MotivationQuote component
- [ ] Implement daily quote generation
- [ ] Add quote display on dashboard
- [ ] **Commit:** "Feat: Daily AI motivation quotes"

### Phase 10: Local Storage & Persistence (Commit 10)
- [ ] Create localStorage utility functions
- [ ] Implement save plan functionality
- [ ] Add load saved plans feature
- [ ] Create plan history component
- [ ] **Commit:** "Feat: Local storage for plan persistence"

### Phase 11: PDF Export (Commit 11)
- [ ] Install and set up jsPDF
- [ ] Create PDF generator utility
- [ ] Create PDFExporter component
- [ ] Implement export functionality
- [ ] Style PDF output
- [ ] **Commit:** "Feat: PDF export functionality"

### Phase 12: Polish & Enhancements (Commit 12)
- [ ] Add smooth transitions and animations
- [ ] Improve error handling across all features
- [ ] Add loading skeletons
- [ ] Optimize API calls and caching
- [ ] Add user feedback (toasts/notifications)
- [ ] Mobile responsiveness improvements
- [ ] Accessibility improvements
- [ ] **Commit:** "Feat: UI polish and enhancements"

### Phase 13: Testing & Bug Fixes (Commit 13)
- [ ] Test all features end-to-end
- [ ] Fix any bugs
- [ ] Performance optimization
- [ ] **Commit:** "Fix: Bug fixes and optimizations"

### Phase 14: Documentation & Final Touches (Commit 14)
- [ ] Update README with setup instructions
- [ ] Add environment variables documentation
- [ ] Add code comments where needed
- [ ] **Commit:** "Docs: Update documentation"

---

## 🔑 Environment Variables Required

Create a `.env.local` file with:

```env
# AI Provider - Choose one or more
OPENAI_API_KEY=your_openai_key
GOOGLE_GEN_AI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key

# Voice
ELEVENLABS_API_KEY=your_elevenlabs_key

# Image Generation
REPLICATE_API_TOKEN=your_replicate_token
# OR
OPENAI_IMAGE_API_KEY=your_openai_key

# Optional - Supabase (for cloud storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 📝 Notes

1. **Modular Structure**: Each feature is in its own folder/module for easy maintenance
2. **Incremental Commits**: Each phase is a separate commit for clean Git history
3. **Type Safety**: All components and functions use TypeScript
4. **Reusability**: Components are designed to be reusable
5. **Error Handling**: All API calls should have proper error handling
6. **Loading States**: All async operations should show loading states
7. **Responsive Design**: Mobile-first approach with Tailwind

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

