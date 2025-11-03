# 💪 AI Fitness Coach App

An AI-powered fitness assistant built with Next.js that generates personalized workout and diet plans using LLMs, with voice and image generation features for a more immersive experience.

## ✨ Features

### 📝 User Input Form
Users can provide their details including:
- **Personal Info**: Name, Age, Gender
- **Physical Metrics**: Height & Weight
- **Fitness Goals**: Weight Loss, Muscle Gain, Endurance, General Fitness, Strength, Flexibility
- **Current Fitness Level**: Beginner / Intermediate / Advanced
- **Workout Location**: Home / Gym / Outdoor
- **Dietary Preferences**: Vegetarian / Non-Vegetarian / Vegan / Keto / Paleo / Mediterranean
- **Optional Fields**: Medical history, stress level, allergies, and other notes

### 🧠 AI-Powered Plan Generation
The app uses LLM APIs to dynamically generate personalized plans:

- **🏋️ Workout Plan** — Daily exercise routines with:
  - Exercise names and descriptions
  - Sets, reps, and rest time
  - Duration and difficulty level
  - Weekly overview and tips

- **🥗 Diet Plan** — Comprehensive meal options:
  - Multiple options for breakfast, lunch, dinner, and snacks
  - Calorie and macro breakdown (protein, carbs, fats)
  - Ingredients and preparation instructions
  - Daily calorie and macro targets

- **💬 AI Tips & Motivation** — Expert guidance:
  - Lifestyle tips
  - Posture and form tips
  - Motivational quotes

**⚡ Prompt Engineering:**
- Each response is generated dynamically based on user input
- No hardcoded plans — all content is AI-generated and personalized
- Advanced JSON parsing handles AI response variations

### 🔊 Voice Features
- **Read My Plan** — Text-to-speech functionality for:
  - Workout plans
  - Diet plans
  - AI tips and motivation
- Uses browser's built-in Web Speech API (no API key required)
- Controls: Play, Pause, Stop
- Individual voice buttons for each section

### 🖼️ Image Generation
- Click any exercise or meal item to generate AI-powered images
- Uses FreePik API for realistic visual representations
- Examples:
  - "Barbell Squat" → realistic gym exercise image
  - "Grilled Chicken Salad" → appetizing food-style image

### 🧾 Additional Features
- **📄 PDF Export** — Download your complete fitness plan as a beautifully formatted PDF
- **🌗 Dark / Light Mode** — Toggle between themes with smooth animations
- **💾 Plan History** — Save and load multiple plans in browser localStorage
- **🔄 Regenerate Plan** — Generate a new plan with the same profile
- **⚡ Smooth Animations** — Framer Motion animations throughout the UI
- **💬 Daily Motivation Quote** — AI-generated inspirational quotes on the homepage
- **📱 Responsive Design** — Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI |
| **AI APIs** | OpenAI / Gemini / Claude (configurable) |
| **Voice** | Web Speech API, ElevenLabs API (optional) |
| **Images** | FreePik API |
| **PDF** | jsPDF, html2canvas |
| **Animations** | Framer Motion |
| **State Management** | React Hooks, localStorage |
| **Form Validation** | React Hook Form, Zod |
| **Deployment** | Vercel / Netlify |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- API keys for AI services (see Environment Variables)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nikhilshakya07/AI-Fitness-Coach.git
   cd AI-Fitness-Coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # AI PROVIDER - TEXT GENERATION (Workout/Diet Plans)
   # ============================================
   # Choose one or more providers:
   AI_API_KEY=your_ai_api_key
   AI_MODEL=openai/gpt-oss-20b:free
   # OR
   OPENAI_API_KEY=your_openai_key
   # OR
   GOOGLE_GEN_AI_API_KEY=your_gemini_key
   # OR
   ANTHROPIC_API_KEY=your_claude_key

   # ============================================
   # IMAGE GENERATION (Exercise & Meal Images)
   # ============================================
   FREEPIK_API_KEY=your_freepik_api_key
   # OR
   REPLICATE_API_TOKEN=your_replicate_token

   # ============================================
   # VOICE API (Text-to-Speech) - Optional
   # ============================================
   ELEVENLABS_API_KEY=your_elevenlabs_key

   # ============================================
   # APP CONFIGURATION
   # ============================================
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

1. **Generate a Plan**
   - Fill out the form on the `/generate` page
   - Click "Generate Plan"
   - Wait for AI to create your personalized plan (10-30 seconds)

