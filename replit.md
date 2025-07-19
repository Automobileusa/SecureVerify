# East Coast Credit Union Banking Application

## Overview

This is a full-stack Canadian credit union banking application built with React, Express.js, and PostgreSQL. The application provides secure online banking features including account management, transaction history, bill payments, cheque ordering, and external account linking with a two-factor authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on top of Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and East Coast Credit Union branding
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite with hot module replacement and path aliases for development

### Backend Architecture

- **Framework**: Express.js with TypeScript for the REST API server
- **Authentication**: Express sessions with PostgreSQL session store using connect-pg-simple
- **Password Security**: Custom scrypt-based password hashing with salt for enhanced security
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Session Management**: Express sessions with secure cookie configuration

## Key Components

### Authentication System

The application implements a two-factor authentication system:

- **Primary Authentication**: Username/password login using scrypt for secure password hashing
- **Security Question**: Instead of SMS/email OTP, users must answer a security question ("In what year was your account opened?") with the expected answer being "2013"
- **Session Management**: Server-side sessions stored in PostgreSQL with automatic expiry

### Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **Users**: Store user credentials, personal information, and security answers
- **Accounts**: Multiple account types (chequing, savings, credit) per user with balances
- **Transactions**: Complete transaction history with categories and reference numbers
- **Payees**: User-defined payees for bill payments
- **Bill Payments**: Scheduled and completed bill payment records
- **Cheque Orders**: Orders for personal and business cheques with tracking

### Core Banking Features

1. **Account Management**: View multiple accounts with real-time balances
2. **Transaction History**: Detailed transaction logs with search and filtering
3. **Bill Payments**: Pay bills to registered payees with scheduling options
4. **Cheque Ordering**: Order personal or business cheques with quantity options
5. **External Account Linking**: Connect external bank accounts (UI placeholder)

## Data Flow

1. **Authentication Flow**: Login → Security Question → Session Creation → Dashboard Access
2. **Account Data**: Real-time account balances and transaction history via REST API
3. **Bill Payments**: Form submission → Validation → Database storage → Confirmation
4. **Cheque Orders**: Order details → Cost calculation → Processing → Email confirmation

## External Dependencies

### Frontend Dependencies
- **Radix UI**: Accessible component primitives (@radix-ui/*)
- **TanStack Query**: Server state management (@tanstack/react-query)
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date formatting and manipulation
- **Wouter**: Client-side routing
- **Tailwind CSS**: Utility-first styling

### Backend Dependencies
- **Drizzle ORM**: Type-safe database operations (drizzle-orm)
- **Neon Database**: PostgreSQL serverless driver (@neondatabase/serverless)
- **Express Session**: Session management with PostgreSQL store
- **Zod**: Runtime type validation
- **Passport**: Authentication middleware (not currently used but imported)

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Node.js/tsx**: Backend development with TypeScript execution
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite build with output to `dist/public`
- **Backend**: ESBuild bundling of server code to `dist/index.js`
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **Environment**: Production-ready session configuration with trust proxy

### Key Configuration Files
- **Vite Config**: Frontend build with path aliases and Replit integration
- **Drizzle Config**: Database schema management and migrations
- **TypeScript Config**: Shared configuration for client, server, and shared code
- **Tailwind Config**: Custom design system with East Coast Credit Union branding

The application follows a monorepo structure with clear separation between client, server, and shared code, making it maintainable and scalable for a credit union's banking needs.