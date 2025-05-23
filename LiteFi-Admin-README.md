# LiteFi Admin Dashboard

A modern, responsive admin dashboard for the LiteFi financial platform built with Next.js, shadcn UI, and TypeScript.

## Overview

The LiteFi Admin Dashboard provides a comprehensive interface for managing users, investments, loans, and system settings. It supports role-based access control with different permission levels for various admin roles.

## Features

- **Modern UI**: Clean, responsive design using Shadcn UI components
- **Role-Based Access Control**: Different views and permissions based on admin roles
- **Dashboard Analytics**: Visual representation of key metrics
- **User Management**: View and manage user accounts
- **Investment Management**: Track and process investment applications
- **Loan Management**: Review loan applications and monitor repayments
- **Settings Management**: Configure system parameters and business rules
- **Role Management**: Manage admin users and their permissions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Library**: Shadcn
- **State Management**: React Context API + SWR for data fetching
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Authentication**: JWT with secure HTTP-only cookies
- **API Integration**: Custom API client for the LiteFi backend

## Project Structure

```
/litefi-admin
  /app                       # Next.js App Router pages
    /api                     # API routes
      /admin/[[...slug]].ts  # API proxy for backend
    /auth
      /login/page.tsx        # Admin login page
    /dashboard
      /page.tsx              # Main dashboard
    /users
      /page.tsx              # Users management
    /investments
      /page.tsx              # Investments management
    /loans
      /page.tsx              # Loans management
    /settings
      /page.tsx              # System settings
    /roles
      /page.tsx              # Role management
    layout.tsx               # Main layout with sidebar
    page.tsx                 # Root page (redirect to dashboard)
  /components                # Reusable components
    /auth
      LoginForm.tsx
    /dashboard
      Stats.tsx
      RecentActivity.tsx
    /layout
      Sidebar.tsx
      Header.tsx
      Footer.tsx
    /users
      UserTable.tsx
      UserForm.tsx
    /investments
      InvestmentTable.tsx
      InvestmentForm.tsx
    /loans
      LoanTable.tsx
      LoanForm.tsx
    /settings
      SettingsForm.tsx
    /roles
      RolesTable.tsx
      RoleForm.tsx
  /lib                       # Utility functions and helpers
    /api.ts                  # API client
    /auth.ts                 # Auth utilities
    /types.ts                # Type definitions
```

## Admin Roles

The system supports the following admin roles:

- **SUPER_ADMIN**: Complete access to all features
- **ADMIN**: General administrative access
- **SALES**: Customer acquisition and initial applications
- **RISK**: Loan application risk assessment
- **FINANCE**: Financial approvals and monitoring
- **COMPLIANCE**: Regulatory compliance verification
- **COLLECTIONS**: Loan repayment collection
- **PORT_MGT**: Investment portfolio management

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- LiteFi Backend API running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/litefi-admin.git
   cd litefi-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
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
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Components

### Authentication Flow

1. Admin user navigates to `/auth/login`
2. Submits credentials to `/api/auth/admin/login` endpoint
3. On success, JWT token is stored in a secure HTTP-only cookie
4. User is redirected to dashboard
5. Token is included in all subsequent API requests
6. Token refresh mechanism handles session persistence

### Dashboard

The dashboard displays key metrics and visualizations:
- Total users count
- Active investments
- Active loans
- Recent activities
- Financial performance charts

### User Management

- List all users with filtering and pagination
- View detailed user profiles
- Edit user information
- Verify/block users
- View user's investments and loans

### Investment Management

- List all investments with filtering by status
- View investment details
- Approve/reject investment applications
- Track investment performance
- Generate investment reports

### Loan Management

- List all loans with filtering by status
- View loan details and repayment schedule
- Approve/reject loan applications
- Track loan repayments
- Handle loan defaults and collections

### Settings Management

- Configure system parameters
- Manage investment plans
- Set up loan products
- Configure email templates
- Set business rules and thresholds

### Role Management

- List admin users
- Create new admin accounts
- Assign roles and permissions
- Activate/deactivate admin accounts

## UI Design Guidelines

- **Color Scheme**: Primary color #1976d2, Secondary color #f50057
- **Typography**: Roboto font family
- **Layout**: Sidebar navigation with responsive design
- **Components**: Shadcn UI components with custom styling
- **Icons**: Material Icons like react icon or lucide icon
- **Data Tables**: Sortable, filterable tables with pagination
- **Forms**: Validated forms with error handling
- **Charts**: Clean, minimalist charts with consistent styling

## API Integration

The admin dashboard communicates with the LiteFi backend API. All requests are proxied through Next.js API routes to handle authentication and CORS.

Example API endpoints:
- `/api/admin/dashboard/stats` - Get dashboard statistics
- `/api/admin/users` - List users
- `/api/admin/investments` - List investments
- `/api/admin/loans` - List loans
- `/api/admin/settings` - Get/update settings

## Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

3. For containerized deployment, use the included Dockerfile:
   ```bash
   docker build -t litefi-admin .
   docker run -p 3000:3000 litefi-admin
   ```

## Security Considerations

- JWT tokens are stored in HTTP-only cookies
- CSRF protection is implemented
- Role-based access control restricts feature access
- API requests are validated on both client and server
- Rate limiting prevents brute force attacks
- All forms implement proper validation

## Development Guidelines

- Follow the established folder structure
- Use TypeScript for type safety
- Implement proper error handling
- Write unit tests for critical components
- Follow Shadcn UI best practices
- Use SWR for data fetching with caching
- Implement responsive design for all screens