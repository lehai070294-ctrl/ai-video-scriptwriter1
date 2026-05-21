export type Platform = "tiktok" | "youtube_shorts" | "youtube" | "instagram_reels" | "quang_cao"

export type Duration = "15s" | "30s" | "60s" | "3min" | "5min"

export type Style = "dien_anh" | "tai_lieu" | "quang_cao" | "giai_tri" | "giao_duc"

export type Tone = "kich_tinh" | "hai_huoc" | "truyen_cam_hung" | "chuyen_nghiep"

export type ScriptLanguage = "vi" | "en"

export type AITool = "veo3" | "grok" | "sora" | "runway" | "kling" | "midjourney" | "flux"

export interface ScriptFormData {
  topic: string
  platform: Platform
  duration: Duration
  style: Style
  tone: Tone
  language: ScriptLanguage
}

export interface ScenePrompt {
  tool: AITool
  prompt: string
}

export interface Scene {
  sceneNumber: number
  timeStart: string
  timeEnd: string
  description: string
  voiceover: string
  visualDescription: string
  prompts: ScenePrompt[]
}

export interface GeneratedScript {
  id?: string
  title: string
  formData: ScriptFormData
  scenes: Scene[]
  rawContent: string
  createdAt: string
  userId?: string
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  tiktok: "TikTok",
  youtube_shorts: "YouTube Shorts",
  youtube: "YouTube",
  instagram_reels: "Instagram Reels",
  quang_cao: "Quảng cáo",
}

export const DURATION_LABELS: Record<Duration, string> = {
  "15s": "15 giây",
  "30s": "30 giây",
  "60s": "60 giây",
  "3min": "3 phút",
  "5min": "5 phút",
}

export const STYLE_LABELS: Record<Style, string> = {
  dien_anh: "Điện ảnh",
  tai_lieu: "Tài liệu",
  quang_cao: "Quảng cáo",
  giai_tri: "Giải trí",
  giao_duc: "Giáo dục",
}

export const TONE_LABELS: Record<Tone, string> = {
  kich_tinh: "Kịch tính",
  hai_huoc: "Hài hước",
  truyen_cam_hung: "Truyền cảm hứng",
  chuyen_nghiep: "Chuyên nghiệp",
}

export const LANGUAGE_LABELS: Record<ScriptLanguage, string> = {
  vi: "Tiếng Việt",
  en: "Tiếng Anh",
}

export const AI_TOOL_LABELS: Record<AITool, { name: string; icon: string; type: string }> = {
  veo3: { name: "Veo 3", icon: "🎬", type: "Video" },
  grok: { name: "Grok", icon: "🎬", type: "Video" },
  sora: { name: "Sora", icon: "🎬", type: "Video" },
  runway: { name: "Runway ML", icon: "🎬", type: "Video" },
  kling: { name: "Kling AI", icon: "🎬", type: "Video" },
  midjourney: { name: "Midjourney", icon: "🖼️", type: "Image" },
  flux: { name: "Flux", icon: "🖼️", type: "Image" },
}
