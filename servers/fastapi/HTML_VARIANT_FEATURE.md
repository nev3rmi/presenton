# HTML Variant Feature - Implementation Guide

## 🎯 Overview

This feature allows you to create **custom HTML variants** for individual slides while keeping all existing functionality working normally. It provides a **hybrid rendering system** where slides can use either:

1. **Template-based rendering** (JSON content → React template)
2. **HTML variant rendering** (Custom HTML stored in database)

## 🏗️ Architecture

### **How It Works**

```
┌─────────────────────────────────────────────────────────────┐
│ STANDARD SLIDE (Template-based)                            │
│                                                             │
│  slides.content = {"title": "...", "bulletPoints": [...]}  │
│  slides.html_content = NULL                                 │
│  ↓                                                          │
│  Frontend renders using React template                      │
│  (BulletIconsOnlySlideLayout.tsx)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HTML VARIANT SLIDE (Custom HTML)                           │
│                                                             │
│  slides.content = {"title": "...", "bulletPoints": [...]}  │
│  slides.html_content = "<div>...custom HTML...</div>"       │
│  ↓                                                          │
│  Frontend renders html_content directly                     │
│  (dangerouslySetInnerHTML)                                  │
└─────────────────────────────────────────────────────────────┘
```

### **Key Components**

1. **Database**: `slides.html_content` field stores custom HTML
2. **Backend**: `/api/v1/ppt/slide/save-html-variant` endpoint
3. **Frontend**: `useTemplateLayouts.tsx` checks for html_content
4. **UI**: Code2 icon button in Smart Panel

## 🚀 Usage

### **For Users**

#### **Step 1: Generate HTML Variant**

1. Open a presentation with slides
2. Hover over a slide
3. Click the **purple Code icon** (next to the WandSparkles icon)
4. The slide's current rendered HTML will be saved
5. Toast notification: "HTML variant saved successfully"

#### **Step 2: Result**

- Slide now renders using custom HTML instead of template
- JSON content is preserved (not deleted)
- A yellow warning badge appears: "⚠️ Modified layout - text editing disabled"

#### **Step 3: Revert to Template** (Optional)

1. Hover over the HTML variant slide
2. Click the **orange/red Code icon**
3. The slide reverts to template-based rendering
4. Toast notification: "Reverted to template rendering"

### **Visual Indicators**

- **Purple Code icon**: Appears on template-based slides → Click to save as HTML variant
- **Orange/Red Code icon**: Appears on HTML variant slides → Click to revert to template
- **Yellow warning badge**: Shows when viewing an HTML variant slide in edit mode

## 💻 Technical Implementation

### **1. Backend Endpoint** (`slide.py`)

```python
@SLIDE_ROUTER.post("/save-html-variant", response_model=SlideModel)
async def save_html_variant(
    id: uuid.UUID,
    html_content: str,
    sql_session: AsyncSession = Depends(get_async_session),
):
    slide = await sql_session.get(SlideModel, id)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")

    # Create new slide ID for frontend tracking
    slide.id = uuid.uuid4()

    # Save HTML or clear it (empty string = revert)
    slide.html_content = html_content if html_content.strip() else None

    await sql_session.commit()
    return slide
```

### **2. Frontend API Service** (`presentation-generation.ts`)

```typescript
static async saveHtmlVariant(
  slide_id: string,
  html_content: string
) {
  const response = await fetch(
    `/api/v1/ppt/slide/save-html-variant`,
    {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify({ id: slide_id, html_content }),
    }
  );
  return await ApiResponseHandler.handleResponse(response);
}
```

### **3. Frontend Rendering Logic** (`useTemplateLayouts.tsx`)

```typescript
const renderSlideContent = (slide: any, isEditMode: boolean) => {
  // Check if slide has html_content first
  if (slide.html_content && slide.html_content.trim()) {
    return (
      <div dangerouslySetInnerHTML={{ __html: slide.html_content }} />
    );
  }

  // Otherwise, use template-based rendering
  const Layout = getTemplateLayout(slide.layout, slide.layout_group);
  return <Layout data={slide.content} />;
};
```

### **4. UI Component** (`SlideContent.tsx`)

```typescript
// Generate HTML Variant handler
const handleGenerateHtmlVariant = async () => {
  const slideElement = document.querySelector(`[data-slide-id="${slide.id}"]`);
  const html_content = slideElement.innerHTML;

  const response = await PresentationGenerationApi.saveHtmlVariant(
    slide.id,
    html_content
  );

  dispatch(updateSlide({ index: slide.index, slide: response }));
  toast.success("HTML variant saved successfully");
};

// Revert to Template handler
const handleRevertToTemplate = async () => {
  const response = await PresentationGenerationApi.saveHtmlVariant(
    slide.id,
    "" // Empty string clears html_content
  );

  response.html_content = null;
  dispatch(updateSlide({ index: slide.index, slide: response }));
  toast.success("Reverted to template rendering");
};
```

