"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  History,
  Trash2,
  Edit2,
  Check,
  X,
  Film,
  Clock,
  ArrowLeft,
  Eye,
} from "lucide-react"
import type { GeneratedScript } from "@/types"
import { PLATFORM_LABELS, DURATION_LABELS, STYLE_LABELS } from "@/types"

interface ScriptRecord {
  id: string
  title: string
  form_data: GeneratedScript["formData"]
  scenes: GeneratedScript["scenes"]
  raw_content: string
  created_at: string
}

export function HistoryPage() {
  const [scripts, setScripts] = useState<ScriptRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [selectedScript, setSelectedScript] = useState<ScriptRecord | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadScripts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth")
      return
    }

    const res = await fetch("/api/scripts")
    if (res.ok) {
      const data = await res.json()
      setScripts(data)
    }
    setLoading(false)
  }, [router, supabase.auth])

  useEffect(() => {
    loadScripts()
  }, [loadScripts])

  const handleRename = async (id: string) => {
    const res = await fetch("/api/scripts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: editTitle }),
    })
    if (res.ok) {
      setScripts(scripts.map((s) => (s.id === id ? { ...s, title: editTitle } : s)))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa kịch bản này?")) return
    const res = await fetch(`/api/scripts?id=${id}`, { method: "DELETE" })
    if (res.ok) {
      setScripts(scripts.filter((s) => s.id !== id))
      if (selectedScript?.id === id) setSelectedScript(null)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (selectedScript) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedScript(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{selectedScript.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedScript.created_at)} |{" "}
                {PLATFORM_LABELS[selectedScript.form_data.platform]} |{" "}
                {DURATION_LABELS[selectedScript.form_data.duration]} |{" "}
                {STYLE_LABELS[selectedScript.form_data.style]}
              </p>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                {selectedScript.raw_content}
              </pre>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Lịch sử kịch bản</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : scripts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Film className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Chưa có kịch bản nào</p>
              <Button className="mt-4" onClick={() => router.push("/")}>
                Tạo kịch bản đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {scripts.map((script) => (
              <Card key={script.id} className="hover:bg-muted/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === script.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRename(script.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium truncate">{script.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(script.created_at)}
                            <span>|</span>
                            {PLATFORM_LABELS[script.form_data.platform]}
                            <span>|</span>
                            {DURATION_LABELS[script.form_data.duration]}
                          </div>
                        </>
                      )}
                    </div>
                    {editingId !== script.id && (
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedScript(script)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingId(script.id)
                            setEditTitle(script.title)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(script.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
