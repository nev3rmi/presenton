# Presenton MCP Server Architecture

## Overview

Presenton has a **built-in MCP (Model Context Protocol) server** that exposes its REST API as MCP tools. This allows AI assistants (like Claude) to interact with Presenton to generate presentations.

## How It Works

### 1. **Current Implementation**

```
┌─────────────────┐
│   mcp_server.py │  ← MCP Server Entry Point
└────────┬────────┘
         │
         ├─> Reads openai_spec.json (OpenAPI spec)
         │
         ├─> Creates FastMCP server from OpenAPI
         │
         ├─> Connects to FastAPI backend (http://127.0.0.1:8000)
         │
         └─> Exposes API endpoints as MCP tools
```

### 2. **Architecture Components**

#### **mcp_server.py** (Main File)
```python
# 1. Load OpenAPI spec
with open("openai_spec.json", "r") as f:
    openapi_spec = json.load(f)

# 2. Create HTTP client to FastAPI backend
api_client = httpx.AsyncClient(base_url="http://127.0.0.1:8000", timeout=60.0)

# 3. Auto-generate MCP server from OpenAPI spec
mcp = FastMCP.from_openapi(
    openapi_spec=openapi_spec,
    client=api_client,
    name="Presenton API (OpenAPI)",
)

# 4. Run MCP server on port 8001
await mcp.run_async(
    transport="http",
    host="0.0.0.0",
    port=8001,
)
```

#### **Key Features**:
- 🔄 **Auto-generates** MCP tools from OpenAPI spec
- 🌐 **HTTP transport** for easy integration
- 🔌 **Proxy pattern** - MCP server calls FastAPI backend
- 📝 **No manual tool registration** - all REST endpoints become MCP tools

### 3. **How Tools Are Created**

**From OpenAPI spec:**
```json
{
  "paths": {
    "/api/v1/ppt/presentation/generate": {
      "post": {
        "operationId": "generate_presentation",
        "summary": "Returns base URL of generated presentation's PDF or PPTX.",
        ...
      }
    }
  }
}
```

**Becomes MCP tool:**
```
Tool: generate_presentation
Description: Returns base URL of generated presentation's PDF or PPTX.
Parameters: (from OpenAPI schema)
  - prompt
  - n_slides
  - language
  - template
  - etc.
```

### 4. **Current Available Tools**

Based on `openai_spec.json`, the MCP server currently exposes:

1. **generate_presentation** - Generate new presentation
2. **templates_list** - Get available templates
3. ... (all other API endpoints in the spec)

## How to Expand for Live Editing

### Option 1: **Add to OpenAPI Spec** (Automatic)

Since the slide edit endpoints exist in the FastAPI but not in `openai_spec.json`, we just need to add them:

```json
{
  "paths": {
    "/api/v1/ppt/slide/edit": {
      "post": {
        "operationId": "edit_slide",
        "summary": "Edit slide content using AI prompt",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "id": {"type": "string", "format": "uuid"},
                  "prompt": {"type": "string"}
                }
              }
            }
          }
        }
      }
    }
  }
}
```

The MCP server will **automatically** expose this as a new tool!

### Option 2: **Custom MCP Server** (Manual Control)

Create a separate MCP server with custom tools for more control:

```python
from fastmcp import FastMCP

mcp = FastMCP("Presenton Live Editor")

@mcp.tool()
async def edit_slide_live(slide_id: str, prompt: str):
    """Edit a slide with AI and return updated content"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:5000/api/v1/ppt/slide/edit",
            json={"id": slide_id, "prompt": prompt}
        )
        return response.json()

@mcp.tool()
async def refresh_presentation(presentation_id: str):
    """Trigger presentation refresh"""
    # Custom logic here
    return {"status": "refreshed", "presentation_id": presentation_id}
```

## Comparison: Auto vs Manual

| Feature | Auto (from OpenAPI) | Manual (Custom Tools) |
|---------|---------------------|----------------------|
| Setup Time | 🟢 Instant | 🟡 Manual coding |
| Maintenance | 🟢 Updates with API | 🔴 Manual updates |
| Flexibility | 🟡 Limited | 🟢 Full control |
| Custom Logic | 🔴 Not possible | 🟢 Add any logic |
| Error Handling | 🟡 Basic | 🟢 Custom |

## Recommended Approach

**For your live editing chatbot:**

1. **Update openai_spec.json** to include:
   - `/api/v1/ppt/slide/edit`
   - `/api/v1/ppt/slide/edit-html`
   - `/api/v1/ppt/presentation/edit`
   - `/api/v1/ppt/presentation/{id}` (GET)

2. **MCP server automatically exposes them**

3. **Chatbot can now call:**
   ```
   edit_slide(id="uuid", prompt="Add more details")
   get_presentation(id="uuid")
   ```

4. **Your demo HTML handles auto-refresh**

## Testing the MCP Server

```bash
# 1. Start FastAPI backend
cd servers/fastapi
python server.py --port 8000

# 2. Start MCP server
python mcp_server.py --port 8001

# 3. Connect Claude Desktop to http://localhost:8001
# Now Claude can call Presenton API as tools!
```

## Next Steps

To add live editing to MCP:

1. ✅ Generate full OpenAPI spec from FastAPI
2. ✅ Add slide edit endpoints to spec
3. ✅ Restart MCP server
4. ✅ Test with Claude Desktop
5. ✅ Integrate with your chatbot demo

**The MCP server is already built - we just need to expose the right endpoints!**
