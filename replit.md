# Survey Kiosk Application

## Overview

This is a customer survey kiosk application built with React and Express. It provides an interactive interface for collecting customer feedback through various question types including 5-point ratings, 10-point ratings, and free-text responses. The application currently stores all survey data in the browser's local storage, with a PostgreSQL database schema defined for potential future backend integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for state management and data fetching

**UI Component System**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component variants managed through class-variance-authority
- Comprehensive UI component library including forms, dialogs, cards, and feedback elements

**State Management Strategy**
- Local storage for survey questions, responses, and session tracking
- Session-based survey flow with progress tracking
- Frontend-only data persistence (no backend calls currently implemented)

**Application Flow**
- Three-screen progression: Welcome → Survey → Completion
- Question-by-question navigation with progress tracking
- Support for optional and required questions
- Session management with unique IDs for tracking individual survey completions

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Vite middleware integration for development hot-reload
- Static file serving for production builds
- Request logging middleware for API route monitoring

**Database Layer**
- Drizzle ORM configured for PostgreSQL via Neon serverless driver
- Schema defines three tables: survey_questions, survey_responses, and survey_sessions
- Zod integration for runtime validation of database operations
- Migration support through drizzle-kit

**API Design**
- RESTful API structure with `/api` prefix convention
- Route registration system prepared but not yet implemented
- Storage interface defined as abstraction layer (currently using MemStorage stub)

### Data Storage Solutions

**Current Implementation**
- Browser localStorage for all survey data persistence
- Survey questions hardcoded as default values in storage utility
- Session tracking with unique identifiers
- Response storage keyed by session and question IDs

**Database Schema (Prepared for Future Use)**
- `survey_questions`: Question text, type (rating_5, rating_10, text), required flag, ordering
- `survey_responses`: Links sessions to question answers with timestamps
- `survey_sessions`: Tracks survey progress and completion status
- PostgreSQL-specific features: UUID generation, timestamp defaults

**Design Rationale**
- Local storage chosen for immediate deployment without backend dependencies
- Database schema prepared for migration when backend storage is needed
- Schema supports multiple concurrent survey sessions
- Flexible question type system allows for easy expansion

### External Dependencies

**UI & Styling**
- @radix-ui/* family: Accessible UI primitives for all interactive components
- Tailwind CSS: Utility-first styling framework
- shadcn/ui: Pre-built component patterns following Radix + Tailwind conventions

**Database & ORM**
- @neondatabase/serverless: PostgreSQL driver optimized for serverless environments
- drizzle-orm: Type-safe SQL query builder and ORM
- drizzle-zod: Integration layer for Zod validation with Drizzle schemas

**Development Tools**
- @replit/vite-plugin-*: Replit-specific development enhancements
- tsx: TypeScript execution for development server
- esbuild: Fast bundling for production backend code

**Form Handling**
- react-hook-form: Form state management (installed but not actively used in current implementation)
- @hookform/resolvers: Validation resolver integration
- zod: Runtime type validation and schema definition

**Utilities**
- date-fns: Date formatting and manipulation
- nanoid: Unique ID generation for sessions
- clsx/class-variance-authority: Conditional CSS class composition