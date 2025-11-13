# Smart Suggestions Feature - Visual Demo Guide

This document provides a step-by-step visual guide to demonstrate the Smart Suggestions feature in Presenton.

## Overview

The Smart Suggestions feature adds an AI-powered assistance panel to the slide editor. When you highlight text in any slide, it automatically opens and provides 8 intelligent suggestions to improve your content and design.

## How to Test the Feature

### Step 1: Start Presenton Locally

**Option A: Using Docker (Easiest)**
```bash
cd /home/nev3r/projects/presenton/presenton
docker run -it --name presenton -p 5000:80 -v "./app_data:/app_data" -e LLM=openai -e OPENAI_API_KEY=your-key ghcr.io/presenton/presenton:latest
```

**Option B: Using Local Development (For Testing)**
```bash
# Terminal 1: Start Next.js dev server
cd /home/nev3r/projects/presenton/presenton/servers/nextjs
npm run dev

# Terminal 2: Start FastAPI backend (requires separate setup)
cd /home/nev3r/projects/presenton/presenton/servers/fastapi
python3 main.py
```

### Step 2: Open a Presentation

1. Navigate to `http://localhost:5000` (Docker) or `http://localhost:3000` (dev)
2. Create a new presentation or open an existing one
3. You'll see the presentation editor with slides

### Step 3: Find the Suggestions Button

**What to Look For:**
- A floating blue button in the bottom-right corner of the screen
- Icon: Lightbulb (💡)
- Text: "Suggestions"
- Hover effect: Scales up slightly

**Visual Location:**
```
┌─────────────────────────────────────────┐
│  Header (Logo, Export, Present, etc.)  │
├──────┬──────────────────────────┬───────┤
│      │                          │       │
│ Left │   Main Slide Content     │ Right │
│Panel │   (Editable slides)      │ Panel │
│      │                          │ (New) │
│      │                          │       │
│      │                          │       │
│      │                 ┌────────┴───────┤
│      │                 │  💡 Suggestions│ ← Button here
└──────┴─────────────────┴────────────────┘
```

### Step 4: Open the Suggestions Panel

**Method 1: Click the Button**
- Click the blue "Suggestions" button
- Panel slides in from the right

**Method 2: Highlight Text (Auto-opens)**
- Click and drag to select any text in a slide
- Panel automatically opens
- Shows the selected text in a preview box

### Step 5: View Suggestions

Once the panel is open, you'll see:

**Panel Structure:**
```
┌──────────────────────────────┐
│ 💡 Smart Suggestions      ✕ │ ← Header with close button
├──────────────────────────────┤
│ Selected text:               │
│ "This is your selected text" │ ← Preview of what you highlighted
├──────────────────────────────┤
│                              │
│ ✨ Text Improvements         │ ← Category 1
│                              │
│ ┌──────────────────────────┐ │
│ │ Improve Clarity          │ │
│ │ Make it more clear...    │ │
│ │ [Apply]                  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Add More Detail          │ │
│ │ Expand with examples...  │ │
│ │ [Apply]                  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Make More Engaging       │ │
│ │ Transform into...        │ │
│ │ [Apply]                  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Convert to Bullets       │ │
│ │ Transform into list...   │ │
│ │ [Apply]                  │ │
│ └──────────────────────────┘ │
│                              │
│ ────────────────────────────  │
│                              │
│ 🎨 Design Enhancements       │ ← Category 2
│                              │
│ ┌──────────────────────────┐ │
│ │ Emphasize Text           │ │
│ │ Make text stand out...   │ │
│ │ [Apply]                  │ │
│ └──────────────────────────┘ │
│                              │
│ (+ 3 more design suggestions)│
│                              │
└──────────────────────────────┘
```

### Step 6: Apply a Suggestion

1. Click the "Apply" button on any suggestion card
2. **What Happens:**
   - Button changes to "Applying..." with a spinner
   - API call is made to `/api/v1/ppt/slide/edit`
   - Slide updates automatically in the editor
   - Button changes to "Applied" with a green checkmark ✓
   - Toast notification: "Suggestion applied successfully!"

3. **Visual Feedback:**
   ```
   Before: [Apply] ← Blue button
   During: [⟳ Applying...] ← Loading state
   After:  [✓ Applied] ← Success state (disabled)
   ```

### Step 7: Try Different Suggestions

**Text Improvement Examples:**

1. **Improve Clarity**
   - Before: "The thing that makes our product good is that it works well"
   - After: "Our product delivers consistent, reliable performance"

2. **Add More Detail**
   - Before: "We have good market growth"
   - After: "We achieved 35% year-over-year growth, outpacing competitors by 15%"

3. **Make More Engaging**
   - Before: "Our company provides solutions"
   - After: "Transform your workflow with cutting-edge solutions designed for modern teams"

4. **Convert to Bullets**
   - Before: "We offer consulting, training, and support services for teams"
   - After:
     • Consulting services
     • Training programs
     • Dedicated support

**Design Enhancement Examples:**

1. **Emphasize Text**
   - Adds bold formatting
   - Increases font size
   - Makes text visually prominent

