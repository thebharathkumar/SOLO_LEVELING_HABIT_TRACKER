# Shadow Habits - Solo Leveling Inspired Habit Tracker

## Overview

Shadow Habits is a gamified habit tracker inspired by the anime Solo Leveling, where users level up like the protagonist Sung Jin-Woo by completing daily habits. The application transforms habit formation into an RPG-like experience with real financial consequences - users earn experience points and currency for completing habits, but face actual money penalties through Stripe payments for failures. The system features a dark fantasy aesthetic with Solo Leveling-themed UI elements, character progression, achievement systems, and skill trees.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built with **React 18** and **TypeScript**, using **Vite** as the build tool for fast development and hot module replacement. The UI leverages **shadcn/ui** components with **Tailwind CSS** for styling, implementing a dark fantasy theme with custom CSS variables for Solo Leveling-inspired colors (midnight blue, electric purple, glowing gold). **Radix UI** primitives provide accessible component foundations, while **React Hook Form** with **Zod** validation handles form management throughout the application.

State management uses **TanStack Query (React Query)** for server state synchronization and caching, eliminating the need for complex client-side state management. The routing system utilizes **Wouter** as a lightweight alternative to React Router, supporting both authenticated and public routes with conditional rendering based on user authentication status.

### Backend Architecture
The server runs on **Express.js** with **TypeScript** in ESM format, providing a REST API architecture. Authentication is handled through **Replit's OpenID Connect (OIDC)** system using **Passport.js** strategies, with session management via **express-session** and **PostgreSQL** session storage. This design ensures secure user authentication while integrating seamlessly with Replit's ecosystem.

The server implements a clean separation of concerns with dedicated modules for database operations (`storage.ts`), route handlers (`routes.ts`), and authentication middleware (`replitAuth.ts`). All API endpoints require authentication except for public routes, ensuring data security and user privacy.

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database, accessed through **Drizzle ORM** with the **Neon serverless driver** for connection pooling and performance optimization. The database schema supports the complete gamification system including:

- User profiles with RPG stats (level, experience, character class, stats)
- Habit definitions with categories and reward/penalty amounts
- Daily habit completions with experience tracking
- Achievement system with progress tracking
- Skill trees and character progression
- Financial penalties and rewards for Stripe integration
- Session storage for authentication persistence

The schema uses **Zod** for runtime type validation, ensuring data integrity between client and server. Database migrations are managed through **Drizzle Kit** for version control and deployment consistency.

### Authentication and Authorization
Authentication leverages **Replit's OIDC provider** with custom Passport.js strategy implementation. The system maintains user sessions in PostgreSQL using **connect-pg-simple**, providing persistent authentication across browser sessions. User profiles are automatically created or updated during authentication, storing essential information like email, name, and profile images.

Authorization is implemented through middleware that protects all API routes except authentication endpoints. The system supports automatic user creation and profile synchronization, making onboarding seamless for new users.

### Payment Integration
Financial accountability is implemented through **Stripe** integration, handling both penalty payments and reward distributions. The system creates payment intents for penalty amounts when users fail to complete habits, with configurable penalty destinations (charities, accountability partners). The checkout flow uses **Stripe Elements** with **React Stripe.js** for secure payment processing.

Payment processing includes webhook support for handling payment confirmations, automatic penalty marking, and integration with the user progression system. This creates real financial stakes that motivate consistent habit completion.

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting with automatic scaling and connection pooling
- **Replit Authentication**: OpenID Connect provider for user authentication and session management
- **Stripe**: Payment processing platform for handling financial penalties and rewards

### UI and Styling
- **shadcn/ui**: Component library providing accessible, customizable React components
- **Radix UI**: Primitive components for building accessible user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Icon library providing consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR for development workflow
- **TypeScript**: Static typing for enhanced development experience
- **Drizzle ORM**: Type-safe database toolkit with excellent TypeScript integration
- **TanStack Query**: Server state management and data synchronization
- **React Hook Form**: Form library with built-in validation support

### Fonts and Assets
- **Google Fonts**: Inter for body text, Orbitron for futuristic elements
- **Font Awesome**: Icon fonts for gaming-themed iconography
- **Unsplash**: Placeholder images for character avatars and UI elements

The application is designed for deployment on Replit with environment-based configuration supporting development and production modes. The architecture prioritizes type safety, performance, and user experience while maintaining the gamified aesthetic that makes habit tracking engaging and motivating.
