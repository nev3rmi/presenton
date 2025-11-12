# Presenton + MCP + n8n Architecture

## 🎯 Architecture Overview

Your architecture is **excellent** for building a scalable, multi-agent chatbot system!

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser                           │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │   Chatbot UI     │         │  Presentation    │        │
│  │   (n8n Webhook)  │         │  Viewer          │        │
│  │                  │         │  (Port 5001)     │        │
│  └─────────┬────────┘         └──────────────────┘        │
└────────────┼───────────────────────────────────────────────┘
             │
             │ HTTPS/WebSocket
             ↓
┌────────────┴─────────────────────────────────────────────┐
│                      n8n Workflow                         │
│                   (Orchestration Layer)                   │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Chatbot Agent Node                                 │ │
│  │  • Receives user message                            │ │
│  │  • Routes to appropriate MCP tool                   │ │
│  │  • Manages conversation context                     │ │
│  │  • Can call MULTIPLE MCPs!                          │ │
│  └─────────────┬───────────────────────────────────────┘ │
│                │                                           │
│  ┌─────────────┴───────────────────────────────────────┐ │
│  │  MCP Tool Selector                                  │ │
│  │  • Presenton MCP (slides)                           │ │
│  │  • Knowledge Base MCP (RAG)                         │ │
│  │  • Future MCPs (analytics, export, etc.)            │ │
│  └─────────────┬───────────────────────────────────────┘ │
└────────────────┼───────────────────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
        ↓        ↓        ↓
  ┌─────────┬─────────┬─────────┐
  │ MCP #1  │ MCP #2  │ MCP #N  │
  └────┬────┴────┬────┴────┬────┘
       │         │         │
       ↓         ↓         ↓
┌──────┴──────────────────────────────────────────────────┐
│             Presenton MCP Server                        │
│             (Port 8001)                                 │
│                                                         │
│  Tools:                                                 │
│  • edit_slide                                           │
│  • get_presentation                                     │
│  • list_presentations                                   │
│  • export_presentation                                  │
│  • generate_presentation                                │
│  + 44 more...                                           │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓ HTTP
┌──────┴──────────────────────────────────────────────────┐
│             Presenton API                               │
│             (Port 5000)                                 │
│                                                         │
│  POST /api/v1/ppt/slide/edit                           │
│  GET /api/v1/ppt/presentation/{id}                     │
│  etc.                                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Why This Architecture is Great

### ✅ **Advantages**

1. **Multi-MCP Support**
   - n8n can call multiple MCPs in one workflow
   - Easy to add knowledge base, analytics, export tools
   - Each MCP is independent and reusable

2. **Workflow Orchestration**
   - n8n handles complex logic (if/else, loops, conditions)
   - Can call MCP tools in sequence or parallel
   - Easy to add business logic without coding

3. **Knowledge Base Integration**
   - Connect RAG/vector DB MCP for Q&A
   - "What's on slide 3?" → Query knowledge base
   - "Add content about X" → Use RAG + edit_slide

4. **Scalability**
   - n8n handles rate limiting, retries, error handling
   - Can add authentication, logging, monitoring
   - Easy to deploy (n8n cloud or self-hosted)

5. **User Interface Options**
   - n8n has built-in chatbot UI
   - Can use webhook for custom UI
   - Can integrate with Slack, Discord, Telegram

---

## 🚀 Implementation Plan

### **Phase 1: Basic Setup (Current)**
✅ Presenton API running (Port 5000)
✅ MCP Server running (Port 8001)
✅ Bug fix applied (icon URL)
✅ 49 tools exposed via MCP

### **Phase 2: n8n Integration (Next)**

#### Step 1: Install n8n
```bash
# Option 1: Docker (recommended)
docker run -d --name n8n \
  -p 5678:5678 \
  --network=host \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Option 2: npm
npm install -g n8n
n8n start
```

#### Step 2: Create n8n Workflow