2. **View Your Plan**
   - Navigate through tabs: Workout, Diet, Motivation & Tips
   - Each section is beautifully displayed with cards and animations

3. **Interact with Your Plan**
   - **Voice**: Click "Read" buttons to hear your plan
   - **Images**: Click exercise/meal names to generate images
   - **Save**: Click "Save Plan" to store it locally
   - **Export**: Click "Export PDF" to download your plan
   - **Regenerate**: Click "Regenerate" to create a new variation

4. **Manage Plans**
   - Click "Plan History" to view all saved plans
   - Load any saved plan from history
   - Delete plans you no longer need

## 🔑 Environment Variables

### Required (at least one AI provider)
- `AI_API_KEY` - For AI text generation (OpenRouter, etc.)
- `AI_MODEL` - Model identifier for your AI provider
- OR `OPENAI_API_KEY` - Direct OpenAI API key
- OR `GOOGLE_GEN_AI_API_KEY` - Google Gemini API key
- OR `ANTHROPIC_API_KEY` - Anthropic Claude API key

### Optional
- `FREEPIK_API_KEY` - For image generation (FreePik API)
- `REPLICATE_API_TOKEN` - Alternative image generation API
- `ELEVENLABS_API_KEY` - For premium voice features (fallback to Web Speech API)
- `NEXT_PUBLIC_APP_URL` - App URL for deployment

## 📁 Project Structure

```
ai-fitness-coach/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate-plan/      # Plan generation endpoint
│   │   ├── generate-image/     # Image generation endpoint
│   │   ├── generate-voice/     # Voice generation endpoint
│   │   └── motivation-quote/    # Daily quote endpoint
│   ├── dashboard/              # Dashboard page
│   ├── generate/               # Form page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── features/               # Feature components
│   │   ├── DarkModeToggle.tsx
│   │   ├── ImageGenerator.tsx
│   │   ├── MotivationQuote.tsx
│   │   ├── PDFExporter.tsx
│   │   ├── PlanHistory.tsx
│   │   └── SimpleVoicePlayer.tsx
│   ├── forms/                  # Form components
│   │   └── UserInputForm.tsx
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── plan/                   # Plan display components
│   │   ├── AITips.tsx
│   │   ├── DietPlan.tsx
│   │   └── WorkoutPlan.tsx
│   ├── providers/              # Context providers
│   │   └── ThemeProvider.tsx
│   └── ui/                     # Shadcn UI components
├── lib/
│   ├── api/                    # API clients
│   │   ├── ai-provider.ts
│   │   ├── image-generator.ts
│   │   └── elevenlabs.ts
│   ├── pdf/                    # PDF generation
│   │   └── generator.ts
│   ├── prompts/                # AI prompts
│   │   ├── diet-prompt.ts
│   │   ├── tips-prompt.ts
│   │   ├── workout-prompt.ts
│   │   └── quote-prompt.ts
│   ├── storage/                # Storage utilities
│   │   └── localStorage.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── json-parser.ts
│   │   ├── formatters.ts
│   │   └── ...
│   └── validations/            # Form validations
│       └── user-form.ts
├── hooks/                      # Custom hooks
│   └── use-toast.ts
└── public/                     # Static assets
```

## 🐛 Troubleshooting

### Plan Generation Fails
- Check API keys in `.env.local`
- Ensure at least one AI provider is configured
- Check browser console for detailed errors

### Images Not Generating
- Verify `FREEPIK_API_KEY` is set correctly
- Check API key is valid and has credits
- See browser console for API errors

### Voice Not Working
- Use Chrome or Edge for best compatibility
- Check browser permissions for audio
- Web Speech API is built-in (no API key needed)

### PDF Export Issues
- Check browser console for errors
- Ensure jsPDF library loaded correctly
- Try disabling browser extensions

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Nikhil Shakya**

- 📧 Email: [nikhilshakya1308@gmail.com](mailto:nikhilshakya1308@gmail.com)
- 🐙 GitHub: [@nikhilshakya07](https://github.com/nikhilshakya07)
- 💼 LinkedIn: [Nikhil Shakya](https://www.linkedin.com/in/nikhil-shakya07/)

## 🙏 Acknowledgments

- **Shadcn UI** - Beautiful UI components
- **Framer Motion** - Smooth animations
- **Next.js** - Amazing React framework
- **OpenRouter** - AI API access
- **FreePik** - Image generation API
- All the open-source libraries that made this project possible

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Add environment variables in Netlify dashboard

---

Made with ❤️ by [Nikhil Shakya](https://github.com/nikhilshakya07)
