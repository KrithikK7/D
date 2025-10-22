# K-Drama Journal

## Overview

A colorful, journal-style web application inspired by K-Drama aesthetics, featuring the "Red String of Fate" visual motif. The application enables users to read beautifully formatted journal entries organized into chapters and sections, with reading progress tracking and analytics. Admin users can manage content through inline editing capabilities.

The application serves two primary user roles: Readers who consume content with tracked progress, and Admins who create and manage chapters, sections, and pages with detailed analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight routing solution.

**State Management**: 
- TanStack Query (React Query) for server state management and API data fetching
- React Context API for authentication state (AuthContext)
- Local component state with React hooks

**UI Component System**: 
- Radix UI primitives for accessible, headless components
- Custom component library built on shadcn/ui design system
- Tailwind CSS for styling with custom K-Drama themed color palette
- Custom fonts: Nanum Myeongjo (headings), Noto Sans KR (body text)

**Key Design Patterns**:
- Component composition with reusable UI elements (Knot, ThreadBar, PolaroidCard, etc.)
- Separation of concerns between presentational and container components
- Custom hooks for cross-cutting concerns (useAuth, useToast, useIsMobile)

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API structure with route organization:
- `/api/auth/*` - Authentication endpoints
- `/api/chapters/*` - Chapter CRUD operations
- `/api/sections/*` - Section management
- `/api/pages/*` - Page content operations  
- `/api/reading-progress/*` - User reading analytics

**Data Access Layer**: Storage abstraction pattern through `IStorage` interface providing:
- Database operations encapsulation
- Consistent API for data access
- Separation between business logic and data persistence

**Server-Side Rendering**: Vite middleware integration for development with custom HTML template serving

### Data Storage

**Database**: PostgreSQL accessed through Neon serverless driver

**ORM**: Drizzle ORM for type-safe database queries and schema management

**Schema Design**:
- `users` - User accounts with role-based access (admin/reader/guest)
- `chapters` - Top-level content organization with ordering
- `sections` - Sub-divisions within chapters with metadata (mood, tags, thumbnails)
- `pages` - Individual content pages within sections
- `readingProgress` - Tracks user reading behavior and completion status

**Migration Strategy**: Drizzle Kit for schema migrations with PostgreSQL dialect

### Authentication & Authorization

**Authentication**: Simple username/password authentication with session storage in localStorage

**Authorization**: Role-based access control (RBAC) with three roles:
- `guest` - Read-only access to public content
- `reader` - Authenticated read access with progress tracking
- `admin` - Full content management and analytics access

**Session Management**: Client-side session persistence with JSON serialization in localStorage

### External Dependencies

**Database Service**: Neon PostgreSQL serverless database
- WebSocket-based connection pooling
- Connection string via `DATABASE_URL` environment variable

**UI Libraries**:
- Radix UI component primitives (dialogs, dropdowns, tooltips, etc.)
- Embla Carousel for carousel functionality
- Lucide React for icon system
- class-variance-authority and clsx for dynamic class composition

**Development Tools**:
- Replit-specific plugins for development banner and cartographer
- Runtime error overlay for debugging

**Build & Deployment**:
- esbuild for production server bundling
- Vite for client-side bundling and optimization
- ESM module format throughout

**Typography**:
- Google Fonts integration for Nanum Myeongjo and Noto Sans KR
- Preconnect optimization for font loading

### Key Architectural Decisions

**Monorepo Structure**: Shared schema definitions between client and server via `@shared` path alias, enabling type safety across the full stack.

**Session Strategy**: Client-side session management was chosen over server-side sessions for simplicity, though this limits security for sensitive operations. The guest role enables unauthenticated reading with optional progress tracking.

**Data Model Hierarchy**: Three-level content organization (Chapter → Section → Page) provides flexibility for content structuring while maintaining clear navigation paths.

**Reading Analytics**: Progress tracking uses both page-level and section-level granularity, recording completion milestones at 25%, 50%, 75%, and 100% for detailed engagement metrics.

**Component Design**: Heavy use of composition over inheritance with small, focused components following the K-Drama design system guidelines for consistent aesthetics.

**Build Optimization**: Separate build processes for client (Vite) and server (esbuild) with external package bundling for the server to reduce bundle size.