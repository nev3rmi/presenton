# Quick Start - Local Development & Testing

## TL;DR - Test Smart Suggestions Feature

### Quick Docker Test (Recommended)
```bash
# Start Presenton with Docker
docker run -it --name presenton -p 5000:80 \
  -v "./app_data:/app_data" \
  -e LLM=openai \
  -e OPENAI_API_KEY=your-key-here \
  ghcr.io/presenton/presenton:latest

# Open browser: http://localhost:5000
# Create presentation → Highlight text → See Smart Suggestions panel
```

### Local Dev Setup (For Feature Development)

**1. Start Backend (Terminal 1)**
```bash
cd servers/fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export LLM=openai
export OPENAI_API_KEY=your-key-here

# Start server
python3 main.py
```

**2. Start Frontend (Terminal 2)**
```bash
cd servers/nextjs
npm install
npm run dev
```

**3. Test**
- Open: http://localhost:3000
- Create/open presentation
- Look for 💡 "Suggestions" button (bottom-right)
- Highlight text → Panel auto-opens
- Click "Apply" on any suggestion

## What to Look For

### Visual Elements
1. **Suggestions Button**: Blue circular button, bottom-right corner
2. **Panel**: 320px wide, slides in from right
3. **Categories**:
   - ✨ Text Improvements (4 suggestions)
   - 🎨 Design Enhancements (4 suggestions)

### Interaction Flow
```
Highlight text → Panel opens → View suggestions → Click Apply → Slide updates
```

### Success Indicators
- ✓ Button changes to "Applying..." during API call
- ✓ Toast notification: "Suggestion applied successfully!"
- ✓ Button becomes "Applied" with green checkmark
- ✓ Slide content updates automatically

## File Structure

```
servers/nextjs/app/(presentation-generator)/presentation/
├── hooks/
│   ├── useTextSelection.ts          ← New: Text selection detection
│   └── index.ts                     ← Modified: Export new hook
├── components/
│   ├── SmartSuggestionsPanel.tsx    ← New: Main suggestions UI
│   ├── PresentationPage.tsx         ← Modified: Add panel to layout
│   └── SlideContent.tsx             ← Modified: Add slide ID attribute
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Button not visible | Desktop only (>768px width) |
| Text selection not working | Select text within slides only |
| API errors | Check backend is running + API keys set |
| Slide not updating | Check Redux store + backend logs |

## Documentation

- **Feature Overview**: `SMART_SUGGESTIONS_FEATURE.md`
- **Visual Demo**: `SMART_SUGGESTIONS_DEMO.md`
- **Local Dev Guide**: `LOCAL_DEVELOPMENT.md`
- **Docker Setup**: `MCP_SETUP.md`

## Testing Checklist

Quick test to verify everything works:

- [ ] Start app (Docker or local dev)
- [ ] Open/create presentation
- [ ] Find Suggestions button (bottom-right)
- [ ] Click button → Panel opens
- [ ] Highlight text → Panel auto-opens
- [ ] See 8 suggestions (4 text + 4 design)
- [ ] Click Apply on one suggestion
- [ ] Verify slide updates
- [ ] Check toast notification appears
- [ ] Close panel with X button

## Need Help?

1. Check browser console for errors
2. Review `SMART_SUGGESTIONS_DEMO.md` for detailed guide
3. Inspect `LOCAL_DEVELOPMENT.md` for setup help
4. Check backend logs if API calls fail

## Next Steps

Once local testing works:
1. Test with different content types
2. Verify all 8 suggestions work
3. Check error handling
4. Build Docker image with changes
5. Deploy and test in production environment
