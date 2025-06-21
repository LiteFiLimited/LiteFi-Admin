# LiteFi Admin Dashboard

A modern, responsive admin dashboard for the LiteFi financial platform built with Next.js 15, shadcn UI, and TypeScript with secure authentication and API integration.

## Overview

The LiteFi Admin Dashboard is a comprehensive interface for financial administrators to manage users, investments, loans, and system settings. It features role-based access control, detailed analytics, and a modern UI built with the latest web technologies.

## Features

- **Secure Authentication**: JWT-based authentication with automatic token refresh and role-based access control
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
- **API Integration**: Direct integration with LiteFi backend API endpoints

## Recent Enhancements

- **Secure API Integration**: Implemented direct integration with LiteFi backend API
- **JWT Authentication**: Secure token-based authentication with automatic refresh
- **Route Guards**: Client-side route protection with permission-based access control
- **Environment Configuration**: Proper environment variable management for different deployment stages
- **Error Handling**: Comprehensive error handling for API calls and authentication failures
- **Token Management**: Secure token storage and automatic cleanup on logout

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Library**: shadcn UI (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT with secure token management
- **Form Handling**: React Hook Form with zod validation
- **Icons**: Lucide React
- **API Integration**: Direct backend API integration with comprehensive error handling

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
- LiteFi Backend API access
- Admin credentials provided by system administrator

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
   Copy the example environment file and configure:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   BACKEND_URL=http://localhost:3000
   
   # Authentication
   NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Environment
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication & Security

### Login Process

1. Navigate to the login page
2. Enter your admin credentials (provided by system administrator)
3. The system will:
   - Validate credentials with the backend API
   - Store JWT token securely
   - Redirect to the dashboard based on your role

### Security Features

- **JWT Tokens**: Secure token-based authentication
- **Automatic Token Refresh**: Tokens are refreshed every 30 minutes
- **Route Protection**: Client-side route guards protect all admin pages
- **Role-Based Permissions**: Access control based on admin roles
- **Secure Token Storage**: Tokens stored in localStorage with automatic cleanup
- **Error Handling**: Comprehensive error handling for security events

### Admin Roles & Permissions

- **SUPER_ADMIN**: Complete access to all features
- **ADMIN**: General administrative access
- **SALES**: Customer acquisition and initial applications
- **RISK**: Loan application risk assessment
- **FINANCE**: Financial approvals and monitoring
- **COMPLIANCE**: Regulatory compliance verification
- **COLLECTIONS**: Loan repayment collection
- **PORT_MGT**: Investment portfolio management

## API Integration

The dashboard integrates directly with the LiteFi backend API using the endpoints documented in `docs/ADMIN_API_ENDPOINTS.md`. Key integration features:

- **Authentication Endpoints**: Login, logout, token refresh, profile management
- **Dashboard Data**: Real-time statistics and analytics
- **User Management**: CRUD operations for user accounts
- **Investment Management**: Investment tracking and approval workflows
- **Loan Management**: Loan processing and monitoring
- **Notification System**: Real-time notification delivery

## Development Guidelines

- **Authentication Required**: All API calls require valid JWT tokens
- **Error Handling**: Implement proper error handling for all API interactions
- **Permission Checks**: Use the `checkPermission` and `hasRole` functions for access control
- **Token Management**: The `apiClient` handles token management automatically
- **Type Safety**: Use TypeScript for all new components and functionality
- **Responsive Design**: Ensure all components work on mobile and desktop
- **Security**: Never expose sensitive data or tokens in client-side code

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Configure production environment variables in your deployment platform

3. Deploy using your preferred hosting platform (Vercel, Netlify, Docker, etc.)

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Frontend API URL (for client-side routing)
- `BACKEND_URL`: Backend API base URL
- `NEXTAUTH_SECRET`: JWT secret key (must be secure in production)
- `NODE_ENV`: Environment (development/production)

## Security Considerations

- All JWT tokens are validated on each request
- Tokens automatically expire and refresh
- Route guards prevent unauthorized access
- Role-based permissions limit feature access
- API endpoints validate admin roles on the backend
- All forms implement proper validation
- Error messages don't expose sensitive information

## Support

- **API Documentation**: See `docs/ADMIN_API_ENDPOINTS.md`
- **Status Page**: Contact system administrator for API status
- **Support**: Contact technical support for access issues
