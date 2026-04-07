# CommParse Pro

> AI-powered communication parsing and analysis platform. Extract insights from emails, chat logs, meeting transcripts, and documents.

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://comm-parse-pro.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://comm-parse-pro.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Live Demo

**[https://comm-parse-pro.vercel.app](https://comm-parse-pro.vercel.app)**

## Features

| Feature | Description |
|:---|:---|
| **Email Parsing** | Extract structured data, action items, and stakeholders from email threads |
| **Transcript Analysis** | Process meeting transcripts with NLP to identify decisions and requirements |
| **AI Chat Assistant** | CommParse AI helps analyze communications with domain-specific prompts |
| **BRD Generation** | Auto-generate Business Requirements Documents from communication data |
| **Analytics Dashboard** | Track accuracy, precision, recall, F1 score, and processing metrics |
| **Dark Mode** | Full light/dark theme with CSS variables |
| **Google OAuth** | Sign in with Google alongside email/password authentication |
| **Export** | Download analysis results as PDF or DOCX |
| **Row-Level Security** | All data is private per user via Supabase RLS policies |

## Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Radix UI, Framer Motion |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| State | TanStack React Query, React Context |
| Forms | React Hook Form, Zod validation |
| Charts | Recharts |
| Export | jsPDF, docx |
| Deployment | Vercel |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/ayushjhaa1187-spec/comm-parse-pro.git
cd comm-parse-pro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

The app runs at `http://localhost:8080`.

## Environment Variables

| Variable | Description | Required |
|:---|:---|:---|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Yes |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Yes |

Google OAuth is configured in the Supabase Dashboard under Authentication > Providers.

## Database Schema

| Table | Description |
|:---|:---|
| `profiles` | User profiles (auto-created on signup, extends auth.users) |
| `projects` | Analysis projects with status and accuracy tracking |
| `documents` | Uploaded documents linked to projects |
| `parsed_documents` | Parsed communication data with JSONB parsed_data |
| `analysis_results` | Analysis output linked to parsed documents (results JSONB, summary) |
| `brds` | Generated BRDs with accuracy metrics |
| `chat_history` | AI chat messages with session grouping |
| `metrics` | Performance metrics linked to BRDs |
| `pipeline_logs` | Pipeline execution audit trail |

All tables use UUID primary keys, timestamp columns with `updated_at` triggers, `user_id` foreign keys, and Row-Level Security policies.

## API

All API functions use a standardized response format:

```typescript
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

### Parsed Documents
- `createParsedDocument(input)` — Create with Zod-validated title, content, source_type, parsed_data
- `getParsedDocuments()` — List all for current user
- `getParsedDocument(id)` — Get by ID
- `updateParsedDocument(id, input)` — Partial update
- `deleteParsedDocument(id)` — Delete by ID

### Analysis Results
- `createAnalysisResult(input)` — Create with document_id FK, analysis_type, results JSONB
- `getAnalysisResults(documentId?)` — List all or filter by document
- `deleteAnalysisResult(id)` — Delete by ID

### Chat History
- `saveChatMessage(input)` — Save message with role, content, session_id
- `getChatHistory(sessionId)` — Get messages for a session
- `getChatSessions()` — List all chat sessions
- `deleteChatSession(sessionId)` — Clear a conversation

### Profiles
- `getProfile()` — Get current user profile
- `updateProfile(input)` — Update name/avatar

## Project Structure

```
src/
  components/       # Reusable UI components
    ui/             # shadcn/ui primitives (45+ components)
    AppLayout.tsx   # Protected route layout shell
    DashboardLayout.tsx  # Sidebar + topbar + footer
    ThemeToggle.tsx      # Dark mode switch
    Footer.tsx           # Site footer
    SkeletonLoader.tsx   # Loading skeletons & empty/error states
  pages/            # Route pages
    Landing.tsx     # Public landing page
    Auth.tsx        # Login/signup with Google OAuth
    AuthCallback.tsx # OAuth redirect handler
    Dashboard.tsx   # Main dashboard
    ChatPage.tsx    # AI chat assistant
    UploadPage.tsx  # Data upload
    BrdGenerationPage.tsx # Live BRD streaming
    MetricsPage.tsx # Analytics charts
    SettingsPage.tsx # AI model config
    NotFound.tsx    # Custom 404
  hooks/            # Custom React hooks
  integrations/     # Supabase client & types
  lib/              # Helpers, API, utilities
  types/            # TypeScript type definitions
supabase/
  migrations/       # SQL migration files
```

## Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start dev server on port 8080 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run test` | Run tests |

## License

MIT -- Built by Ayush Kumar Jha
