# Lưu Trữ - E-Commerce Platform

Modern e-commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Inspired by AliExpress design with premium UI/UX.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui, Framer Motion, Lucide React
- **State Management:** Zustand
- **Database:** PostgreSQL / Supabase
- **AI Integration:** OpenAI API, Anthropic API
- **Deployment:** Vercel, Railway

## ✨ Features

### UI/UX
- 🎨 Premium modern design with dark theme
- 📱 Fully responsive (mobile-first)
- 🎯 Smooth animations with Framer Motion
- 🛒 Interactive shopping cart sidebar
- 💝 Wishlist functionality
- 🔍 Smart search with AI integration
- ⚡ Flash sale countdown timer
- 🏷️ Product cards with hover effects
- 📦 Horizontal product sections
- 🗂️ Category navigation with mega menu

### AI Features
- 🤖 AI Shopping Assistant Chatbot
- 🎯 AI Product Recommendations
- 🔎 AI Semantic Search
- 💬 Real-time chat streaming

### Performance
- ⚡ Lazy loading images
- 🎯 SEO optimized
- 📱 Mobile responsive
- 🎨 Skeleton loading states
- 🔄 Smooth page transitions

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── product/           # Product components
│   │   ├── home/              # Homepage sections
│   │   ├── cart/              # Cart components
│   │   ├── chat/              # AI Chatbot
│   │   └── shared/            # Shared components
│   ├── store/                 # Zustand stores
│   ├── lib/                   # Utilities & constants
│   ├── types/                 # TypeScript types
│   └── hooks/                 # Custom hooks
├── public/                    # Static assets
└── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd luutru/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Run development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Environment Variables

```env
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## 🚀 Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Supabase (Database)

1. Create Supabase project
2. Run migration scripts
3. Get API keys
4. Update environment variables

### Railway (Backend API)

1. Create Railway project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

## 📦 Dependencies

### Main
- next: ^14.0.0
- react: ^18.0.0
- typescript: ^5.0.0

### UI
- tailwindcss: ^3.4.0
- framer-motion: ^11.0.0
- lucide-react: ^0.300.0
- @radix-ui/* (various)

### State
- zustand: ^4.5.0

### Database
- @supabase/supabase-js: ^2.39.0
- prisma: ^5.0.0

### AI
- openai: ^4.0.0
- @anthropic-ai/sdk: ^0.20.0

## 🎨 Design System

### Colors
- Background: #0a0a0f (Dark)
- Card: #14141f
- Primary: #dc2626 (Red)
- Accent: #f97316 (Orange)
- Text: #ffffff

### Typography
- Font: Inter
- Headings: Bold, 24-48px
- Body: Regular, 14-16px

### Components
- Rounded corners: 12-16px (xl-2xl)
- Shadows: Soft, layered
- Transitions: 200-300ms ease
- Animations: Spring physics

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.
