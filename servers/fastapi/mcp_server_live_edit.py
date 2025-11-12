"""
Presenton MCP Server - Live Edit Edition

This MCP server exposes essential Presenton API endpoints as MCP tools,
focused on live slide editing functionality.

Key Tools:
- get_presentation: View presentation with all slides
- list_presentations: List all available presentations
- edit_slide: AI-powered slide editing (natural language)
- edit_slide_html: AI-powered HTML/styling editing
- export_presentation: Export to PPTX or PDF
- generate_presentation: Create new presentation
"""

import sys
import argparse
import asyncio
import traceback
import httpx
from fastmcp import FastMCP
import json

# Load full OpenAPI spec with all endpoints
with open("openapi_spec_full.json", "r") as f:
    openapi_spec = json.load(f)


async def main():
    try:
        print("🚀 Starting Presenton MCP Server (Live Edit Edition)")
        parser = argparse.ArgumentParser(
            description="Presenton MCP Server with Live Editing Support"
        )
        parser.add_argument(
            "--port",
            type=int,
            default=8001,
            help="Port for the MCP server (default: 8001)"
        )
        parser.add_argument(
            "--api-url",
            type=str,
            default="http://127.0.0.1:5000",
            help="Presenton API base URL (default: http://127.0.0.1:5000)"
        )
        parser.add_argument(
            "--name",
            type=str,
            default="Presenton Live Editor",
            help="Display name for the MCP server"
        )

        args = parser.parse_args()
        print(f"📡 MCP Server Port: {args.port}")
        print(f"🔗 API URL: {args.api_url}")

        # Create HTTP client that connects to Presenton API
        api_client = httpx.AsyncClient(
            base_url=args.api_url,
            timeout=120.0  # Increased timeout for AI operations
        )

        # Build MCP server from OpenAPI spec
        # This automatically creates MCP tools for all endpoints!
        print("🔧 Creating MCP server from OpenAPI spec...")
        mcp = FastMCP.from_openapi(
            openapi_spec=openapi_spec,
            client=api_client,
            name=args.name,
        )
        print(f"✅ MCP server created with {len(openapi_spec['paths'])} endpoints")

        # Print available tools
        print("\n📋 Available MCP Tools:")
        print("  Core Tools:")
        print("    • get_presentation        - View presentation with all slides")
        print("    • list_presentations      - List all available presentations")
        print("    • edit_slide              - AI-powered slide editing ⭐")
        print("    • edit_slide_html         - AI-powered HTML/styling editing")
        print("    • export_presentation     - Export to PPTX or PDF")
        print("    • generate_presentation   - Create new presentation")
        print(f"  Plus {len(openapi_spec['paths']) - 6} more endpoints available as tools")

        # Start the MCP server
        print(f"\n🌐 Starting MCP server on http://0.0.0.0:{args.port}")
        print("💡 Connect your chatbot to this URL to start editing!")
        print("\nPress CTRL+C to stop\n")

        await mcp.run_async(
            transport="http",
            host="0.0.0.0",
            port=args.port,
        )

    except KeyboardInterrupt:
        print("\n👋 Shutting down MCP server...")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        raise


if __name__ == "__main__":
    print("=" * 60)
    print("  Presenton MCP Server - Live Edit Edition")
    print("=" * 60)
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"❌ FATAL ERROR: {e}")
        sys.exit(1)
