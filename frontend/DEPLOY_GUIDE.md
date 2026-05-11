# Hướng dẫn Deploy - Đưa trang web lên Internet

## 🚀 Cách 1: Deploy lên Vercel (Nhanh nhất - Miễn phí)

### Bước 1: Tạo tài khoản Vercel
1. Truy cập: https://vercel.com
2. Đăng ký bằng GitHub (khuyên dùng) hoặc email

### Bước 2: Đẩy code lên GitHub
```bash
# Mở terminal trong VS Code (Ctrl + `)

# 1. Khởi tạo Git repository
cd d:\MyProjects\luutru
git init
git add .
git commit -m "Initial commit - LuuTru E-commerce"

# 2. Tạo repository trên GitHub:
#    - Vào https://github.com/new
#    - Đặt tên: luutru-ecommerce
#    - Không tick "Initialize with README"
#    - Click "Create repository"

# 3. Liên kết và push code
git remote add origin https://github.com/YOUR_USERNAME/luutru-ecommerce.git
git branch -M main
git push -u origin main
```

### Bước 3: Deploy lên Vercel
1. Vào https://vercel.com
2. Click "Add New..." → "Project"
3. Chọn repository `luutru-ecommerce`
4. **QUAN TRỌNG**: Trong phần "Root Directory", nhập: `frontend`
5. Framework Preset: Chọn **Next.js**
6. Click "Deploy" ✅

**Sau 2-3 phút, bạn sẽ có domain:** `https://luutru-ecommerce.vercel.app`

---

## 🗄️ Cách 2: Kết nối Database với Supabase (Miễn phí)

### Bước 1: Tạo Supabase Project
1. Truy cập: https://supabase.com
2. Đăng ký bằng GitHub
3. Click "New Project"
4. Điền:
   - Name: `luutru`
   - Database Password: Tạo mật khẩu mạnh
   - Region: `Singapore` (gần Việt Nam nhất)
5. Click "Create new project" (đợi 2-3 phút)

### Bước 2: Lấy thông tin kết nối
1. Vào Project Settings → Database
2. Copy `Connection string` (URL)
3. Vào Project Settings → API
4. Copy `Project URL` và `anon public key`

### Bước 3: Tạo bảng trong Supabase
Vào SQL Editor, paste và chạy:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12,0) NOT NULL,
  old_price DECIMAL(12,0),
  discount INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  is_flash_sale BOOLEAN DEFAULT false,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total DECIMAL(12,0) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(12,0) NOT NULL
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Conversations table (AI Chat)
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (AI Chat)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Bước 4: Cập nhật .env.local
Mở file `frontend/.env.local` và thêm:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (cho AI Chat)
OPENAI_API_KEY=sk-your-openai-key

# Anthropic (cho AI Search)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
```

---

## 🌐 Cách 3: Tạo domain riêng (VD: luutru.vn)

### Mua domain:
1. Vào https://vercel.com/domains
2. Nhập tên domain bạn muốn (VD: `luutru.vn`)
3. Làm theo hướng dẫn để mua và cấu hình

### Hoặc mua từ nhà cung cấp khác:
- **Nhà cung cấp Việt Nam**: PA Vietnam, Mắt Bão, iNET
- **Quốc tế**: Namecheap, GoDaddy
- **Giá**: ~100k-300k/năm cho .com, .vn

### Trỏ domain về Vercel:
1. Vào Vercel → Project → Settings → Domains
2. Thêm domain của bạn
3. Làm theo hướng dẫn để trỏ DNS

---

## 📱 Cách 4: Chia sẻ tạm thời (Không cần deploy)

### Dùng localtunnel (miễn phí):
```bash
# Mở terminal mới (giữ nguyên terminal đang chạy next dev)
npx localtunnel --port 3000
```
→ Bạn sẽ nhận được URL như: `https://some-id.loca.lt`
→ Gửi URL này cho bạn bè (chỉ hoạt động khi máy bạn bật)

### Dùng ngrok:
```bash
# Tải ngrok từ https://ngrok.com
# Sau đó chạy:
ngrok http 3000
```
→ Nhận URL: `https://some-id.ngrok-free.app`

---

## 🎯 Tóm tắt nhanh

| Phương pháp | Thời gian | Chi phí | Ưu điểm |
|-------------|-----------|---------|---------|
| **Vercel** | 5 phút | Miễn phí | Nhanh, ổn định, có domain .vercel.app |
| **Supabase** | 10 phút | Miễn phí | Database đầy đủ, realtime |
| **Domain riêng** | 1-2 ngày | ~200k/năm | Chuyên nghiệp |
| **localtunnel** | 1 phút | Miễn phí | Test nhanh, tạm thời |

---

## ❓ Cần hỗ trợ?

Nếu bạn gặp vấn đề, hãy cho tôi biết và tôi sẽ giúp bạn từng bước cụ thể!
