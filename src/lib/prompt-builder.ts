import type { ScriptFormData } from "@/types"
import {
  PLATFORM_LABELS,
  DURATION_LABELS,
  STYLE_LABELS,
  TONE_LABELS,
  LANGUAGE_LABELS,
} from "@/types"

export function buildSystemPrompt(data: ScriptFormData): string {
  const platform = PLATFORM_LABELS[data.platform]
  const duration = DURATION_LABELS[data.duration]
  const style = STYLE_LABELS[data.style]
  const tone = TONE_LABELS[data.tone]
  const language = LANGUAGE_LABELS[data.language]

  return `Bạn là chuyên gia sáng tạo nội dung video và AI prompt engineering.
Nhiệm vụ: Tạo kịch bản video chi tiết và tối ưu prompt cho các công cụ AI tạo video/ảnh.

Thông số:
- Nền tảng: ${platform}
- Thời lượng: ${duration}
- Phong cách: ${style}
- Giọng điệu: ${tone}
- Ngôn ngữ kịch bản: ${language}

BẮT BUỘC trả về JSON hợp lệ với format sau (không có text nào khác ngoài JSON):
{
  "title": "Tên kịch bản",
  "scenes": [
    {
      "sceneNumber": 1,
      "timeStart": "0:00",
      "timeEnd": "0:05",
      "description": "Mô tả cảnh bằng ${language}",
      "voiceover": "Lời thoại/voiceover bằng ${language}",
      "visualDescription": "Mô tả chi tiết hình ảnh bằng ${language}",
      "prompts": [
        {
          "tool": "veo3",
          "prompt": "Prompt tiếng Anh tối ưu cho Google Veo 3. Mô tả chi tiết camera movement, lighting, mood, cinematic quality. Bao gồm: camera angle, movement type, lighting condition, color palette, atmosphere, resolution quality."
        },
        {
          "tool": "grok",
          "prompt": "Prompt tiếng Anh tối ưu cho Grok Aurora (xAI). Mô tả photorealistic scene, 8K resolution, cinematic color grading, detailed environment."
        },
        {
          "tool": "sora",
          "prompt": "Prompt tiếng Anh tối ưu cho OpenAI Sora. Detailed scene description, camera work, lighting, temporal consistency, smooth motion."
        },
        {
          "tool": "runway",
          "prompt": "Prompt tiếng Anh tối ưu cho Runway ML Gen-3. Focus on motion, camera movement, style transfer, visual effects."
        },
        {
          "tool": "kling",
          "prompt": "Prompt tiếng Anh tối ưu cho Kling AI. Detailed visual description, camera angle, movement, cinematic look."
        },
        {
          "tool": "midjourney",
          "prompt": "/imagine [detailed scene description] --ar 16:9 --v 6.1 --style raw"
        },
        {
          "tool": "flux",
          "prompt": "Prompt tiếng Anh tối ưu cho Flux. Photorealistic, detailed scene, lighting, composition."
        }
      ]
    }
  ]
}

Quy tắc:
1. Chia cảnh hợp lý theo thời lượng ${duration}
2. Timestamp phải liên tục và cover đủ thời lượng
3. Mỗi cảnh PHẢI có đủ 7 prompt cho 7 tool AI
4. Prompt cho video tools phải mô tả camera movement, lighting, mood
5. Prompt Midjourney PHẢI có --ar 16:9 --v 6.1
6. Tất cả prompt đều bằng tiếng Anh (trừ description/voiceover theo ngôn ngữ đã chọn)
7. Prompt phải cụ thể, chi tiết, tối ưu cho từng tool
8. CHỈ trả về JSON, không có text giải thích nào khác`
}

export function buildUserPrompt(topic: string): string {
  return `Tạo kịch bản video chi tiết cho chủ đề sau:\n\n${topic}`
}
