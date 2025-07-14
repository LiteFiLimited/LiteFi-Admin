# LiteFi Admin - Google Cloud Deployment Guide

This guide explains how to deploy the LiteFi Admin application to Google Cloud Platform using Cloud Build and Cloud Run.

## Prerequisites

1. **Google Cloud CLI**: Install and authenticate with `gcloud`
   ```bash
   # Install gcloud CLI (if not already installed)
   curl https://sdk.cloud.google.com | bash
   
   # Authenticate
   gcloud auth login
   
   # Set your project
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Node.js**: Version 18 or higher
3. **Docker**: For local testing (optional)

## Deployment Files

The following files have been created for Google Cloud deployment:

- `Dockerfile` - Container configuration for Cloud Run
- `cloudbuild.yaml` - Cloud Build configuration
- `server.js` - Production server for Next.js
- `deploy.sh` - Automated deployment script
- `build.sh` - Local build script
- `.dockerignore` - Docker build optimization

## Environment Variables

Before deploying, update the following in `cloudbuild.yaml`:

```yaml
substitutions:
  _REGION: 'us-central1'  # Your preferred region
  _BACKEND_URL: 'https://litefi-backend.onrender.com'  # Your backend URL
  _NEXTAUTH_SECRET: 'your-secure-secret-here'  # Generate a secure secret
```

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

1. Update the `PROJECT_ID` in `deploy.sh` with your actual Google Cloud project ID
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

### Method 2: Manual Deployment

1. **Build and deploy manually:**
   ```bash
   # Submit to Cloud Build
   gcloud builds submit --config=cloudbuild.yaml
   
   # Or build and push manually
   docker build -t gcr.io/YOUR_PROJECT_ID/litefi-admin .
   docker push gcr.io/YOUR_PROJECT_ID/litefi-admin
   
   # Deploy to Cloud Run
   gcloud run deploy litefi-admin \
     --image gcr.io/YOUR_PROJECT_ID/litefi-admin \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated
   ```

### Method 3: Cloud Build Trigger (Like your other projects)

1. **Connect your repository to Cloud Build:**
   ```bash
   gcloud builds triggers create github \
     --repo-name=LiteFi-Admin \
     --repo-owner=LiteFiLimited \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

2. **The trigger will automatically deploy when you push to the main branch**

## Local Testing

1. **Build locally:**
   ```bash
   ./build.sh
   ```

2. **Test the production build:**
   ```bash
   npm start
   ```

3. **Test with Docker:**
   ```bash
   docker build -t litefi-admin .
   docker run -p 3000:3000 litefi-admin
   ```

## Configuration

### Next.js Configuration
The `next.config.js` has been updated with:
- `output: 'standalone'` for optimized Docker builds
- Environment variable configuration
- Image optimization settings

### Environment Variables
Update these in Cloud Build or Cloud Run:
- `NEXT_PUBLIC_BACKEND_URL` - Your backend API URL
- `BACKEND_URL` - Server-side backend URL
- `NEXTAUTH_SECRET` - Secure secret for authentication
- `NODE_ENV` - Set to 'production'

## Monitoring and Logs

View logs in Google Cloud Console:
```bash
# View Cloud Build logs
gcloud builds log BUILD_ID

# View Cloud Run logs
gcloud logs read --service=litefi-admin --region=us-central1
```

## Troubleshooting

1. **Build fails**: Check the `cloudbuild.yaml` substitutions
2. **App won't start**: Verify environment variables are set correctly
3. **API calls fail**: Ensure `NEXT_PUBLIC_BACKEND_URL` is accessible
4. **Authentication issues**: Verify `NEXTAUTH_SECRET` is set

## Security Notes

- Always use secure secrets for `NEXTAUTH_SECRET`
- Keep environment variables secure
- Use IAM roles for proper access control
- Enable Cloud Run security features

## Cost Optimization

The Cloud Run configuration includes:
- Minimum instances: 0 (scales to zero)
- Maximum instances: 10
- Memory: 1Gi
- CPU: 1

Adjust these based on your traffic requirements.
