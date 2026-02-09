# Vertiv Pipeline - Azure Deployment

## Deploy to Azure Static Web Apps

### 1. Push this folder to GitHub
Replace the contents of your repo with these files.

### 2. Create Azure Static Web App
1. Go to portal.azure.com
2. Create resource → Static Web App
3. Connect to your GitHub repo
4. Build settings:
   - Build Preset: **React**
   - App location: **/**
   - Output location: **dist**
5. Create

### 3. Done
Azure will build and deploy automatically. Takes ~2 minutes.

## Local Development
```bash
npm install
npm run dev
```
