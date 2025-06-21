#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Production API URL
PRODUCTION_API_URL="https://litefi-backend.onrender.com"

echo -e "${BLUE}Starting build process for cPanel deployment...${NC}"

# Create deployment directory
echo -e "${BLUE}Creating deployment directory...${NC}"
rm -rf deployment
mkdir -p deployment

# Remove existing build-cpanel.sh script
echo -e "${BLUE}Removing old build script...${NC}"
rm -f build-cpanel.sh

# Step 1: Create or update API client to always use production URL
echo -e "${BLUE}Updating API client to use production URL...${NC}"

# Modify the API client to use a hardcoded production URL
cat > src/lib/api.ts.tmp << EOL
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  AuthResponse,
  AdminUser,
  DashboardSummary,
  DashboardActivitiesResponse,
  LoanStats,
  InvestmentStats,
  SystemHealth,
  AdminProfileUpdate,
  PasswordChange,
  Transaction,
  FinancialAnalytics,
  UserAnalytics,
  ExportRequest,
  ExportStatus,
  InvestmentPlan,
  BulkOperation,
  BulkOperationResult,
  AuditLog,
  ComplianceReport,
  User,
  UserResponse,
  UsersResponse,
  PaginatedResponse,
  Loan,
  Investment,
} from "./types";

interface RequestConfig {
  requiresAuth?: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  private isDevelopment: boolean;

  constructor() {
    // HARDCODED PRODUCTION URL FOR DEPLOYMENT
    const baseURL = "${PRODUCTION_API_URL}";
    console.log("Using production API URL:", baseURL);
    this.isDevelopment = false;

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "LiteFi-Admin-Dashboard/1.0",
      },
    });

    // Try to get token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }

    // Set up request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = \`Bearer \${this.token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Set up response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Rest of the class remains the same
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
EOL

cp src/lib/api.ts.tmp src/lib/api.ts
rm src/lib/api.ts.tmp

# Step 2: Update API route file to use production URL
echo -e "${BLUE}Updating API route to use production URL...${NC}"
cat > src/app/api/admin/[[...slug]]/route.ts.tmp << EOL
import { NextRequest, NextResponse } from "next/server";

// HARDCODED PRODUCTION URL FOR DEPLOYMENT
const BACKEND_URL = "${PRODUCTION_API_URL}";

// Handle all HTTP methods
export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req);
}

