NeuroMarketer
Overview
NeuroMarketer is an AI-powered marketing assistant designed for Russian-speaking marketers and small businesses. The application generates effective marketing copy across three primary modules:

Yandex.Direct Ads - Creates advertising headlines and text for Russia's leading search advertising platform
Email & Social Media - Generates content for email campaigns and social media posts (Instagram, VK, Telegram)
Loyalty Programs - Creates personalized messages for customer retention (birthday greetings, reactivation campaigns, special offers)
The application uses YandexGPT (via Yandex Cloud AI) for text generation and stores generation history in PostgreSQL for future reference and reuse.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React with TypeScript using Vite as the build tool

Routing: Wouter for client-side routing with two primary routes:

/ - Landing page showcasing features and value proposition
/app - Main workspace with tabbed interface for the three generation modules
UI Component System: shadcn/ui (Radix UI primitives) with Tailwind CSS

Design system follows Material Design + Linear-inspired aesthetics optimized for Russian text
Typography: Inter for body/UI, Plus Jakarta Sans for headings (both with excellent Cyrillic support)
Color system uses HSL-based CSS variables for theme consistency
Component library includes forms, cards, dialogs, tables, and other productivity-focused elements
State Management:

TanStack Query (React Query) for server state, caching, and data fetching
Local React state for form inputs and UI interactions
No global state management library needed due to simple data flow
Form Handling: Each module has a dedicated form component (YaDirectForm, EmailSocialForm, LoyaltyForm) with built-in validation and example data population

Backend Architecture
Server Framework: Express.js with TypeScript running on Node.js

API Structure:

RESTful endpoints under /api/*
Three generation endpoints: /api/generate/yadirect, /api/generate/email-social, /api/generate/loyalty
History management: /api/history for retrieving past generations
Favorite toggling and deletion endpoints for user-saved content
Request/Response Flow:

Client submits form data to generation endpoint
Server validates request using Zod schemas
Constructs prompt specific to the module
Calls YandexGPT API via OpenAI-compatible client
Parses AI response into structured format
Saves generation to database
Returns results to client
AI Integration:

YandexGPT accessed through Yandex Cloud Foundation Models API
Uses OpenAI SDK with custom baseURL for compatibility
Model: yandexgpt-lite via folder-specific endpoint
Temperature: 0.7 for creative but consistent outputs
Max tokens: 2000 for comprehensive responses
Prompt Engineering: Each module has dedicated prompt builder functions:

buildYaDirectPrompt() - Structures requirements for ad copy with character limits
buildEmailSocialPrompt() - Adapts tone/format based on channel and goal
buildLoyaltyPrompt() - Personalizes messages with customer context
Data Storage Solutions
Database: PostgreSQL accessed via Drizzle ORM

Schema Design:

generations {
  id: UUID (primary key)
  module: text ('yadirect' | 'email_social' | 'loyalty')
  inputJson: text (stores form data as JSON)
  outputText: text (raw AI response)
  isFavorite: boolean (user can mark favorites)
  createdAt: timestamp
}

Rationale:

Generations table uses JSONB-stored input for flexible schema evolution
Module field enables filtering by generation type
Favorite system allows users to bookmark useful outputs
ORM Choice: Drizzle selected for:

Type-safe queries with TypeScript inference
Minimal overhead compared to traditional ORMs
Migration generation from schema definitions
PostgreSQL-specific feature support
External Dependencies
AI Service:

YandexGPT via Yandex Cloud Foundation Models
API endpoint: https://llm.api.cloud.yandex.net/foundationModels/v1
Authentication: API 
Model identifier requires: 
Accessed through OpenAI SDK for convenient promise-based interface
Database:

PostgreSQL connection via DATABASE_URL environment variable
Connection pooling through pg library
Schema managed by Drizzle Kit migrations
UI Components:

Radix UI primitives for accessible, unstyled components
Tailwind CSS for utility-first styling
Lucide React for icons
All Russian text content hardcoded in components (no i18n library)
Development Tools:

Vite for fast development server and optimized production builds
esbuild for server-side bundling in production
TSX for TypeScript execution in development
Deployment Considerations:

Build process bundles client to dist/public and server to dist/index.cjs
Static file serving through Express in production
Environment variables must be set for YandexGPT and database access
