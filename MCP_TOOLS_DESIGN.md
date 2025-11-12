# MCP Tools Design for Presenton Live Editing

## 🎯 Use Case: Chatbot-Driven Presentation Editor

**User Story**: "I want to chat with AI to edit my presentation slides in real-time and see changes immediately."

## 🤔 What Tools Do We Actually Need?

Let's think about the **user workflow**:

### Scenario 1: **View & Understand**
```
User: "Show me my presentation"
User: "What's on slide 3?"
User: "List all slides"
```

**Tools Needed**:
1. ✅ **get_presentation** - Get full presentation with all slides
2. ✅ **get_slide** - Get specific slide details
3. ✅ **list_presentations** - Show all available presentations

### Scenario 2: **Edit Content**
```
User: "Change slide 1 title to 'Introduction'"
User: "Add 3 bullet points about benefits"
User: "Make the text more professional"
```

**Tools Needed**:
4. ✅ **edit_slide** - Edit slide content with AI
5. ✅ **edit_slide_html** - Direct HTML editing
6. ✅ **update_slide_content** - Bulk content update

### Scenario 3: **Manage Presentation**
```
User: "Add a new slide after slide 2"
User: "Delete slide 5"
User: "Reorder slides"
User: "Change theme to modern"
```

**Tools Needed**:
7. ⚠️ **add_slide** - Insert new slide (check if API exists)
8. ⚠️ **delete_slide** - Remove slide (check if API exists)
9. ⚠️ **reorder_slides** - Change slide order (check if API exists)
10. ⚠️ **change_theme** - Update presentation theme (check if API exists)

### Scenario 4: **Export & Share**
```
User: "Export as PDF"
User: "Download PPTX"
User: "Show me the preview URL"
```

**Tools Needed**:
11. ✅ **export_presentation** - Export to PPTX/PDF
12. ✅ **get_preview_url** - Get presentation view URL

### Scenario 5: **Generate New Content**
```
User: "Create a new presentation about AI"
User: "Generate 5 slides on Machine Learning"
```

**Tools Needed**:
13. ✅ **generate_presentation** - Already exists!

## 📊 Tool Priority Matrix

| Tool | Priority | Complexity | API Exists? | Essential? |
|------|----------|------------|-------------|------------|
| **get_presentation** | 🔴 HIGH | 🟢 Low | ✅ Yes | ✅ YES |
| **edit_slide** | 🔴 HIGH | 🟡 Medium | ✅ Yes | ✅ YES |
| **list_presentations** | 🔴 HIGH | 🟢 Low | ✅ Yes | ✅ YES |
| **export_presentation** | 🟡 MEDIUM | 🟢 Low | ✅ Yes | ✅ YES |
| **edit_slide_html** | 🟡 MEDIUM | 🟡 Medium | ✅ Yes | ⚠️ Optional |
| **update_slide_content** | 🟡 MEDIUM | 🟢 Low | ✅ Yes | ⚠️ Optional |
| **get_slide** | 🟢 LOW | 🟢 Low | ⚠️ ? | ⚠️ Optional |
| **generate_presentation** | 🟢 LOW | 🟡 Medium | ✅ Yes | ✅ YES (exists) |
| **add_slide** | 🟢 LOW | 🔴 High | ❌ No | ❌ NO |
| **delete_slide** | 🟢 LOW | 🟡 Medium | ❌ No | ❌ NO |
| **reorder_slides** | 🟢 LOW | 🔴 High | ❌ No | ❌ NO |
| **change_theme** | 🟢 LOW | 🔴 High | ⚠️ ? | ❌ NO |

## 🎯 Recommended Minimal Set (MVP)

For your **live editing chatbot demo**, you only need:

### **Tier 1: Must Have** (5 tools)
1. **get_presentation** - View presentation
2. **list_presentations** - List all presentations
3. **edit_slide** - Edit with AI prompt
4. **export_presentation** - Export to file
5. **generate_presentation** - Already exists

### **Tier 2: Nice to Have** (2 tools)
6. **edit_slide_html** - Advanced styling
7. **update_presentation** - Bulk metadata updates

### **Tier 3: Future** (not needed now)
- Add/delete/reorder slides
- Theme management
- Advanced layouts

## 📝 Detailed Tool Specifications

### 1. **get_presentation**
```json
{
  "name": "get_presentation",
  "description": "Get a presentation with all its slides",
  "parameters": {
    "presentation_id": {
      "type": "string",
      "description": "UUID of the presentation"
    }
  },
  "returns": {
    "id": "string",
    "title": "string",
    "slides": [
      {
        "id": "string",
        "index": "number",
        "content": "object",
        "layout": "string"
      }
    ]
  }
}
```

**API Endpoint**: `GET /api/v1/ppt/presentation/{id}`

**Example**:
```python
presentation = await get_presentation(
    presentation_id="f489c853-8125-48ff-9a91-8244a3b16878"
)
# Returns: Full presentation with 8 slides
```

