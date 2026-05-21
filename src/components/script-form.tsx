"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"
import type {
  ScriptFormData,
  Platform,
  Duration,
  Style,
  Tone,
  ScriptLanguage,
  PLATFORM_LABELS,
  DURATION_LABELS,
  STYLE_LABELS,
  TONE_LABELS,
  LANGUAGE_LABELS,
} from "@/types"

const platformOptions = [
  { value: "tiktok", label: "TikTok" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram_reels", label: "Instagram Reels" },
  { value: "quang_cao", label: "Quảng cáo" },
]

const durationOptions = [
  { value: "15s", label: "15 giây" },
  { value: "30s", label: "30 giây" },
  { value: "60s", label: "60 giây" },
  { value: "3min", label: "3 phút" },
  { value: "5min", label: "5 phút" },
]

const styleOptions = [
  { value: "dien_anh", label: "Điện ảnh" },
  { value: "tai_lieu", label: "Tài liệu" },
  { value: "quang_cao", label: "Quảng cáo" },
  { value: "giai_tri", label: "Giải trí" },
  { value: "giao_duc", label: "Giáo dục" },
]

const toneOptions = [
  { value: "kich_tinh", label: "Kịch tính" },
  { value: "hai_huoc", label: "Hài hước" },
  { value: "truyen_cam_hung", label: "Truyền cảm hứng" },
  { value: "chuyen_nghiep", label: "Chuyên nghiệp" },
]

const languageOptions = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "Tiếng Anh" },
]

interface ScriptFormProps {
  onGenerate: (data: ScriptFormData) => void
  isGenerating: boolean
}

export function ScriptForm({ onGenerate, isGenerating }: ScriptFormProps) {
  const [formData, setFormData] = useState<ScriptFormData>({
    topic: "",
    platform: "tiktok",
    duration: "30s",
    style: "dien_anh",
    tone: "kich_tinh",
    language: "vi",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.topic.trim()) return
    onGenerate(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Tạo kịch bản video AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chủ đề / Ý tưởng video</label>
            <Textarea
              placeholder="Mô tả ý tưởng video của bạn... Ví dụ: Video giới thiệu quán cà phê mới mở tại Sài Gòn, không gian vintage..."
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nền tảng</label>
              <Select
                options={platformOptions}
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value as Platform })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thời lượng</label>
              <Select
                options={durationOptions}
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value as Duration })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phong cách</label>
              <Select
                options={styleOptions}
                value={formData.style}
                onChange={(e) =>
                  setFormData({ ...formData, style: e.target.value as Style })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giọng điệu</label>
              <Select
                options={toneOptions}
                value={formData.tone}
                onChange={(e) =>
                  setFormData({ ...formData, tone: e.target.value as Tone })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ngôn ngữ kịch bản</label>
              <Select
                options={languageOptions}
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value as ScriptLanguage })
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isGenerating || !formData.topic.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo kịch bản...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo kịch bản
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
