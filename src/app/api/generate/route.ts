import Anthropic from "@anthropic-ai/sdk"
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt-builder"
import type { ScriptFormData } from "@/types"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const formData = body as ScriptFormData

    if (!formData.topic?.trim()) {
      return new Response(JSON.stringify({ error: "Vui lòng nhập chủ đề video" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY chưa được cấu hình" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const client = new Anthropic({ apiKey })

    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: buildSystemPrompt(formData),
      messages: [
        {
          role: "user",
          content: buildUserPrompt(formData.topic),
        },
      ],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ type: "delta", text: event.delta.text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }

          const finalMessage = await stream.finalMessage()
          const fullText = finalMessage.content
            .filter((block): block is Anthropic.TextBlock => block.type === "text")
            .map((block) => block.text)
            .join("")

          const doneData = JSON.stringify({ type: "done", fullText })
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
          controller.close()
        } catch (err) {
          const errorData = JSON.stringify({
            type: "error",
            error: err instanceof Error ? err.message : "Lỗi không xác định",
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Lỗi server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
