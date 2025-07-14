#!/bin/bash

# LiteFi Admin Deployment Script
# This script deploys the LiteFi Admin application to Google Cloud Platform

set -e

# Configuration
PROJECT_ID="atomic-key-464116-m5"  # Replace with your actual project ID
REGION="us-central1"
SERVICE_NAME="litefi-admin"
BACKEND_URL="https://litefi-backend.onrender.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting LiteFi Admin deployment...${NC}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  You are not authenticated with gcloud. Please run 'gcloud auth login' first.${NC}"
    exit 1
fi

# Set the project
echo -e "${YELLOW}📋 Setting project to ${PROJECT_ID}...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs if not already enabled
echo -e "${YELLOW}🔧 Ensuring required APIs are enabled...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Submit build to Cloud Build
echo -e "${YELLOW}🏗️  Starting Cloud Build...${NC}"
gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=_REGION=$REGION,_BACKEND_URL=$BACKEND_URL \
    --timeout=1200s \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    echo -e "${GREEN}🌐 Your application is available at: $SERVICE_URL${NC}"
    
    # Open the URL in the default browser (optional)
    # open $SERVICE_URL
else
    echo -e "${RED}❌ Deployment failed. Please check the logs above.${NC}"
    exit 1
fi