2. **Add Visual Element**
   - Suggests relevant icons
   - Recommends images
   - Proposes graphics

3. **Improve Layout**
   - Optimizes spacing
   - Enhances alignment
   - Improves visual hierarchy

4. **Enhance Colors**
   - Suggests color schemes
   - Improves contrast
   - Enhances readability

## Feature Highlights

### 1. Automatic Detection
- Monitors text selection across all slides
- Auto-opens panel when text is highlighted
- Identifies source slide for accurate updates

### 2. Context-Aware Prompts
Each suggestion generates a detailed AI prompt:
- **Improve Clarity**: "Improve the clarity and conciseness of this text: '[text]'. Keep the same meaning but make it more professional..."
- **Make Engaging**: "Make this text more engaging and compelling: '[text]'. Use storytelling techniques..."
- And 6 more carefully crafted prompts

### 3. Visual Feedback
- Loading states during API calls
- Success indicators when applied
- Error handling with toast notifications
- Disabled buttons prevent duplicate applications

### 4. Responsive Design
- Desktop only (320px fixed width)
- Hidden on mobile/tablet (`md:` breakpoint)
- Smooth slide-in/out animations
- Main content adjusts width automatically

### 5. User-Friendly Interface
- Clean white panel with blue accents
- Icon-based section headers
- Card-based suggestion layout
- Hover effects and transitions

## Testing Checklist

- [ ] Suggestions button visible in bottom-right corner
- [ ] Click button opens panel smoothly
- [ ] Panel shows "Smart Suggestions" header
- [ ] Close button (X) works correctly
- [ ] Highlight text in any slide
- [ ] Panel auto-opens when text selected
- [ ] Selected text appears in preview box
- [ ] 8 suggestions display (4 text + 4 design)
- [ ] Suggestions organized into categories
- [ ] Click "Apply" on a suggestion
- [ ] Button shows "Applying..." loading state
- [ ] API call succeeds (check Network tab)
- [ ] Slide updates with new content
- [ ] Button shows "Applied" with checkmark
- [ ] Toast notification appears
- [ ] Applied button is disabled
- [ ] Try applying multiple suggestions sequentially
- [ ] Close panel with X button
- [ ] Panel closes when clicking outside
- [ ] Reopen panel manually with button
- [ ] Test on different slides
- [ ] Verify slide identification works correctly

## Troubleshooting

### Panel Not Visible
**Problem**: Can't see the Suggestions button or panel

**Solutions**:
1. Check you're on desktop view (panel hidden on mobile)
2. Verify window width > 768px (md breakpoint)
3. Look in bottom-right corner (may be behind other UI)
4. Check browser console for JavaScript errors
5. Ensure Next.js dev server compiled successfully

### Text Selection Not Working
**Problem**: Highlighting text doesn't open panel

**Solutions**:
1. Make sure you're selecting text within a slide (not UI elements)
2. Check browser console for `useTextSelection` errors
3. Verify slides have `data-slide-id` attribute (inspect element)
4. Try refreshing the page
5. Check if panel is already open

### Apply Button Does Nothing
**Problem**: Clicking Apply doesn't trigger API call

**Solutions**:
1. Check Network tab in browser DevTools
2. Verify backend API is running and accessible
3. Look for CORS errors in console
4. Check API endpoint configuration
5. Verify API keys are set correctly

### Suggestions Not Updating Slide
**Problem**: API call succeeds but slide doesn't update

**Solutions**:
1. Check Redux store updates (Redux DevTools)
2. Verify slide ID matches in request
3. Check backend logs for errors
4. Ensure presentation data is valid
5. Try refreshing the presentation

## Code References

**Files to Inspect**:
- Hook: `servers/nextjs/app/(presentation-generator)/presentation/hooks/useTextSelection.ts`
- Panel: `servers/nextjs/app/(presentation-generator)/presentation/components/SmartSuggestionsPanel.tsx`
- Layout: `servers/nextjs/app/(presentation-generator)/presentation/components/PresentationPage.tsx`
- Slide: `servers/nextjs/app/(presentation-generator)/presentation/components/SlideContent.tsx`

**API Endpoint Used**:
- `POST /api/v1/ppt/slide/edit`
- Body: `{ id: slideId, prompt: suggestionPrompt }`

**Browser DevTools Tips**:
1. Open React DevTools to inspect component state
2. Use Redux DevTools to track state changes
3. Monitor Network tab for API calls
4. Check Console for any errors or logs
5. Use Elements tab to inspect DOM structure

## Next Steps

After testing the feature locally:
1. Verify all functionality works as expected
2. Test with different types of content
3. Ensure error handling works properly
4. Check performance with large presentations
5. Build and test in Docker
6. Update documentation with findings
7. Create user-facing help documentation

## Summary

The Smart Suggestions feature provides an intuitive, AI-powered way to improve presentation content. By combining automatic text detection, contextual suggestions, and seamless API integration, it enhances the editing workflow without disrupting the user experience.

**Key Benefits**:
- Faster content improvement
- AI-powered recommendations
- One-click application
- Non-intrusive design
- Desktop-optimized UX