### 2. **list_presentations**
```json
{
  "name": "list_presentations",
  "description": "List all available presentations",
  "parameters": {},
  "returns": {
    "presentations": [
      {
        "id": "string",
        "title": "string",
        "n_slides": "number",
        "created_at": "string"
      }
    ]
  }
}
```

**API Endpoint**: `GET /api/v1/ppt/presentation/all`

**Example**:
```python
presentations = await list_presentations()
# Returns: List of all presentations
```

### 3. **edit_slide** ⭐ MAIN TOOL
```json
{
  "name": "edit_slide",
  "description": "Edit a slide using natural language prompt. AI will modify content based on instructions.",
  "parameters": {
    "slide_id": {
      "type": "string",
      "description": "UUID of the slide to edit"
    },
    "prompt": {
      "type": "string",
      "description": "Natural language instruction for how to edit the slide. Examples: 'Add 3 bullet points about benefits', 'Change title to Introduction', 'Make text more professional'"
    }
  },
  "returns": {
    "id": "string",
    "content": "object",
    "message": "string"
  }
}
```

**API Endpoint**: `POST /api/v1/ppt/slide/edit`

**Example**:
```python
result = await edit_slide(
    slide_id="9661d7ee-7770-47c8-a0fb-78305aa2b8cb",
    prompt="Add a 5th card about networking opportunities"
)
# Returns: Updated slide with new content
```

### 4. **export_presentation**
```json
{
  "name": "export_presentation",
  "description": "Export presentation to PPTX or PDF format",
  "parameters": {
    "presentation_id": {
      "type": "string",
      "description": "UUID of the presentation"
    },
    "format": {
      "type": "string",
      "enum": ["pptx", "pdf"],
      "description": "Export format"
    }
  },
  "returns": {
    "path": "string",
    "download_url": "string"
  }
}
```

**API Endpoint**: `POST /api/v1/ppt/presentation/export`

**Example**:
```python
result = await export_presentation(
    presentation_id="f489c853-8125-48ff-9a91-8244a3b16878",
    format="pptx"
)
# Returns: {"path": "/app_data/.../presentation.pptx"}
```

### 5. **edit_slide_html** (Optional)
```json
{
  "name": "edit_slide_html",
  "description": "Edit slide HTML/styling directly using AI prompt",
  "parameters": {
    "slide_id": {
      "type": "string",
      "description": "UUID of the slide"
    },
    "prompt": {
      "type": "string",
      "description": "HTML/styling instruction. Examples: 'Make title 48px', 'Change background to blue', 'Center all text'"
    }
  }
}
```

**API Endpoint**: `POST /api/v1/ppt/slide/edit-html`

## 🎨 Chatbot Conversation Examples

### Example 1: View and Edit
```
User: "Show me my MCP presentation"
Bot: [Calls list_presentations()]
     "You have 1 presentation: 'What is MCP?' with 8 slides"

User: "What's on slide 1?"
Bot: [Calls get_presentation(id)]
     "Slide 1: 'MCP: Your Gateway to Microsoft Excellence'
      with 4 cards: Global Recognition, Skills Validation,
      Pathway to Specialization, Career Advancement"

User: "Add a 5th card about community support"
Bot: [Calls edit_slide(slide_id, prompt="Add 5th card about community support")]
     "✅ Done! I've added a new card about community support.
     Refreshing your view..."
     [Auto-refreshes iframe]
```

### Example 2: Bulk Changes
```
User: "Make all the slides more professional"
Bot: [Calls get_presentation() to get all slide IDs]
     [Calls edit_slide() for each slide with prompt="Make more professional"]
     "✅ Updated all 8 slides to be more professional.
     Check your presentation now!"
```

### Example 3: Export
```
User: "Export this as PDF"
Bot: [Calls export_presentation(id, format="pdf")]
     "✅ Exported! Download: /app_data/.../presentation.pdf"
```

## 🚀 Implementation Strategy

### Phase 1: Core Tools (Start Here)
1. ✅ Generate full OpenAPI spec
2. ✅ Verify these endpoints exist in spec:
   - GET /api/v1/ppt/presentation/all
   - GET /api/v1/ppt/presentation/{id}
   - POST /api/v1/ppt/slide/edit
   - POST /api/v1/ppt/presentation/export
3. ✅ Start MCP server (auto-exposes tools)

### Phase 2: Test
4. ✅ Test each tool with curl/httpx
5. ✅ Connect chatbot to MCP
6. ✅ Test real conversations

### Phase 3: Polish
7. ✅ Add error handling
8. ✅ Add progress indicators
9. ✅ Optimize auto-refresh

## 🎯 Final Recommendation

**Start with just 3 tools**:
1. **get_presentation** - "Show me my presentation"
2. **edit_slide** - "Change slide X to Y"
3. **list_presentations** - "What presentations do I have?"

**These 3 tools enable 80% of use cases!**

The rest can be added later as needed.

**Next Step**: Generate full OpenAPI spec and verify these 3 endpoints are included.
