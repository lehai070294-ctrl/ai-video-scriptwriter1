"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { ScriptForm } from "@/components/script-form"
import { ScriptOutput } from "@/components/script-output"
import type { ScriptFormData, GeneratedScript, Scene } from "@/types"

export function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth")
      } else {
        setIsAuthenticated(true)
      }
      setIsChecking(false)
    })
  }, [router, supabase.auth])

  const parseScriptResponse = useCallback((text: string): { title: string; scenes: Scene[] } | null => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return null
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || "Kịch bản không có tiêu đề",
        scenes: parsed.scenes || [],
      }
    } catch {
      return null
    }
  }, [])

  const saveScript = useCallback(async (script: GeneratedScript) => {
    try {
      await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: script.title,
          formData: script.formData,
          scenes: script.scenes,
          rawContent: script.rawContent,
        }),
      })
    } catch {
      console.error("Failed to save script")
    }
  }, [])

  const handleGenerate = useCallback(async (formData: ScriptFormData) => {
    setIsGenerating(true)
    setStreamingContent("")
    setGeneratedScript(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Lỗi khi tạo kịch bản")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Không thể đọc response")

      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const jsonStr = line.slice(6)

          try {
            const event = JSON.parse(jsonStr)
            if (event.type === "delta") {
              fullText += event.text
              setStreamingContent(fullText)
            } else if (event.type === "done") {
              const parsed = parseScriptResponse(event.fullText)
              if (parsed) {
                const script: GeneratedScript = {
                  title: parsed.title,
                  formData,
                  scenes: parsed.scenes,
                  rawContent: event.fullText,
                  createdAt: new Date().toISOString(),
                }
                setGeneratedScript(script)
                saveScript(script)
              } else {
                const script: GeneratedScript = {
                  title: "Kịch bản",
                  formData,
                  scenes: [],
                  rawContent: event.fullText,
                  createdAt: new Date().toISOString(),
                }
                setGeneratedScript(script)
              }
            } else if (event.type === "error") {
              throw new Error(event.error)
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue
            throw e
          }
        }
      }
    } catch (err) {
      console.error("Generation error:", err)
      alert(err instanceof Error ? err.message : "Lỗi khi tạo kịch bản")
    } finally {
      setIsGenerating(false)
    }
  }, [parseScriptResponse, saveScript])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <ScriptForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        <ScriptOutput
          script={generatedScript}
          streamingContent={streamingContent}
          isStreaming={isGenerating}
        />
      </main>
    </>
  )
}
