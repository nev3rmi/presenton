# Types of Slide Editing in Presenton

## 🎯 Summary: **4 Types** of Slide Editing

Presenton offers **4 different ways** to edit slides, each with different use cases:

| # | Method | Endpoint | Scope | AI? | Use Case |
|---|--------|----------|-------|-----|----------|
| 1 | **AI Content Edit** | `POST /slide/edit` | Single slide | ✅ Yes | Natural language editing |
| 2 | **AI HTML Edit** | `POST /slide/edit-html` | Single slide | ✅ Yes | Styling & appearance |
| 3 | **Bulk Content Update** | `POST /presentation/edit` | Multiple slides | ❌ No | Direct content changes |
| 4 | **Metadata Update** | `PATCH /presentation/update` | Presentation | ❌ No | Title, settings, etc. |

---

## 1️⃣ **AI Content Edit** (Primary - WITH BUG FIX!)

### Endpoint
```
POST /api/v1/ppt/slide/edit
```

### What It Does
- ✅ **AI-powered** content editing using natural language prompts
- ✅ Can change text, add bullet points, modify layout
- ✅ Automatically handles icons and images
- ✅ Can change slide layout based on prompt
- ✅ **Our bug fix applies here!**

### Request
```json
{
  "id": "slide-uuid",
  "prompt": "Add 3 more bullet points about the benefits"
}
```

### What Happens Behind the Scenes
```python
1. Fetch slide from database
2. AI analyzes current slide content
3. AI determines if layout should change
4. AI generates new content based on prompt
5. Process images/icons (with our bug fix!)
6. Create new slide ID (for tracking)
7. Save to database
8. Return updated slide
```

### Examples
```javascript
// Simple text change
{
  "id": "uuid",
  "prompt": "Change title to 'Introduction to AI'"
}

// Add content
{
  "id": "uuid",
  "prompt": "Add 5 bullet points about machine learning benefits"
}

// Style instruction
{
  "id": "uuid",
  "prompt": "Make the content more professional and formal"
}

// Layout change
{
  "id": "uuid",
  "prompt": "Convert this to a timeline layout"
}
```

### Pros & Cons
✅ **Pros**:
- Natural language - easy for users
- Smart - AI understands context
- Flexible - handles various requests
- Layout-aware

❌ **Cons**:
- Slower (AI processing)
- Uses AI tokens/credits
- Less predictable
- ⚠️ Had icon bug (NOW FIXED!)

---

## 2️⃣ **AI HTML Edit** (Styling Focus)

### Endpoint
```
POST /api/v1/ppt/slide/edit-html
```

### What It Does
- ✅ **AI-powered** HTML/CSS editing
- ✅ Focuses on styling and appearance
- ✅ Can modify colors, fonts, sizes, layout
- ❌ Only works if slide has HTML content

### Request
```json
{
  "id": "slide-uuid",
  "prompt": "Make the title 48px and bold",
  "html": "<div>...</div>"  // Optional
}
```

### What Happens
```python
1. Get slide HTML (or use provided HTML)
2. AI modifies HTML based on prompt
3. Save updated HTML
4. Return updated slide
```

### Examples
```javascript
// Font size
{
  "id": "uuid",
  "prompt": "Make all text 24px"
}

// Color
{
  "id": "uuid",
  "prompt": "Change background to light blue"
}

// Layout
{
  "id": "uuid",
  "prompt": "Center all content vertically"
}
```

### Pros & Cons
✅ **Pros**:
- Direct styling control
- No asset processing
- Faster than content edit

❌ **Cons**:
- Requires HTML content exists
- Only styling, not content
- Less commonly used

---

## 3️⃣ **Bulk Content Update** (Multiple Slides)

### Endpoint
```
POST /api/v1/ppt/presentation/edit
```

### What It Does
- ❌ **No AI** - direct content replacement
- ✅ Update multiple slides at once
- ✅ Exports immediately after edit
- ✅ Good for programmatic updates

### Request
```json
{
  "presentation_id": "presentation-uuid",
  "slides": [
    {
      "index": 0,
      "content": {
        "title": "New Title",
        "subtitle": "New Subtitle"
      }
    },
    {
      "index": 1,
      "content": {
        "heading": "Updated Heading",
        "points": ["Point 1", "Point 2"]
      }
    }
  ],
  "export_as": "pptx"
}
```

