# SIPOMA - Sistem Informasi Produksi Management

Aplikasi web enterprise-grade untuk operasi manufaktur semen dengan integrasi AI, real-time analytics, dan UX design terdepan.

## 🎯 Fitur Utama

### 📊 Central Command Dashboard

- Real-time operations center dengan red-themed interface
- Live KPI monitoring dengan red threshold alerts
- 3D Factory Floor Visualization dengan red machinery highlights
- Weather Integration dengan red warning indicators
- Emergency Alert System dengan cascading red notifications

### 🏗 Project Management Module

- Comprehensive Project Management dengan AI Integration
- S-Curve Analysis dengan Planned vs Actual progress visualization
- Dual View Modes: Table view & Kanban board dengan drag-and-drop
- Excel Integration untuk import/export tasks dengan bulk operations
- AI Features: Auto-generate subtasks, project summaries, risk analysis

### 🏭 Factory Control Operations

- Digital Factory Management System
- CCR Data Entry dengan dynamic hourly logsheets per mill unit
- Real-time monitoring dan comprehensive downtime logging
- Energy Monitoring dengan power consumption tracking
- Quality Control dengan parameter monitoring

### 🚢 Port Performance Management

- Maritime Operations Optimization
- AI-Powered Delivery Suggestions dengan optimal scheduling
- Weather Integration dengan real-time weather impact analysis
- Vessel Tracking dengan AIS integration
- Performance Analytics dengan tonnage & loading rate metrics

### 📦 Packing Plant Intelligence

- Smart Packaging Operations Center
- 60-Day Stock Projection dengan ML-powered forecasting
- Packer Asset Management dengan downtime logging
- Distribution Planning dengan route optimization
- Monthly Data Entry dengan auto-calculating stock reconciliation

## 🛠 Tech Stack

### Core Technologies

- **Framework**: Next.js 14 (App Router) dengan React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4+ dengan custom design system
- **Database**: Supabase (PostgreSQL) dengan Real-time subscriptions
- **AI Integration**: Google Gemini AI (gemini-2.5-flash)
- **PWA**: Next-PWA dengan advanced caching strategies
- **State Management**: Zustand + React Query

### Design System

- **Theme**: Modern Industrial dengan red/black/white color scheme
- **Primary Color**: #DC2626 (Red-600) - Main brand color
- **Fonts**: Inter untuk UI, JetBrains Mono untuk code
- **Icons**: Lucide React untuk consistent iconography

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, atau pnpm
- Supabase account
- Google Gemini AI API key

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/your-org/sipoma.git
   cd sipoma
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` dengan konfigurasi Anda:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Setup database**

   - Buat project baru di [Supabase](https://supabase.com)
   - Jalankan migrations untuk setup schema database
   - Import sample data jika diperlukan

5. **Run development server**

   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

6. **Open aplikasi**
   Buka [http://localhost:3000](http://localhost:3000) di browser

## 📁 Project Structure

```bash
sipoma/
├── src/
│   ├── app/                          # App Router pages & layouts
│   │   ├── (dashboard)/             # Dashboard route group
│   │   ├── (admin)/                 # Admin-only routes
│   │   ├── projects/                # Project management
│   │   ├── factory-control/         # Factory operations
│   │   ├── port-performance/        # Port management
│   │   ├── packing-plant/           # Packing plant operations
│   │   ├── globals.css              # Global styles + CSS variables
│   │   └── layout.tsx               # Root layout dengan providers
│   ├── components/
│   │   ├── ui/                      # Base UI components
│   │   ├── charts/                  # Custom chart components
│   │   ├── forms/                   # Form components dengan validation
│   │   ├── layout/                  # Layout components (Sidebar, Header)
│   │   ├── dashboard/               # Dashboard-specific components
│   │   └── providers.tsx            # App providers
│   ├── lib/
│   │   ├── supabase/               # Database functions & types
│   │   ├── utils.ts                # Utility functions
│   │   └── validations/            # Zod schemas
│   ├── stores/                      # Zustand stores
│   ├── types/                       # TypeScript definitions
│   ├── constants/                   # App constants & configurations
│   └── hooks/                       # Custom React hooks
├── public/                          # Static assets & PWA files
├── .env.example                     # Environment variables template
├── tailwind.config.js              # Tailwind configuration
├── next.config.js                  # Next.js configuration
└── package.json                     # Dependencies & scripts
```

## 🎨 Design System

### Color Palette

```css
/* Primary Brand Colors */
--primary-red: #DC2626 (Red-600)     /* Main brand color */
--secondary-red: #EF4444 (Red-500)   /* Energy & Urgency */
--success-green: #22C55E (Green-500) /* Achievement & Growth */
--warning-amber: #F59E0B (Amber-500) /* Attention & Caution */
--error-red: #B91C1C (Red-700)       /* Critical Issues */

/* Neutral Grays */
--gray-50: #F9FAFB     /* Light backgrounds */
--gray-900: #111827    /* Darkest text/backgrounds */
```

### Typography

- **Headings**: Font weight 600-700, Red accent colors
- **Body text**: Gray-700 (light mode) / Gray-300 (dark mode)
- **Secondary text**: Gray-500

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Code Style

Project menggunakan:

- **ESLint** untuk code linting
- **TypeScript** dalam strict mode
- **Prettier** untuk code formatting (opsional)
- **Conventional Commits** untuk commit messages

### Adding New Features

1. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name

   ```

2. **Develop your feature**

   - Tambahkan components di `src/components/`
   - Tambahkan pages di `src/app/`
   - Tambahkan types di `src/types/`
   - Update constants jika diperlukan

3. **Test your changes**

   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```

4. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## 🏗 Architecture

### Real-time Data Flow

- **WebSocket connections** untuk live factory data
- **Supabase Realtime** untuk database changes
- **React Query** untuk efficient data fetching dan caching

### AI Integration

- **Google Gemini AI** untuk intelligent suggestions
- **Computer Vision** untuk automatic report reading
- **Predictive Analytics** untuk maintenance alerts

### Security

- **Row Level Security (RLS)** di Supabase
- **Role-based access control** untuk granular permissions
- **API rate limiting** untuk protection

## 📱 PWA Features

SIPOMA adalah Progressive Web App dengan fitur:

- **Offline-first architecture** dengan smart caching
- **Mobile-optimized interfaces** untuk factory floor operations
- **Push notifications** untuk real-time alerts
- **Camera integration** untuk barcode scanning & photo capture

## 🔐 Environment Variables

Variabel environment yang diperlukan:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Integration
NEXT_PUBLIC_GEMINI_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_ENABLE_ANALYTICS=
NEXT_PUBLIC_DEBUG=

# Security
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy ke Vercel**

   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables** di Vercel dashboard

3. **Configure domain** dan SSL certificate

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes dengan conventional commits
4. Push ke branch
5. Open Pull Request

## 📄 License

Copyright © 2024 SIPOMA Team. All rights reserved.

## 🆘 Support

Untuk support atau pertanyaan:

- 📧 Email: [support@sipoma.com](mailto:support@sipoma.com)
- 📚 Documentation: [docs.sipoma.com](https://docs.sipoma.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/sipoma/issues)

---

**SIPOMA** - Revolutionizing cement manufacturing operations with modern technology and intelligent automation.
