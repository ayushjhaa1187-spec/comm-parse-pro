# Changelog

All notable changes to CommParse Pro will be documented in this file.

## [1.1.0] - 2026-04-06

### Added
- **Auth**: Google OAuth sign-in alongside email/password
- **Auth**: Auth callback route for OAuth redirect handling
- **Auth**: Full name field on signup form
- **Database**: `profiles` table with auto-creation trigger on user signup
- **Database**: `parsed_documents` table (id, user_id, title, content, source_type, parsed_data jsonb, status)
- **Database**: `analysis_results` table (id, user_id, document_id FK, analysis_type, results jsonb, summary)
- **Database**: `chat_history` table (id, user_id, role, content, session_id)
- **Database**: RLS policies on all new tables
- **Database**: `updated_at` triggers on new tables
- **API**: CRUD routes for parsed_documents, analysis_results, chat_history, profiles with Zod validation
- **API**: Standardized `{ success, data, error }` response format
- **AI Chat**: New `/dashboard/chat` page with CommParse AI assistant
- **AI Chat**: Domain-specific system prompt for communication analysis
- **AI Chat**: Typing indicator with animated dots
- **AI Chat**: Error handling with retry capability
- **AI Chat**: Clear conversation with DB cleanup
- **AI Chat**: Message history saved to Supabase
- **AI Chat**: Unique responses based on input content (fixes same-response bug)
- **UI**: Dark mode toggle with CSS variables (light: #f7f6f2/#01696f, dark: #0f0f0f/#4f98a3)
- **UI**: Inter font across entire application
- **UI**: Sticky navbar on landing page
- **UI**: Mobile hamburger menu
- **UI**: Skeleton loaders for dashboard, cards, tables, and chat
- **UI**: Empty state and error state components
- **UI**: Custom 404 page with navigation options
- **UI**: Footer with branding
- **UI**: User menu in navbar with avatar (supports Google profile pictures)
- **Docs**: `.env.example` with all required environment variables
- **Docs**: `CHANGELOG.md` (this file)
- **Docs**: `.prettierrc` configuration
- **Docs**: Updated README with badges, features, tech stack, API docs

### Changed
- Rebranded from "BRD Agent" to "CommParse Pro"
- Updated color scheme to teal primary (light: #01696f, dark: #4f98a3)
- AppLayout now delegates to DashboardLayout for consistent UI
- DashboardLayout sidebar now includes AI Chat navigation item
- Protected route loading state now shows skeleton loader instead of text

## [1.0.0] - 2026-02-22

### Added
- Initial release with dashboard, upload, BRD generation, metrics, and settings
- Supabase auth with email/password
- PDF and DOCX export
- Pipeline visualization
- Demo datasets (Enron, AMI, Meeting Transcripts)
