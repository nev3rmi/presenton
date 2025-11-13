# Running Presenton Locally for Development

This guide explains how to run Presenton in local development mode to test new features like the Smart Suggestions panel.

## Architecture Overview

Presenton consists of two main components:
1. **Frontend**: Next.js application (`servers/nextjs/`)
2. **Backend**: FastAPI application (`servers/fastapi/`)

## Prerequisites

- Node.js 18+ and npm (for Next.js frontend)
- Python 3.11+ (for FastAPI backend)
- API keys for LLM providers (OpenAI, Google, etc.)

## Step 1: Set Up Backend (FastAPI)

### 1.1 Navigate to FastAPI directory
```bash
cd /home/nev3r/projects/presenton/presenton/servers/fastapi
```

### 1.2 Create and activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Install dependencies
```bash
pip install -r requirements.txt
```

### 1.4 Set environment variables
Create a `.env` file in the `servers/fastapi/` directory:

```bash
# LLM Configuration
LLM=openai
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4o

# Or use Google
# LLM=google
# GOOGLE_API_KEY=your-google-api-key
# GOOGLE_MODEL=gemini-2.0-flash-exp

# Image Generation
IMAGE_PROVIDER=pexels
PEXELS_API_KEY=your-pexels-api-key

# Optional: Web Search
WEB_GROUNDING=true
```

### 1.5 Start the backend server
```bash
# Start main FastAPI server (port 80 or 5000)
python3 main.py

# In another terminal, start Slide Helper API (port 5002)
python3 slide_helper_api.py

# In another terminal, start MCP Server (port 8001)
python3 mcp_server.py --port 8001 --api-url http://localhost:5000 --slide-helper-url http://localhost:5002
```

## Step 2: Set Up Frontend (Next.js)

### 2.1 Navigate to Next.js directory
```bash
cd /home/nev3r/projects/presenton/presenton/servers/nextjs
```

### 2.2 Install dependencies (if not already installed)
```bash
npm install
```

### 2.3 Configure API endpoint
The Next.js app needs to know where the backend API is running. Check `next.config.mjs` for API proxy configuration.

### 2.4 Start the development server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000` by default.

## Step 3: Test the Smart Suggestions Feature

1. Open your browser and navigate to `http://localhost:3000`
2. Create a new presentation or open an existing one
3. Once in the presentation editor, you should see:
   - A floating "Suggestions" button in the bottom-right corner
   - The button is blue with a lightbulb icon
4. Click the "Suggestions" button to open the Smart Suggestions Panel
5. Highlight any text in a slide
6. The panel should automatically open (if closed) and show 8 suggestions:
   - 4 Text Improvements (clarity, detail, engaging, bullets)
   - 4 Design Enhancements (emphasize, visuals, layout, colors)
7. Click "Apply" on any suggestion to test the API integration

## Troubleshooting

### Frontend can't connect to backend
- Ensure the FastAPI backend is running on the expected port (usually 5000 or 80)
- Check `next.config.mjs` for the correct API proxy configuration
- Try accessing the API directly: `curl http://localhost:5000/health`

### Smart Suggestions button not visible
- Make sure you're viewing on desktop (feature is hidden on mobile with `md:` breakpoint)
- Check browser console for any JavaScript errors
- Ensure the new code was compiled by Next.js (check terminal output)

### Text selection not working
- Make sure you're selecting text within a slide element
- Check browser console for any errors from `useTextSelection` hook
- Verify that slides have the `data-slide-id` attribute

### API calls failing
- Check that the backend server is running and accessible
- Verify API keys are correctly configured
- Check browser Network tab for failed requests
- Look at FastAPI server logs for errors

## File Locations for Smart Suggestions Feature

New files created:
- `servers/nextjs/app/(presentation-generator)/presentation/hooks/useTextSelection.ts`
- `servers/nextjs/app/(presentation-generator)/presentation/components/SmartSuggestionsPanel.tsx`

Modified files:
- `servers/nextjs/app/(presentation-generator)/presentation/hooks/index.ts`
- `servers/nextjs/app/(presentation-generator)/presentation/components/PresentationPage.tsx`
- `servers/nextjs/app/(presentation-generator)/presentation/components/SlideContent.tsx`

## Running with Hot Reload

Next.js development server automatically reloads when you make changes to files. If you modify:
- **React components**: Changes appear instantly
- **Server-side code**: Page refresh may be needed
- **Configuration files**: Restart the dev server

## Deployment to Docker

Once you've tested locally and everything works:

1. Stop local development servers
2. Build the Docker image:
   ```bash
   cd /home/nev3r/projects/presenton/presenton
   docker build -t presenton-dev .
   ```
3. Run the container:
   ```bash
   docker run -it --name presenton-dev -p 5000:80 -v "./app_data:/app_data" presenton-dev
   ```

## Notes

- The Smart Suggestions feature uses the existing `/api/v1/ppt/slide/edit` endpoint
- Suggestions are generated client-side (no API call for suggestion generation)
- Only one suggestion can be applied at a time to avoid overwhelming the API
- The panel is desktop-only for better UX (320px wide)
