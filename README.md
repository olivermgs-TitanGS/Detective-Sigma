# Detective Learning Academy

🔍 Gamified educational platform for Singapore Primary 4-6 students to learn Math and Science through detective mysteries.

## 🚀 Quick Deploy to Vercel (Recommended - Free & Simple)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/olivermgs-TitanGS/Detective-Murder-Learning)

### Steps:
1. Click the deploy button above
2. Sign in with GitHub
3. Add environment variables (see VERCEL_DEPLOYMENT.md)
4. Deploy!

Your app will be live at: `https://your-project.vercel.app`

## 📚 Documentation

- **[Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)** - Easiest way to deploy (no Docker/VM needed)
- **[Docker Deployment Guide](Detective_Murder/DOCKER_HUB_DEPLOYMENT.md)** - For advanced users with VMs
- **[Setup Guide](Detective_Murder/SETUP_COMPLETE.md)** - Local development setup

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, TanStack Query, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL, Redis
- **Infrastructure**: Vercel (serverless) or Docker (self-hosted)

## 🎮 Features

- Interactive detective cases with crime scene investigation
- Math and Science puzzles integrated into storylines
- Suspect interrogation with branching dialogues
- Evidence collection and analysis
- Progress tracking and leaderboard
- Adaptive difficulty levels
- Master mystery spanning multiple cases

## 🌐 Live Demo

- **Frontend**: https://your-project.vercel.app
- **API**: https://your-project.vercel.app/api
- **Health Check**: https://your-project.vercel.app/health

## 📦 Project Structure

```
Detective_Murder_Learning/
├── Detective_Murder/
│   ├── backend/          # Node.js API
│   ├── frontend/         # React app
│   ├── Components/       # Game components
│   ├── Pages/           # React pages
│   ├── Entities/        # Data schemas
│   └── nginx/           # Reverse proxy config
├── Documents/           # Business requirements & specs
├── vercel.json         # Vercel configuration
└── package.json        # Root dependencies
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
✅ Free tier available  
✅ Automatic deployments  
✅ No server management  
✅ Built-in CDN & SSL  

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Option 2: Docker + VM
✅ Full control  
✅ Self-hosted  
✅ Multiple services  

See [Detective_Murder/DOCKER_HUB_DEPLOYMENT.md](Detective_Murder/DOCKER_HUB_DEPLOYMENT.md)

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/olivermgs-TitanGS/Detective-Murder-Learning.git
cd Detective-Murder-Learning/Detective_Murder

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Access app at http://localhost:3000
```

## 🔒 Environment Variables

Required for deployment:

```env
DATABASE_URL=postgresql://user:password@host/dbname
REDIS_URL=redis://host:port
JWT_SECRET=your_secret_key
NODE_ENV=production
```

## 📝 License

MIT License - See LICENSE file for details

## 👥 Authors

Built for Singapore Primary School students to make learning Math and Science fun through gamification.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

- GitHub Issues: https://github.com/olivermgs-TitanGS/Detective-Murder-Learning/issues
- Email: support@detectiveacademy.com

---

Made with ❤️ for young detectives
