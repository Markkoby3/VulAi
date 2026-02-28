# VulAI Frontend

Modern, interactive web frontend for VulAI - The AI that audits AI.

## 🚀 Features

- **Live Code Analysis**: Upload code and get real-time vulnerability detection
- **Beautiful UX**: Dark theme optimized for developer experience
- **Production Ready**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Fast Performance**: Optimized for speed with sub-4-second analysis
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📁 Structure

```
frontend/
├── app/                 # Next.js App Router
│   ├── (pages)         # Public pages
│   ├── api/            # API routes (backend proxy)
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/               # Utilities, types, constants
├── hooks/             # Custom React hooks
├── public/            # Static assets
└── styles/            # Global CSS
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

```bash
npm run build
npm start
```

## 📝 Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

For production (Vercel):

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
```

## 🎯 Pages

- **Landing** (`/`) - Hero, problem, features, CTA
- **Demo** (`/demo`) - Interactive code analysis playground
- **About** (`/about`) - Technical deep-dive and architecture
- **404** - Custom not-found page

## 🔌 API Integration

The frontend communicates with the FastAPI backend through:

1. **Direct axios calls** (development)
2. **Next.js proxy routes** (production CORS handling)

### Backend Endpoints Used

- `POST /api/analyze` - Analyze code for vulnerabilities
- `POST /api/refactor` - Generate secure code
- `GET /api/score` - Quick security scoring
- `GET /health` - Health check

## 📦 Key Dependencies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Auto-deploy on push

```bash
# One-click deployment
npm run vercel
```

### Docker

```bash
docker build -t vulai-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=http://backend:8000 \
  vulai-frontend
```

## 📊 Performance

- Landing page: ~100KB First Load JS
- Demo page: ~124KB First Load JS
- Fully optimized with code splitting

## 🎨 Design System

### Colors

- **Primary**: Cyan (#06b6d4)
- **Accent**: Blue (#2563eb)
- **Background**: Dark Slate (#0f172a)
- **Text**: White with gray accents

### Severity Colors

- **Critical**: Red (#dc2626)
- **High**: Orange (#f97316)
- **Medium**: Yellow (#eab308)
- **Low**: Blue (#3b82f6)

### Grade Colors

- **A**: Emerald (#10b981)
- **B**: Cyan (#06b6d4)
- **C**: Yellow (#eab308)
- **D**: Orange (#f97316)
- **F**: Red (#ef4444)

## 🧪 Testing

```bash
npm run lint
```

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1400px+

## 🔐 Security

- Type-safe TypeScript
- Safe HTTP calls with error handling
- No sensitive data in frontend
- CORS proxy for backend calls
- Clean environment variable handling

## 📖 Documentation

See parent README for full project documentation:

- [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- [API.md](../API.md) - API reference
- [DEMO_TALKING_POINTS.md](../DEMO_TALKING_POINTS.md) - Demo script

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request

## 📄 License

Same as parent VulAI project