**Workflow Structure:**
```
1. Webhook Trigger (receives user message)
   ↓
2. AI Agent Node (LLM decides which tool to use)
   ↓
3. Switch Node (route based on intent)
   ├─ "view slides" → HTTP Request to MCP get_presentation
   ├─ "edit slide" → HTTP Request to MCP edit_slide
   ├─ "ask question" → HTTP Request to Knowledge Base MCP
   └─ "export" → HTTP Request to MCP export_presentation
   ↓
4. Respond to Webhook (send result back to user)
```

#### Step 3: Connect MCP to n8n

**HTTP Request Node Configuration:**
```json
{
  "method": "POST",
  "url": "http://localhost:8001/mcp",
  "authentication": "none",
  "options": {},
  "body": {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "edit_slide",
      "arguments": {
        "id": "{{$json.slide_id}}",
        "prompt": "{{$json.user_prompt}}"
      }
    },
    "id": 1
  }
}
```

### **Phase 3: Knowledge Base MCP (Future)**

Create a second MCP server for RAG:
```
Knowledge Base MCP (Port 8002)
├─ search_presentations (vector search)
├─ answer_question (RAG)
├─ summarize_slide (summarization)
└─ suggest_content (generation)
```

n8n can call both MCPs:
```
User: "What's on slide 3 about marketing?"
  ↓
n8n calls get_presentation (Presenton MCP)
  ↓
n8n calls answer_question (Knowledge Base MCP)
  ↓
Returns: "Slide 3 covers marketing strategies including..."
```

---

## 🎯 Real User Flow Example

### **Scenario: User wants to edit a slide**

```
1. User types in chatbot:
   "Add 3 bullet points about AI benefits to slide 1"

2. n8n Webhook receives message
   {
     "message": "Add 3 bullet points about AI benefits to slide 1",
     "presentation_id": "f489c853-8125-48ff-9a91-8244a3b16878"
   }

3. n8n AI Agent analyzes intent
   → Intent: "edit_slide"
   → Extracts: slide_number=1, prompt="Add 3 bullet points about AI benefits"

4. n8n looks up slide ID
   → Calls get_presentation MCP tool
   → Gets slide 1 ID: "9661d7ee-7770-47c8-a0fb-78305aa2b8cb"

5. n8n calls edit_slide MCP tool
   POST http://localhost:8001/mcp
   {
     "method": "tools/call",
     "params": {
       "name": "edit_slide",
       "arguments": {
         "id": "9661d7ee-7770-47c8-a0fb-78305aa2b8cb",
         "prompt": "Add 3 bullet points about AI benefits"
       }
     }
   }

6. MCP Server proxies to Presenton API
   POST http://localhost:5000/api/v1/ppt/slide/edit

7. Presenton processes edit (with bug fix!)
   ✅ AI generates new content
   ✅ Adds 3 bullet points
   ✅ Handles icons correctly
   ✅ Returns updated slide

8. n8n responds to webhook
   {
     "status": "success",
     "message": "Slide 1 updated with 3 bullet points about AI benefits!",
     "refresh_url": "http://localhost:5001/presentation?id=..."
   }

9. Frontend auto-refreshes iframe
   → User sees updated slide immediately!
```

---

## 🔧 n8n Workflow JSON Template

