# LiteFi Admin Dashboard

A modern, responsive admin dashboard for the LiteFi financial platform built with Next.js 15, shadcn UI, and TypeScript.

## Overview

The LiteFi Admin Dashboard is a comprehensive interface for financial administrators to manage users, investments, loans, and system settings. It features role-based access control, detailed analytics, and a modern UI built with the latest web technologies.

## Features

- **Modern UI**: Clean, responsive design using shadcn UI components and Tailwind CSS
- **Role-Based Access Control**: Different views and permissions based on admin roles
- **Dashboard Analytics**: Visual representation of key metrics
- **User Management**: View and manage user accounts
- **Investment Management**: Track and process investment applications
- **Loan Management**: Review loan applications and monitor repayments
- **Settings Management**: Configure system parameters and business rules
- **Admin Management**: Create and manage admin users with different permission levels
- **Notification System**: Real-time notifications for important events and updates
- **Responsive Design**: Optimized for desktop and mobile devices

## Recent Enhancements

- **Custom Branding**: Implemented custom LiteFi SVG logo throughout the application
- **Admin User Management**: Added functionality to create, edit, and activate/deactivate admin users
- **Notification System**: Implemented dropdown and toast notifications with read/unread status
- **Improved UX**: Enhanced user experience with loading states, error handling, and visual feedback
- **TypeScript Improvements**: Resolved type errors and improved type safety throughout the codebase

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Library**: shadcn UI (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form with zod validation
- **Icons**: Lucide React
- **Authentication**: JWT with secure HTTP-only cookies
- **API Integration**: Custom API client with Next.js API routes

## Project Structure

```
/litefi-admin
  /public                   # Static assets
    /assets                 # Images and icons
      litefi.svg            # Company logo
  /src                      # Source code
    /app                    # Next.js App Router pages
      /api                  # API routes
        /admin              # Admin API routes
      /dashboard            # Dashboard page
      /users                # Users management
      /investments          # Investments management
      /loans                # Loans management
      /settings             # System settings
      /roles                # Role management
      /login                # Login page
      layout.tsx            # Root layout with global providers
    /components             # Reusable components
      /auth                 # Authentication components
        AuthProvider.tsx    # Authentication context provider
      /layout               # Layout components
        Header.tsx          # App header with notifications and user menu
        Sidebar.tsx         # Navigation sidebar
      /ui                   # UI components (shadcn)
        button.tsx
        toast.tsx
        input.tsx
        ...
      /roles                # Role management components
        AddAdminModal.tsx   # Modal for adding new admins
        EditAdminModal.tsx  # Modal for editing existing admins
      /notifications        # Notification components
        NotificationDropdown.tsx # Notification dropdown in header
    /lib                    # Utility functions and helpers
      api.ts                # API client
      auth.ts               # Authentication utilities
      types.ts              # TypeScript type definitions
      utils.ts              # General utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- LiteFi Backend API running (or mock API)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LiteFiLimited/LiteFi-Admin.git
   cd LiteFi-Admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   BACKEND_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Components

### Authentication

The application uses a custom AuthProvider component to manage authentication state. It provides login/logout functionality and user information throughout the app.

### Responsive Layout

The dashboard features a responsive layout with:
- A collapsible sidebar for navigation
- A header with search, notifications, and user profile
- Content area that adapts to different screen sizes

### Notification System

The notification system includes:
- A dropdown menu in the header showing recent notifications
- Status indicators for unread notifications
- Toast notifications for real-time alerts
- Ability to mark notifications as read

### Admin Management

The roles page provides functionality to:
- View all admin users
- Add new admin users with specific roles
- Edit existing admin details
- Activate or deactivate admin accounts

### UI Components

The application uses shadcn UI components for a consistent design language:
- Modals for forms and confirmations
- Dropdown menus for actions
- Toast notifications for alerts
- Data tables for displaying information
- Form inputs with validation

## Development Guidelines

- Use TypeScript for all new components and functionality
- Follow the established component patterns
- Implement proper error handling and loading states
- Ensure responsive design for all screens
- Write clean, maintainable code with appropriate comments
- Test thoroughly before submitting pull requests
