# Scanner Tracker - Delivery Scanner Management System

## Overview

Scanner Tracker is a Progressive Web Application (PWA) designed for managing delivery scanner assignments in warehouse and logistics operations. The system enables staff to track scanner assignments to drivers, manage returns, and generate daily reports. Built with a mobile-first approach, it prioritizes efficiency for daily barcode scanning operations with offline-capable functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **SPA (Single Page Application)** architecture with client-side state management

**UI Component System**
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Material Design with Fluent influences** for productivity-focused interface
- Follows "New York" style variant from shadcn configuration

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management
- **Dexie.js** for IndexedDB operations providing client-side database
- **dexie-react-hooks** for reactive database queries in components

**Offline-First Strategy**
- Service Worker registration for offline capability
- IndexedDB (via Dexie) as local-first data store
- Progressive Web App manifest for installability
- All scanner/driver/assignment data stored client-side

**Internationalization**
- Custom context-based i18n system supporting English and Dutch
- Language preference persisted in localStorage
- Translation keys typed for compile-time safety

**Barcode Scanning**
- **html5-qrcode** library for camera-based barcode scanning
- Manual input fallback for Zebra scanner compatibility
- Batch scanning support for multiple returns

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for HTTP server
- Currently minimal backend - designed for future API integration
- In-memory storage interface with planned database migration

**Session Management**
- Prepared for **express-session** with PostgreSQL store
- **connect-pg-simple** configured for session persistence

**Development Features**
- Custom request logging middleware
- Vite middleware integration for HMR in development
- Static file serving for production builds

### Data Storage Solutions

**Client-Side Database (Primary)**
- **Dexie.js** wrapper around IndexedDB
- Schema version 1 with three entity tables:
  - `scanners`: Scanner registry (id, registeredAt)
  - `drivers`: Driver list (name, addedAt)
  - `assignments`: Daily assignment records (id, scannerId, driverName, assignedTime, returnTime, status, date)

**Planned Server Database**
- **PostgreSQL** via Neon serverless driver
- **Drizzle ORM** for type-safe database queries
- Migration system configured but not yet implemented
- Schema defined in `shared/schema.ts` with Zod validation

**Data Architecture Decision**
- **Client-first approach** chosen for offline reliability in warehouse environments
- Scanner assignments reset daily (date-based grouping)
- Scanner and driver registries persist long-term
- Future sync mechanism planned between client IndexedDB and PostgreSQL

### External Dependencies

**Core Libraries**
- `@tanstack/react-query`: Server state and cache management
- `dexie` + `dexie-react-hooks`: Client-side database with React integration
- `html5-qrcode`: Camera-based barcode scanning
- `wouter`: Lightweight routing (chosen over react-router for smaller bundle)
- `zod`: Runtime type validation for schemas
- `date-fns`: Date formatting and manipulation

**UI Component Dependencies**
- `@radix-ui/*`: 20+ primitive components for accessible UI
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Component variant management
- `lucide-react`: Icon library
- `cmdk`: Command palette component

**Development Tools**
- `vite`: Frontend build tool and dev server
- `tsx`: TypeScript execution for Node.js
- `esbuild`: Server bundling for production
- `drizzle-kit`: Database migration management

**PDF Generation**
- `jspdf` + `jspdf-autotable`: Client-side PDF report generation

**Styling Utilities**
- `clsx` + `tailwind-merge`: Conditional className utilities
- `autoprefixer` + `postcss`: CSS processing

**Replit-Specific**
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development banner

### Authentication & Authorization

**Current Implementation**
- Basic login form without server validation
- Designed for single-device, single-user workflow
- No persistent authentication state

**Planned Enhancement**
- Server-side session management with PostgreSQL backing
- Role-based access if multi-user support is added

### Design System

**Typography**
- Primary: Inter (Google Fonts) for UI text
- Monospace: JetBrains Mono for scanner IDs and data
- Semantic hierarchy with Tailwind text utilities

**Color System**
- CSS custom properties for theme tokens
- Light/dark mode support via CSS variables
- Neutral base color with customizable accent colors

**Spacing & Layout**
- Tailwind spacing scale (2, 4, 6, 8, 12, 16)
- Max-width container (max-w-4xl) for main content
- Mobile-first responsive design with large tap targets for barcode operations