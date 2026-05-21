# AI Video Scriptwriter

Công cụ tạo kịch bản video AI và prompt tối ưu cho các nền tảng video - Giao diện 100% Tiếng Việt.

## Tính năng

- **Đăng ký / Đăng nhập** bằng email (Supabase Auth)
- **Tạo kịch bản video** với Claude AI (streaming response)
- **Prompt tối ưu** cho 7 AI tools: Veo 3, Grok, Sora, Runway ML, Kling AI, Midjourney, Flux
- **Lịch sử kịch bản** - lưu, xem lại, đổi tên, xóa
- **Export** - .txt, .json, .pdf
- **Dark mode** mặc định, responsive design

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui components
- Supabase (Auth + Database)
- Claude API (claude-sonnet-4-20250514)

## Cài đặt

```bash
npm install
```

### Cấu hình biến môi trường

Tạo file `.env.local`:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Thiết lập Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Chạy SQL trong `supabase-schema.sql` tại SQL Editor
3. Bật Email Auth trong Authentication > Providers

### Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Deploy lên Vercel

1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm environment variables
4. Deploy!
