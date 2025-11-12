# Testing Presenton MCP Tools

## ✅ MCP Server is Running!

**URL**: `http://localhost:8001/mcp`

**Status**:
- ✅ 49 endpoints exposed as MCP tools
- ✅ Core tools available:
  - `get_presentation` - View slides
  - `list_presentations` - List all presentations
  - `edit_slide` - AI-powered editing ⭐
  - `edit_slide_html` - HTML/styling editing
  - `export_presentation` - Export to PPTX/PDF
  - `generate_presentation` - Create new presentation

## 🧪 How to Test

### Option 1: Connect Claude Desktop

Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "presenton": {
      "url": "http://localhost:8001/mcp"
    }
  }
}
```

Then in Claude Desktop:
```
User: "List my presentations"
Claude: [Calls list_presentations tool]

User: "Show me the MCP presentation"
Claude: [Calls get_presentation]

User: "Add more content to slide 1"
Claude: [Calls edit_slide with your prompt]
```

### Option 2: Test with Python Client

```python
import asyncio
from fastmcp import Client

async def test_mcp():
    async with Client("http://localhost:8001/mcp") as client:
        # List presentations
        result = await client.call_tool("list_presentations", {})
        print("Presentations:", result)

        # Get specific presentation
        result = await client.call_tool("get_presentation", {
            "id": "f489c853-8125-48ff-9a91-8244a3b16878"
        })
        print("Presentation:", result)

        # Edit a slide
        result = await client.call_tool("edit_slide", {
            "id": "9661d7ee-7770-47c8-a0fb-78305aa2b8cb",
            "prompt": "Add a 5th card about community support"
        })
        print("Edited slide:", result)

asyncio.run(test_mcp())
```

### Option 3: Test with cURL (Direct API)

```bash
# List all presentations
curl http://localhost:5000/api/v1/ppt/presentation/all

# Get specific presentation
curl http://localhost:5000/api/v1/ppt/presentation/f489c853-8125-48ff-9a91-8244a3b16878

# Edit a slide
curl -X POST http://localhost:5000/api/v1/ppt/slide/edit \
  -H "Content-Type: application/json" \
  -d '{
    "id": "9661d7ee-7770-47c8-a0fb-78305aa2b8cb",
    "prompt": "Add 5th card about community support and networking"
  }'
```

### Option 4: Use Your HTML Chatbot Demo

Update your chatbot demo HTML to connect to MCP:

```javascript
// Instead of calling API directly:
const response = await fetch('http://localhost:5000/api/v1/ppt/slide/edit', ...)

// Call through MCP:
const mcpClient = new MCPClient('http://localhost:8001/mcp');
const result = await mcpClient.callTool('edit_slide', {
  id: slideId,
  prompt: prompt
});
```

## 📊 Available Tools

Run this to see all tools:

```bash
curl http://localhost:8001/mcp/tools
```

Or in Python:

```python
from fastmcp import Client

async def list_tools():
    async with Client("http://localhost:8001/mcp") as client:
        tools = await client.list_tools()
        for tool in tools:
            print(f"• {tool.name}: {tool.description}")
```

## 🎯 Complete Workflow Test

```bash
# 1. Start servers (already running)
# Presenton API: http://localhost:5000
# MCP Server: http://localhost:8001/mcp

# 2. List presentations via MCP
# (Use Claude Desktop or Python client)

# 3. Get presentation
# Get ID: f489c853-8125-48ff-9a91-8244a3b16878

# 4. Edit slide 1
# Slide ID: 9661d7ee-7770-47c8-a0fb-78305aa2b8cb
# Prompt: "Add 5th card about community networking"

# 5. View in browser
# http://localhost:5001/presentation?id=f489c853-8125-48ff-9a91-8244a3b16878

# 6. Should see the new 5th card!
```

## 🐛 Bug Fix Verification

Test that our icon bug fix works:

```python
# Edit slide 1 (which already has icons without URLs from previous edit)
result = await client.call_tool("edit_slide", {
    "id": "9661d7ee-7770-47c8-a0fb-78305aa2b8cb",
    "prompt": "Add a 5th card about community support"
})

# Should succeed without KeyError: '__icon_url__'!
# Before fix: ❌ KeyError
# After fix: ✅ Works!
```

## 🎨 Integration with Your Chatbot Demo

Your demo at `presenton_chatbot_demo_fixed.html` can now:

1. Connect to MCP server instead of direct API
2. Use natural language through MCP tools
3. Auto-refresh still works the same way

**Benefits**:
- ✅ Standardized protocol (MCP)
- ✅ Easy to add more tools
- ✅ Works with Claude Desktop
- ✅ Works with any MCP client

## 🚀 Next Steps

1. ✅ MCP server running
2. ✅ Tools exposed
3. ⏭️ Test with Claude Desktop
4. ⏭️ Integrate with your chatbot
5. ⏭️ Demo live editing workflow

**Your MCP-powered live editing system is ready!** 🎉
