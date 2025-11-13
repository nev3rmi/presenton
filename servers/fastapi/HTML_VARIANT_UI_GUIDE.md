# HTML Variant Feature - UI Guide

## 🎨 User Interface Changes

### **Smart Panel Buttons**

```
┌─────────────────────────────────────────────────────────┐
│                      SLIDE PREVIEW                       │
│                                                          │
│  ┌──────────┬──────────┐                                │
│  │ [✨] WandSparkles (Edit Prompt)                      │
│  │                                                       │
│  │ [<>] Code2 (Generate HTML Variant) ← NEW!           │
│  └──────────┴──────────┘                                │
│                                                          │
│                    [Slide Content]                       │
│                                                          │
│                                           [🗑️] Delete   │
└─────────────────────────────────────────────────────────┘
```

### **Button States**

#### **State 1: Template-Based Slide** (Normal)
```
Top-left corner:
┌──────┬──────┐
│ [✨] │ [<>] │  ← Purple gradient (Generate HTML Variant)
└──────┴──────┘
   ↑      ↑
   Edit   Save as HTML
```

**What it does:**
- Click **[<>]** to capture current slide HTML
- Saves to `slides.html_content`
- Slide switches to HTML rendering mode

#### **State 2: HTML Variant Slide** (Custom HTML)
```
Top-left corner:
┌──────┬──────┐
│ [✨] │ [<>] │  ← Orange/Red gradient (Revert to Template)
└──────┴──────┘
   ↑      ↑
   Edit   Revert to template

Yellow warning badge:
┌────────────────────────────────────┐
│ ⚠️ Modified layout - text editing disabled │
└────────────────────────────────────┘
```

**What it does:**
- Click **[<>]** to clear `html_content`
- Slide reverts to template rendering
- Text editing re-enabled

## 📸 Visual Examples

### **Example 1: Normal Slide (Template-based)**

```
╔═══════════════════════════════════════════════════════════╗
║  [✨ purple] [<> purple]                      [🗑️ Delete] ║
║                                                           ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │                                                 │    ║
║  │  Categories of Tests:                          │    ║
║  │                                                 │    ║
║  │  [📚] Academic                                 │    ║
║  │  Standardized tests, exams                     │    ║
║  │                                                 │    ║
║  │  [🔬] Medical                                   │    ║
║  │  Blood tests, screenings                       │    ║
║  │                                                 │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                           ║
║  Data: slides.content (JSON)                             ║
║  Rendering: BulletIconsOnlySlideLayout.tsx               ║
╚═══════════════════════════════════════════════════════════╝
```

**Hover Actions:**
- **[✨ purple]** → Opens edit prompt popover
- **[<> purple]** → Saves current HTML as variant

### **Example 2: HTML Variant Slide**

```
╔═══════════════════════════════════════════════════════════╗
║  [✨ purple] [<> orange]                     [🗑️ Delete]  ║
║  ┌────────────────────────────────────────────┐          ║
║  │ ⚠️ Modified layout - text editing disabled │          ║
║  └────────────────────────────────────────────┘          ║
║                                                           ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │                                                 │    ║
║  │  [CUSTOM HTML RENDERING]                       │    ║
║  │                                                 │    ║
║  │  <div class="custom-layout">                   │    ║
║  │    <h1>Custom Styled Title</h1>                │    ║
║  │    <div class="custom-grid">...</div>          │    ║
║  │  </div>                                         │    ║
║  │                                                 │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                           ║
║  Data: slides.html_content (HTML string)                 ║
║  Rendering: dangerouslySetInnerHTML                      ║
╚═══════════════════════════════════════════════════════════╝
```

**Hover Actions:**
- **[✨ purple]** → Opens edit prompt popover (still works!)
- **[<> orange]** → Reverts to template rendering

## 🎬 User Workflow

### **Workflow 1: Create HTML Variant**

