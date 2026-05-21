"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Copy,
  Check,
  Download,
  FileText,
  FileJson,
  FileDown,
  Clock,
  Eye,
  Mic,
} from "lucide-react"
import type { GeneratedScript, AITool, AI_TOOL_LABELS } from "@/types"

const AI_TOOLS: { key: AITool; name: string; icon: string; type: string }[] = [
  { key: "veo3", name: "Veo 3", icon: "🎬", type: "Video" },
  { key: "grok", name: "Grok", icon: "🎬", type: "Video" },
  { key: "sora", name: "Sora", icon: "🎬", type: "Video" },
  { key: "runway", name: "Runway ML", icon: "🎬", type: "Video" },
  { key: "kling", name: "Kling AI", icon: "🎬", type: "Video" },
  { key: "midjourney", name: "Midjourney", icon: "🖼️", type: "Image" },
  { key: "flux", name: "Flux", icon: "🖼️", type: "Image" },
]

interface ScriptOutputProps {
  script: GeneratedScript | null
  streamingContent: string
  isStreaming: boolean
}

export function ScriptOutput({ script, streamingContent, isStreaming }: ScriptOutputProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const exportTxt = () => {
    if (!script) return
    const content = script.rawContent
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    downloadBlob(blob, `${script.title || "script"}.txt`)
  }

  const exportJson = () => {
    if (!script) return
    const content = JSON.stringify(script, null, 2)
    const blob = new Blob([content], { type: "application/json;charset=utf-8" })
    downloadBlob(blob, `${script.title || "script"}.json`)
  }

  const exportPdf = async () => {
    if (!script) return
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(script.title || "AI Video Script", 20, 20)

    doc.setFontSize(10)
    const lines = doc.splitTextToSize(script.rawContent, 170)
    let y = 35
    for (const line of lines) {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, 20, y)
      y += 5
    }

    doc.save(`${script.title || "script"}.pdf`)
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isStreaming && !script) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Đang tạo kịch bản...
          </CardTitle>
        </CardHeader>
        <CardContent>
          {streamingContent ? (
            <div className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
              {streamingContent}
              <span className="streaming-cursor" />
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!script) return null

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">{script.title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(script.rawContent, "all")}>
            {copiedId === "all" ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copiedId === "all" ? "Đã copy" : "Copy tất cả"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportTxt}>
            <FileText className="h-4 w-4 mr-1" />
            .txt
          </Button>
          <Button variant="outline" size="sm" onClick={exportJson}>
            <FileJson className="h-4 w-4 mr-1" />
            .json
          </Button>
          <Button variant="outline" size="sm" onClick={exportPdf}>
            <FileDown className="h-4 w-4 mr-1" />
            .pdf
          </Button>
        </div>
      </div>

      {script.scenes.map((scene) => (
        <Card key={scene.sceneNumber} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm font-bold">
                Cảnh {scene.sceneNumber}
              </span>
              <span className="flex items-center text-sm font-normal text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                [{scene.timeStart} - {scene.timeEnd}]
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 mt-1 text-blue-400 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Mô tả hình ảnh</span>
                  <p className="text-sm mt-0.5">{scene.visualDescription}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mic className="h-4 w-4 mt-1 text-green-400 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase">Lời thoại / Voiceover</span>
                  <p className="text-sm mt-0.5 italic">&ldquo;{scene.voiceover}&rdquo;</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="veo3">
              <TabsList className="w-full">
                {AI_TOOLS.map((tool) => (
                  <TabsTrigger key={tool.key} value={tool.key} className="text-xs">
                    {tool.icon} {tool.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {AI_TOOLS.map((tool) => {
                const prompt = scene.prompts.find((p) => p.tool === tool.key)
                return (
                  <TabsContent key={tool.key} value={tool.key}>
                    <div className="relative bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {tool.icon} {tool.name} ({tool.type})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() =>
                            copyToClipboard(
                              prompt?.prompt || "",
                              `${scene.sceneNumber}-${tool.key}`
                            )
                          }
                        >
                          {copiedId === `${scene.sceneNumber}-${tool.key}` ? (
                            <Check className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 mr-1" />
                          )}
                          {copiedId === `${scene.sceneNumber}-${tool.key}` ? "Đã copy" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-sm font-mono whitespace-pre-wrap">
                        {prompt?.prompt || "Không có prompt cho tool này"}
                      </p>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
