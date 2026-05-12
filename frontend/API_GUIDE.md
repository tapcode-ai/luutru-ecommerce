# Hướng dẫn API cho Lưu Trữ

## Vấn đề hiện tại

Hiện tại website đang gọi API từ **json-server** chạy local ở `http://localhost:3001`. Khi deploy lên Netlify, sẽ không có json-server nên dữ liệu sẽ không hiển thị.

## Các giải pháp

### Giải pháp 1: Dùng Mock Data (Đơn giản nhất - Khuyên dùng)

Chuyển toàn bộ dữ liệu từ json-server sang mock data trong code, không cần API.

**Cách làm:**
1. Mở file `frontend/src/lib/mockData.ts` - dữ liệu đã có sẵn ở đây
2. Sửa các file gọi API để dùng mock data thay vì fetch

Ví dụ sửa `frontend/src/app/page.tsx`:
```typescript
// THAY VÌ fetch từ json-server:
const res = await fetch("http://localhost:3001/products?featured=true&_limit=8");

// HÃY DÙNG mock data:
import { getProducts } from "@/lib/mockData";
const products = getProducts().filter(p => p.featured).slice(0, 8);
```

### Giải pháp 2: Dùng MockAPI.io (Miễn phí)

MockAPI.io là dịch vụ fake REST API miễn phí.

**Cách làm:**
1. Vào https://mockapi.io/ đăng ký tài khoản
2. Tạo project mới với các resource: `products`, `users`, `orders`, `cart`
3. Import dữ liệu từ file `frontend/db.json` vào MockAPI
4. Cập nhật file `frontend/src/lib/api.ts` với URL từ MockAPI

```typescript
// frontend/src/lib/api.ts
const API_URL = "https://your-project.mockapi.io/api/v1";
```

### Giải pháp 3: Dùng Supabase (Mạnh mẽ hơn - Có database thật)

Supabase có sẵn trong dự án (đã cài `@supabase/supabase-js`).

**Cách làm:**
1. Vào https://supabase.com đăng ký
2. Tạo project mới
3. Tạo các bảng: `products`, `users`, `orders`, `cart_items`
4. Import dữ liệu từ `frontend/db.json`
5. Cập nhật file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Giải pháp 4: Deploy backend riêng lên Render.com

Deploy backend Node.js/Express lên Render.com (miễn phí).

**Cách làm:**
1. Push code backend lên GitHub riêng
2. Vào https://render.com tạo Web Service mới
3. Kết nối với GitHub repo backend
4. Cấu hình:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Lấy URL backend (vd: `https://luutru-api.onrender.com`)
6. Cập nhật `frontend/src/lib/api.ts`:

```typescript
const API_URL = "https://luutru-api.onrender.com/api";
```

## Hướng dẫn deploy lên Netlify

### Bước 1: Đẩy code lên GitHub (đã làm xong ✅)

### Bước 2: Chọn giải pháp API ở trên

### Bước 3: Cập nhật code để dùng API mới

### Bước 4: Vào Netlify

1. Vào https://netlify.com
2. Đăng nhập bằng GitHub
3. Click "Add new site" → "Import an existing project"
4. Chọn repo `tapcode-ai/luutru-ecommerce`
5. Cấu hình:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/.next`
6. Thêm environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: URL API bạn chọn
7. Click "Deploy site"

### Bước 5: Chờ deploy hoàn tất (khoảng 2-3 phút)

## Tôi khuyên bạn dùng Giải pháp 1 (Mock Data)

**Lý do:**
- Nhanh nhất, không cần cấu hình gì thêm
- Dữ liệu có sẵn trong code
- Deploy lên Netlify là chạy ngay
- Sau này muốn nâng cấp lên API thật thì dễ dàng

**Nếu muốn dùng giải pháp 1, hãy bảo tôi và tôi sẽ sửa code giúp bạn!**