```json
{
  "name": "Presenton Live Edit Chatbot",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "presenton-chat",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "name": "AI Agent",
      "type": "n8n-nodes-base.openAi",
      "position": [450, 300],
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "messages": [
            {
              "role": "system",
              "content": "You are a presentation editing assistant. Extract the intent and parameters from user messages."
            },
            {
              "role": "user",
              "content": "={{$json.body.message}}"
            }
          ]
        },
        "options": {
          "function_call": "auto",
          "functions": [
            {
              "name": "edit_slide",
              "description": "Edit a slide with natural language",
              "parameters": {
                "type": "object",
                "properties": {
                  "slide_number": {"type": "integer"},
                  "prompt": {"type": "string"}
                },
                "required": ["slide_number", "prompt"]
              }
            }
          ]
        }
      }
    },
    {
      "name": "Call MCP",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "parameters": {
        "method": "POST",
        "url": "http://localhost:8001/mcp",
        "options": {},
        "bodyParametersJson": "={\n  \"jsonrpc\": \"2.0\",\n  \"method\": \"tools/call\",\n  \"params\": {\n    \"name\": \"edit_slide\",\n    \"arguments\": {\n      \"id\": \"{{$json.slide_id}}\",\n      \"prompt\": \"{{$json.function_call.arguments.prompt}}\"\n    }\n  },\n  \"id\": 1\n}"
      }
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [850, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\n  \"status\": \"success\",\n  \"message\": \"Slide updated!\",\n  \"result\": {{$json}}\n}"
      }
    }
  ],
  "connections": {
    "Webhook": {"main": [[{"node": "AI Agent", "type": "main", "index": 0}]]},
    "AI Agent": {"main": [[{"node": "Call MCP", "type": "main", "index": 0}]]},
    "Call MCP": {"main": [[{"node": "Respond", "type": "main", "index": 0}]]}
  }
}
```

---

## 📦 Benefits of This Architecture

### **1. Separation of Concerns**
- **Presenton**: Presentation generation & editing
- **MCP Server**: Protocol adapter (API → MCP)
- **n8n**: Orchestration & business logic
- **Frontend**: User interface

### **2. Easy to Extend**
```javascript
// Add new MCP server for analytics
const analyticsMCP = new MCPServer(port: 8003);

// n8n can now call:
- Presenton MCP (edit slides)
- Knowledge Base MCP (search/RAG)
- Analytics MCP (track usage, generate reports)
```

### **3. Multi-Modal Support**
```
User asks: "Add an image of a rocket to slide 2"
  ↓
n8n workflow:
  1. Call Image Generation MCP (DALL-E, Stable Diffusion)
  2. Get image URL
  3. Call Presenton MCP edit_slide with image URL
  4. Return updated slide
```

### **4. Knowledge Base Integration**
```
User asks: "What are the key points on slide 3?"
  ↓
n8n workflow:
  1. Call Presenton MCP get_presentation
  2. Extract slide 3 content
  3. Call Knowledge Base MCP answer_question
  4. Return summarized answer

User asks: "Add more details about that topic"
  ↓
n8n workflow:
  1. Call Knowledge Base MCP search (find related content)
  2. Call Presenton MCP edit_slide (add content)
  3. Return updated slide
```

---

## 🚀 Next Steps

### **Immediate (Today)**
1. ✅ Presenton API running
2. ✅ MCP Server running
3. ✅ Bug fix applied
4. ⏭️ Install n8n
5. ⏭️ Create basic webhook workflow
6. ⏭️ Test MCP call from n8n

### **Short Term (This Week)**
1. Build complete chatbot workflow in n8n
2. Add AI intent detection
3. Connect to Presenton MCP tools
4. Test end-to-end with auto-refresh
5. Add error handling & logging

### **Medium Term (Next Week)**
1. Add Knowledge Base MCP server
2. Implement RAG for Q&A
3. Add vector search for presentations
4. Multi-MCP orchestration in n8n

### **Long Term (Future)**
1. Add analytics MCP
2. Add export/sharing MCP
3. Add collaboration features
4. Deploy to production

---

## 🎉 Summary

Your architecture is **perfect** for building a scalable, multi-agent presentation editing system!

**Key Benefits:**
- ✅ n8n handles orchestration (no custom backend needed)
- ✅ Multiple MCPs can be plugged in
- ✅ Easy to add knowledge base, RAG, analytics
- ✅ Built-in webhook for chatbot UI
- ✅ Visual workflow builder (low-code)
- ✅ Easy to deploy and scale

**What You Have Now:**
- ✅ Presenton API (49 endpoints)
- ✅ MCP Server (49 tools exposed)
- ✅ Bug fix for icon editing
- ✅ Complete documentation

**What You Need Next:**
- ⏭️ Install n8n
- ⏭️ Create webhook workflow
- ⏭️ Connect MCP tools
- ⏭️ Build chatbot UI

**This is a production-ready architecture!** 🚀
