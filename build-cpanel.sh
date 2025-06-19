#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting build process for cPanel deployment...${NC}"

# Step 1: Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Step 2: Build and export the Next.js application
echo -e "${BLUE}Building and exporting Next.js application...${NC}"
npm run build

# Step 3: Create deployment directory
echo -e "${BLUE}Creating deployment package...${NC}"
rm -rf deploy-package
mkdir deploy-package

# Step 4: Copy the exported files
echo -e "${BLUE}Copying exported files...${NC}"
cp -r out/* deploy-package/

# Step 5: Create .htaccess for clean URLs
echo -e "${BLUE}Creating .htaccess file...${NC}"
cat > deploy-package/.htaccess << 'EOL'
RewriteEngine On
RewriteBase /

# If the request is not for a valid file or directory
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# If the request is not for a static asset
RewriteCond %{REQUEST_URI} !^/.*\.(html|css|js|jpg|jpeg|png|gif|svg|ico|json|woff|woff2|ttf|eot)$

# Rewrite to the corresponding .html file
RewriteRule ^([^/]+)/?$ $1.html [L]
RewriteRule ^([^/]+)/([^/]+)/?$ $1/$2.html [L]
EOL

# Step 6: Create zip file
echo -e "${BLUE}Creating ZIP archive...${NC}"
cd deploy-package
zip -r ../cpanel-deploy.zip ./*
cd ..

# Step 7: Cleanup
echo -e "${BLUE}Cleaning up...${NC}"
rm -rf deploy-package

echo -e "${GREEN}Build complete! Your deployment package is ready: cpanel-deploy.zip${NC}"
echo -e "${GREEN}Upload this file to your cPanel and extract it in your domain's root directory.${NC}"
echo -e "${GREEN}Note: This is a static export. Make sure your backend API is properly configured.${NC}" 