```
Step 1: User has template-based slide
   │
   ├─> Slide renders using React template
   │   (BulletIconsOnlySlideLayout.tsx)
   │
Step 2: User hovers over slide
   │
   ├─> Purple [<>] button appears
   │
Step 3: User clicks [<>] button
   │
   ├─> Frontend captures slide.innerHTML
   ├─> Sends to backend: POST /save-html-variant
   ├─> Backend saves to slides.html_content
   │
Step 4: Slide updates
   │
   ├─> New slide ID assigned
   ├─> Redux state updates
   ├─> Slide re-renders using HTML
   ├─> Yellow warning badge appears
   └─> Button changes to orange [<>]
```

### **Workflow 2: Revert to Template**

```
Step 1: User has HTML variant slide
   │
   ├─> Slide renders using html_content
   │   (dangerouslySetInnerHTML)
   │
Step 2: User hovers over slide
   │
   ├─> Orange [<>] button appears
   │
Step 3: User clicks [<>] button
   │
   ├─> Frontend sends empty string
   ├─> POST /save-html-variant with ""
   ├─> Backend sets html_content = NULL
   │
Step 4: Slide updates
   │
   ├─> New slide ID assigned
   ├─> Redux sets html_content = null
   ├─> Slide re-renders using template
   ├─> Warning badge disappears
   └─> Button changes to purple [<>]
```

## 🎭 Button Icons & Colors

### **Icon: Code2 (<>)**
- Represents HTML/code
- From lucide-react icon library
- Size: 16-20px (w-4 sm:w-5 h-4 sm:h-5)

### **Colors**

**Generate HTML Variant (Purple Gradient)**
```css
bg-gradient-to-r from-purple-600 to-indigo-600
```
- Indicates: "Transform to HTML"
- Action: Save current rendering as HTML

**Revert to Template (Orange/Red Gradient)**
```css
bg-gradient-to-r from-orange-500 to-red-500
```
- Indicates: "Warning: Will lose custom HTML"
- Action: Clear HTML and revert to template

## 🔔 Toast Notifications

### **Success Messages**

**When saving HTML variant:**
```
✅ HTML variant saved successfully
   Slide will now render using custom HTML instead of template
```

**When reverting to template:**
```
✅ Reverted to template rendering
   Slide will now use standard template
```

### **Error Messages**

**Could not find slide element:**
```
❌ Could not find slide element
```

**Failed to save:**
```
❌ Failed to save HTML variant
   [error message from backend]
```

**Failed to revert:**
```
❌ Failed to revert to template
   [error message from backend]
```

## 📱 Responsive Design

### **Desktop (md+)**
- Buttons visible on hover
- Full-size icons (20px)
- Tooltips show on hover

### **Mobile (< md)**
- Buttons hidden (class: `hidden md:block`)
- Feature not available on mobile
- Standard slide editing works normally

## ♿ Accessibility

### **Keyboard Navigation**
- Buttons are focusable
- Enter/Space to activate
- Tab to navigate between buttons

### **Screen Readers**
- ToolTip provides aria-label
- "Save as HTML variant"
- "Revert to template rendering"

### **Visual Indicators**
- Color-coded buttons
- Yellow warning badge
- Clear state differentiation

## 🎯 Quick Reference

| **Slide State** | **html_content** | **Button Color** | **Action** | **Tooltip** |
|-----------------|------------------|------------------|------------|-------------|
| Template-based  | NULL             | Purple           | Save HTML  | "Save as HTML variant" |
| HTML variant    | "< div>...</ div>" | Orange/Red      | Clear HTML | "Revert to template rendering" |

## 📝 Implementation Checklist

- [✅] Backend endpoint created
- [✅] Frontend API service added
- [✅] UI button implemented
- [✅] State management (Redux) integrated
- [✅] Toast notifications configured
- [✅] Error handling implemented
- [✅] Responsive design applied
- [✅] Accessibility features added
- [✅] Documentation created

---

**That's it!** Users can now easily create HTML variants for any slide while keeping all existing functionality working normally. 🎉