### What Happens
```python
1. Get all slides in presentation
2. For each slide in request:
   - Deep merge new content with old
   - Create new slide with merged content
3. Delete old slides
4. Save new slides
5. Export to PPTX/PDF
6. Return file path
```

### Examples
```javascript
// Update title slide only
{
  "presentation_id": "uuid",
  "slides": [
    {
      "index": 0,
      "content": {"title": "2025 Annual Report"}
    }
  ],
  "export_as": "pptx"
}

// Update multiple slides
{
  "presentation_id": "uuid",
  "slides": [
    {"index": 0, "content": {...}},
    {"index": 1, "content": {...}},
    {"index": 2, "content": {...}}
  ],
  "export_as": "pdf"
}
```

### Pros & Cons
✅ **Pros**:
- Fast - no AI processing
- Precise - exact content control
- Bulk operations
- Auto-exports

❌ **Cons**:
- No AI smarts
- Must know exact content structure
- Less user-friendly
- Requires export format

---

## 4️⃣ **Metadata Update** (Presentation Settings)

### Endpoint
```
PATCH /api/v1/ppt/presentation/update
```

### What It Does
- ❌ **No AI** - direct updates
- ✅ Change presentation properties
- ✅ Update title, language, slide count
- ✅ Can also update slide list

### Request
```json
{
  "id": "presentation-uuid",
  "title": "New Title",
  "n_slides": 10,
  "language": "Spanish",
  "slides": [...]  // Optional
}
```

### Examples
```javascript
// Change title only
{
  "id": "uuid",
  "title": "Q4 2024 Results"
}

// Change language
{
  "id": "uuid",
  "language": "French"
}
```

### Pros & Cons
✅ **Pros**:
- Simple metadata changes
- Fast
- No side effects

❌ **Cons**:
- Limited to metadata
- Rarely needed for live editing

---

## 🎯 Which One Should You Use for MCP?

### For Your Live Editing Chatbot: **Option #1 (AI Content Edit)**

**Reason**:
- ✅ Natural language = perfect for chatbot
- ✅ AI understands intent
- ✅ Bug is FIXED in your fork
- ✅ Handles everything (text, images, icons, layout)

### Comparison Table

| Scenario | Best Method | Why |
|----------|------------|-----|
| "Add more content" | #1 AI Content | Natural language |
| "Make text bigger" | #2 AI HTML | Styling focus |
| "Change slide 1 title to X" | #1 AI Content | User-friendly |
| "Update all slides programmatically" | #3 Bulk Update | Fast, precise |
| "Change presentation title" | #4 Metadata | Simple property |

---

## 🚀 Recommended MCP Tools

Based on the 4 types above, here are the MCP tools you should expose:

### **Tier 1: Must Have**
1. ✅ **edit_slide** → Uses Type #1 (AI Content Edit)
   - Main tool for chatbot
   - Natural language
   - Fixed bug!

### **Tier 2: Nice to Have**
2. ⚠️ **edit_slide_html** → Uses Type #2 (AI HTML Edit)
   - For styling requests
   - "Make text bigger"

3. ⚠️ **update_presentation_content** → Uses Type #3 (Bulk Update)
   - For programmatic updates
   - Update multiple slides at once

### **Tier 3: Optional**
4. ⚠️ **update_presentation_metadata** → Uses Type #4 (Metadata)
   - Change title, language
   - Less common

---

## 💡 Real Example: User Journey

```
User: "Show me slide 1"
→ get_presentation() → Displays slide

User: "Add 3 bullet points about benefits"
→ edit_slide(id, prompt="Add 3 bullet points about benefits")
→ Type #1: AI Content Edit
→ [Auto-refresh]
→ User sees updated slide!

User: "Make the title bigger"
→ edit_slide_html(id, prompt="Make title bigger")
→ Type #2: AI HTML Edit
→ [Auto-refresh]
→ User sees bigger title!

User: "Export as PDF"
→ export_presentation(id, format="pdf")
→ Returns download link
```

---

## 🎯 Final Recommendation

**For MCP Live Editing Chatbot, expose:**

1. **edit_slide** (Type #1) ← PRIMARY TOOL
2. **edit_slide_html** (Type #2) ← Secondary for styling
3. **get_presentation** ← View content
4. **export_presentation** ← Download result

**Start with just `edit_slide` - it covers 90% of use cases!**

The other types are for advanced/programmatic use cases.
