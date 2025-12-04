# Deployment Guide

## Deploying to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com). Follow these steps to deploy your application:

### Prerequisites
- A Vercel account.
- The project code pushed to your GitHub repository (already done).

### Steps

1.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
2.  **Add New Project**: Click on "Add New..." and select "Project".
3.  **Import Repository**:
    - Select "Continue with GitHub".
    - Find your repository (`Beneficiary-System-Clean-Backup`) and click "Import".
4.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it manually.
    - **Root Directory**: Leave as `./`.
    - **Build Command**: `npm run build` (Default).
    - **Output Directory**: `dist` (Default).
    - **Install Command**: `npm install` (Default).
5.  **Environment Variables**:
    - If you are using Firebase, add your Firebase config variables here (e.g., `VITE_FIREBASE_API_KEY`, etc.).
    - For the **Demo Mode**, no environment variables are strictly required as it falls back to mock data, but you can set `VITE_USE_MOCK_DATA=true` to force it if you implemented that flag (currently the app defaults to demo data if no backend is connected).
6.  **Deploy**: Click "Deploy".

### Verification
- Vercel will build the project and assign a domain (e.g., `beneficiary-system.vercel.app`).
- Visit the URL and verify that the **Master View** and **Dashboard** work as expected.

## Local Deployment (Preview)

To preview the production build locally:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  Preview the build:
    ```bash
    npm run preview
    ```
3.  Open the shown URL (usually `http://localhost:4173`).
