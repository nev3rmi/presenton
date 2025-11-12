# How Presenton MCP Server Works

## 🎯 What You Need to Know

Presenton has **2 MCP servers** running:

### 1. **Production MCP** (Built-in)
- **URL**: `http://localhost:5000/mcp` (or `https://api.presenton.ai/mcp`)
- **What it does**: Exposes a single tool - `generate_presentation`
- **How it works**: Part of the main FastAPI server
- **Tools**: Only presentation generation

### 2. **OpenAPI MCP** (Separate Process)
- **File**: `servers/fastapi/mcp_server.py`
- **Port**: `8001` (separate from main server)
- **What it does**: Auto-generates MCP tools from OpenAPI spec
- **How it works**: Reads `openai_spec.json` and creates tools for ALL endpoints
- **Tools**: Everything in the OpenAPI spec

## 🔍 The Architecture

```
┌─────────────────────────────────────────────────┐
│         Main FastAPI Server (Port 5000/8000)    │
│                                                  │
│  ┌────────────────┐      ┌──────────────────┐  │
│  │  REST API      │      │  Built-in MCP    │  │
│  │  Endpoints     │      │  /mcp            │  │
│  │                │      │                  │  │
│  │  /api/v1/ppt/  │      │  Tool:           │  │
│  │  - generate    │◄─────┤  - generate      │  │
│  │  - edit        │      │    presentation  │  │
│  │  - export      │      └──────────────────┘  │
│  └────────────────┘                             │
└─────────────────────────────────────────────────┘
                       ▲
                       │ HTTP calls
                       │
┌──────────────────────┴──────────────────────────┐
│     Separate MCP Server (Port 8001)             │
│     File: mcp_server.py                         │
│                                                  │
│  1. Reads: openai_spec.json                     │
│  2. Auto-generates MCP tools                    │
│  3. Proxies to FastAPI                          │
│                                                  │
│  Tools (from OpenAPI):                          │
│  - generate_presentation                        │
│  - templates_list                               │
│  - (whatever is in openai_spec.json)           │
└─────────────────────────────────────────────────┘
```

## 🚀 How to Add Live Editing to MCP

You have **3 options**:

### Option 1: **Extend Built-in MCP** (Easiest)
Add endpoints to the main server's `/mcp` route.

**Pros**: Single server, integrated
**Cons**: Need to modify core Presenton code

### Option 2: **Update OpenAPI Spec** (Recommended)
Add slide editing endpoints to `openai_spec.json`, then the separate MCP server auto-exposes them.

**Pros**:
- ✅ No code changes to MCP server
- ✅ Just update JSON
- ✅ Automatic tool generation

**Cons**:
- Need to regenerate OpenAPI spec
- Separate process to run

### Option 3: **Create Custom MCP Server** (Most Flexible)
Build your own MCP server with custom tools.

**Pros**:
- ✅ Full control
- ✅ Add custom logic (like auto-refresh)
- ✅ Can combine multiple APIs

**Cons**:
- Need to write tool functions manually
- More maintenance

## 📝 Recommended: Option 2 (Update OpenAPI)

### Step 1: Generate Full OpenAPI Spec

The current `openai_spec.json` is **incomplete** - it only has 2 endpoints. Generate the full spec:

```bash
# Start FastAPI server
cd servers/fastapi
python server.py --port 8000

# Get full OpenAPI spec
curl http://localhost:8000/openapi.json > openai_spec.json
```

### Step 2: Verify Slide Edit Endpoints Are Included

Check that these are in the spec:
- ✅ `/api/v1/ppt/slide/edit`
- ✅ `/api/v1/ppt/slide/edit-html`
- ✅ `/api/v1/ppt/presentation/edit`
- ✅ `/api/v1/ppt/presentation/{id}` (GET)

### Step 3: Start MCP Server

```bash
python mcp_server.py --port 8001
```

### Step 4: Connect Your Chatbot

Configure your chatbot to use `http://localhost:8001` as MCP server.

### Step 5: Use New Tools

```python
# In your chatbot/Claude Desktop:
await edit_slide(
    id="uuid-of-slide",
    prompt="Add more details about benefits"
)

await get_presentation(id="uuid-of-presentation")
```

## 🎨 For Your Live Edit Chatbot Demo

Your HTML demo + MCP server integration:

```
┌──────────────────────────────────────────────────┐
│          Your Chatbot UI (HTML)                  │
│                                                   │
│  User: "Add more content to slide 1"             │
│    ↓                                              │
│  [Chatbot interprets command]                    │
│    ↓                                              │
│  Calls MCP Tool: edit_slide(...)                 │
└──────────────┬───────────────────────────────────┘
               │
               ↓ HTTP
┌──────────────┴───────────────────────────────────┐
│          MCP Server (Port 8001)                  │
│                                                   │
│  Tool: edit_slide                                │
│    ↓                                              │
│  HTTP POST to FastAPI                            │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────┴───────────────────────────────────┐
│          FastAPI Server (Port 5000)              │
│                                                   │
│  /api/v1/ppt/slide/edit                         │
│    ↓                                              │
│  [Updates database with our bug fix!]            │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────┴───────────────────────────────────┐
│          Your Chatbot UI                         │
│                                                   │
│  [Receives success response]                     │
│    ↓                                              │
│  iframe.src = iframe.src  // Auto-refresh!       │
│    ↓                                              │
│  User sees updated presentation                  │
└──────────────────────────────────────────────────┘
```

## 🧪 Quick Test

```bash
# Terminal 1: Start FastAPI
cd servers/fastapi
python server.py

# Terminal 2: Start MCP Server
cd servers/fastapi
python mcp_server.py

# Terminal 3: Test MCP
curl http://localhost:8001/tools
# Should list all available tools
```

## ✨ Summary

**Presenton MCP works by**:
1. Using FastMCP library to auto-generate tools from OpenAPI spec
2. Acting as a proxy to the main FastAPI server
3. Exposing REST endpoints as MCP tools

**To add live editing**:
1. ✅ Bug fix already done (in your fork)
2. ✅ Generate full OpenAPI spec
3. ✅ Start both servers
4. ✅ Connect chatbot to MCP
5. ✅ Edit slides through MCP tools
6. ✅ Auto-refresh demo works!

**The wheel is already invented - we just need to expose the right endpoints!**