## 🔄 Data Flow

### **Saving HTML Variant**

```
1. User clicks Code icon
   ↓
2. Frontend captures rendered HTML from DOM
   ↓
3. POST /api/v1/ppt/slide/save-html-variant
   ↓
4. Backend saves HTML to slides.html_content
   ↓
5. Backend returns updated slide with new ID
   ↓
6. Frontend updates Redux store
   ↓
7. Slide re-renders using html_content
```

### **Reverting to Template**

```
1. User clicks orange/red Code icon
   ↓
2. Frontend sends empty string as html_content
   ↓
3. POST /api/v1/ppt/slide/save-html-variant
   ↓
4. Backend sets html_content = None
   ↓
5. Backend returns updated slide
   ↓
6. Frontend sets html_content = null in Redux
   ↓
7. Slide re-renders using template
```

## 🎨 Use Cases

### **When to Use HTML Variants**

1. **Custom layouts**: Create unique slide designs not available in templates
2. **Fine-tuned styling**: Make pixel-perfect adjustments to specific slides
3. **Legacy compatibility**: Preserve exact layouts from imported PPTX files
4. **A/B testing**: Try different layouts for the same content

### **When to Use Standard Templates**

1. **Consistent branding**: Maintain uniform look across presentations
2. **Easy editing**: Allow text editing via TiptapText
3. **Content-first**: Focus on content, not design
4. **Scalability**: Apply layout changes to all slides at once

## 🛠️ Customization

### **Adding AI-Generated HTML Variants**

To integrate AI for HTML generation instead of just capturing DOM:

```typescript
const handleGenerateAiHtmlVariant = async () => {
  // 1. Take screenshot of slide
  const canvas = await html2canvas(slideElement);
  const screenshot = canvas.toDataURL();

  // 2. Call slide-to-html endpoint
  const response = await fetch("/api/v1/ppt/slide-to-html/", {
    method: "POST",
    body: JSON.stringify({
      image: screenshot,
      xml: slide.xml_content || "",
      fonts: slide.fonts || [],
    }),
  });

  const { html } = await response.json();

  // 3. Save the AI-generated HTML
  await PresentationGenerationApi.saveHtmlVariant(slide.id, html);
};
```

### **Adding HTML Editing**

To allow editing HTML variants:

```typescript
const handleEditHtmlVariant = async (prompt: string) => {
  // Take screenshot of current HTML slide
  const screenshot = await captureScreenshot();

  // Call html-edit endpoint
  const response = await fetch("/api/v1/ppt/html-edit/", {
    method: "POST",
    body: formData({
      current_ui_image: screenshot,
      html: slide.html_content,
      prompt: prompt,
    }),
  });

  const { edited_html } = await response.json();

  // Save edited HTML
  await PresentationGenerationApi.saveHtmlVariant(slide.id, edited_html);
};
```

## 📊 Database Schema

```sql
CREATE TABLE slides (
  id CHAR(32) PRIMARY KEY,
  presentation CHAR(32),
  layout VARCHAR,           -- "general:bullet-icons-only-slide"
  layout_group VARCHAR,
  index INTEGER,
  content JSON,            -- {"title": "...", "bulletPoints": [...]}
  html_content VARCHAR,    -- Custom HTML (NULL = use template)
  speaker_note VARCHAR,
  properties JSON,
  FOREIGN KEY (presentation) REFERENCES presentations(id) ON DELETE CASCADE
);
```

## 🔍 Troubleshooting

### **HTML variant not rendering**

- Check: `slide.html_content` is not null in Redux state
- Check: HTML contains valid content (not empty string)
- Check: `useTemplateLayouts.tsx` logic is checking html_content first

### **Cannot revert to template**

- Check: API endpoint returns `html_content: null` in response
- Check: Frontend sets `response.html_content = null` before dispatching
- Check: Redux state is updated correctly

### **Text editing not working**

- Expected: Text editing is disabled for HTML variant slides
- Solution: Revert to template to enable text editing

## 🎯 Summary

You now have a **fully functional hybrid rendering system** where:

✅ **Standard slides** use template-based rendering (JSON → React)
✅ **HTML variant slides** use custom HTML rendering
✅ **Both systems coexist** without conflicts
✅ **Easy switching** between template and HTML modes
✅ **Backward compatible** with existing presentations

The Smart Panel now has a new button that lets users save any slide as an HTML variant while keeping everything else working normally!