async function proxyRequest(req: NextRequest) {
  try {
    // Extract the path from the URL
    const url = new URL(req.url);
    const path = url.pathname.replace("/api", "");

    // Build the target URL
    const targetUrl = \`\${BACKEND_URL}\${path}\${url.search}\`;
    console.log("Proxying request to:", targetUrl);

    // Get the request body if it exists
    let body: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
        "User-Agent": "LiteFi-Admin-Dashboard/1.0",
      },
      body: body,
    });

    // Get the response data
    const data = await response.text();

    // Return the response with the same status and headers
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
EOL

cp src/app/api/admin/[[...slug]]/route.ts.tmp src/app/api/admin/[[...slug]]/route.ts
rm src/app/api/admin/[[...slug]]/route.ts.tmp

# Step 3: Create runtime-config.js for browser environments
echo -e "${BLUE}Creating runtime config for browser environments...${NC}"
cat > public/runtime-config.js << EOL
// LiteFi Admin Runtime Configuration
console.log("Loading LiteFi Admin runtime configuration...");

// Create window.process.env if it doesn't exist
window.process = window.process || {};
window.process.env = window.process.env || {};

// Set production API URL for the application
window.process.env.NEXT_PUBLIC_API_URL = "${PRODUCTION_API_URL}";
window.process.env.NEXT_PUBLIC_BACKEND_URL = "${PRODUCTION_API_URL}";
window.process.env.BACKEND_URL = "${PRODUCTION_API_URL}";

// Global API URL variables (some components might use these directly)
window.NEXT_PUBLIC_API_URL = "${PRODUCTION_API_URL}";
window.NEXT_PUBLIC_BACKEND_URL = "${PRODUCTION_API_URL}";
window.BACKEND_URL = "${PRODUCTION_API_URL}";

console.log("Runtime config loaded with API URL: ${PRODUCTION_API_URL}");
EOL

# Step 4: Create a script to modify _document.js or layout files to load the runtime-config.js
echo -e "${BLUE}Creating script to inject runtime config in HTML head...${NC}"
cat > src/app/layout.tsx.tmp << EOL
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast-provider';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata = {
  title: 'LiteFi Admin Dashboard',
  description: 'Administrative dashboard for LiteFi financial services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/runtime-config.js"></script>
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
EOL

cp src/app/layout.tsx.tmp src/app/layout.tsx
rm src/app/layout.tsx.tmp

# Step 5: Update environment files with production URL
echo -e "${BLUE}Updating environment files...${NC}"
cat > .env << EOL
NEXT_PUBLIC_API_URL=${PRODUCTION_API_URL}
NEXT_PUBLIC_BACKEND_URL=${PRODUCTION_API_URL}
BACKEND_URL=${PRODUCTION_API_URL}
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
EOL

cp .env .env.production
cp .env .env.local

# Step 6: Configure next.config.js with hardcoded values
echo -e "${BLUE}Configuring next.config.js...${NC}"
cat > next.config.js << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: '${PRODUCTION_API_URL}',
    BACKEND_URL: '${PRODUCTION_API_URL}',
    NEXT_PUBLIC_BACKEND_URL: '${PRODUCTION_API_URL}',
    NEXTAUTH_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
  },
};

module.exports = nextConfig;
EOL

# Step 7: Install dependencies and build the application
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

echo -e "${BLUE}Building and exporting Next.js application...${NC}"
npm run build

# Step 8: Copy out directory contents to deployment
echo -e "${BLUE}Copying exported files to deployment directory...${NC}"
if [ -d "out" ]; then
  cp -r out/* deployment/
else
  echo -e "${YELLOW}Warning: 'out' directory not found. Copying .next and public directories instead.${NC}"
  mkdir -p deployment/static
  cp -r .next/static deployment/
  cp -r public/* deployment/
fi

# Step 9: Create .htaccess for clean URLs
echo -e "${BLUE}Creating .htaccess file...${NC}"
cat > deployment/.htaccess << EOL
RewriteEngine On
RewriteBase /

# Protect .env files from being accessed
<FilesMatch "^\.env\.?">
  Order allow,deny
  Deny from all
</FilesMatch>

# If the request is not for a valid file or directory
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# If the request is not for a static asset
RewriteCond %{REQUEST_URI} !^/.*\.(html|css|js|jpg|jpeg|png|gif|svg|ico|json|woff|woff2|ttf|eot)$

# Rewrite to the corresponding .html file
RewriteRule ^([^/]+)/?$ $1.html [L]
RewriteRule ^([^/]+)/([^/]+)/?$ $1/$2.html [L]
EOL

# Step 10: Create a sample .env file in the deployment directory
echo -e "${BLUE}Creating sample .env file in deployment...${NC}"
cat > deployment/.env << EOL
NEXT_PUBLIC_API_URL=${PRODUCTION_API_URL}
NEXT_PUBLIC_BACKEND_URL=${PRODUCTION_API_URL}
BACKEND_URL=${PRODUCTION_API_URL}
EOL

# Step 11: Create zip file in the deployment directory
echo -e "${BLUE}Creating ZIP archive in deployment directory...${NC}"
cd deployment
zip -r CPanel-deployment.zip ./*
cd ..

# Step 12: Clean up deployment directory except for the zip file
echo -e "${BLUE}Cleaning up deployment directory (keeping only the zip file)...${NC}"
mkdir -p temp_dir
mv deployment/CPanel-deployment.zip temp_dir/
rm -rf deployment/*
mv temp_dir/CPanel-deployment.zip deployment/
rm -rf temp_dir

echo -e "${GREEN}Build complete! Your deployment package is ready: deployment/CPanel-deployment.zip${NC}"
echo -e "${YELLOW}Note: API endpoints are configured to use ${PRODUCTION_API_URL} (without /api)${NC}"
echo -e "${GREEN}Upload this file to your cPanel and extract it in your domain's root directory.${NC}"
