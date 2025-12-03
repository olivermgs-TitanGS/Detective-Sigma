# Detective Sigma - Quick Start Guide

## ✅ System Status: RUNNING

All services have been successfully deployed and are running!

### 🌐 Access URLs

- **Frontend (Web App)**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health
- **PostgreSQL Database**: localhost:5432
- **Redis Cache**: localhost:6379

### 📊 Service Status

```
✅ PostgreSQL Database: HEALTHY (Port 5432)
✅ Redis Cache: HEALTHY (Port 6379)
✅ Backend API: HEALTHY (Port 4000)
✅ Frontend App: HEALTHY (Port 3000)
✅ Nginx Proxy: RUNNING (Port 80)
```

### 🔧 Useful Commands

#### View Running Containers
```powershell
docker-compose ps
```

#### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Stop Services
```powershell
docker-compose down
```

#### Start Services
```powershell
docker-compose up -d
```

#### Restart a Service
```powershell
docker-compose restart backend
docker-compose restart frontend
```

#### Access Database
```powershell
docker-compose exec postgres psql -U detective -d detective_academy
```

#### Run Backend Commands
```powershell
# Enter backend container
docker-compose exec backend sh

# Run migrations (when implemented)
docker-compose exec backend npm run migrate

# Seed database (when implemented)
docker-compose exec backend npm run seed
```

### 📝 Next Steps

1. **Copy Your Game Components**
   - Copy `Components/` folder → `frontend/src/Components/`
   - Copy `Pages/` folder → `frontend/src/Pages/`
   - Copy `Layout.js` → `frontend/src/Layout.jsx`
   - Update imports in `frontend/src/App.jsx`

2. **Initialize Database**
   ```powershell
   docker-compose exec postgres psql -U detective -d detective_academy -f /docker-entrypoint-initdb.d/01_schema.sql
   ```

3. **Test API Endpoints**
   - GET http://localhost:4000/api/v1/cases
   - GET http://localhost:4000/api/v1
   
4. **Configure Environment**
   - Edit `.env` file if needed
   - Restart services: `docker-compose restart`

### 🛠️ Current Implementation

**Backend (Node.js + Express)**
- ✅ PostgreSQL connection with pooling
- ✅ Redis integration ready
- ✅ Rate limiting & security (Helmet, CORS)
- ✅ Structured logging (Winston)
- ✅ API routes: /cases, /scenes, /clues, /suspects, /puzzles, /progress, /leaderboard
- ✅ Complete database schema with indexes
- ✅ Health check endpoint

**Frontend (React + Vite)**
- ✅ React 18 with Router
- ✅ TanStack Query for data fetching
- ✅ Tailwind CSS styling
- ✅ Production build with Nginx
- ⏳ Game components (ready to copy from root directory)

**Infrastructure**
- ✅ Docker Compose orchestration
- ✅ Multi-stage builds (optimized images)
- ✅ Health checks on all services
- ✅ Persistent volumes for data
- ✅ Nginx reverse proxy

### 🔍 Troubleshooting

**Frontend not loading?**
```powershell
docker-compose logs frontend
docker-compose restart frontend
```

**Backend errors?**
```powershell
docker-compose logs backend
# Check database connection
docker-compose exec backend npm run test-db
```

**Database not connected?**
```powershell
docker-compose logs postgres
docker-compose restart postgres
```

**Port conflicts?**
Edit `docker-compose.yml` and change port mappings:
- Frontend: `"3001:3000"` instead of `"3000:3000"`
- Backend: `"4001:4000"` instead of `"4000:4000"`

### 📚 API Documentation

#### Cases Endpoints
- `GET /api/v1/cases` - List all published cases
- `GET /api/v1/cases/:id` - Get case details
- `POST /api/v1/cases` - Create case (admin)
- `PUT /api/v1/cases/:id` - Update case (admin)
- `DELETE /api/v1/cases/:id` - Delete case (admin)
- `POST /api/v1/cases/:id/start` - Start working on a case
- `POST /api/v1/cases/:id/solve` - Submit solution

#### Other Endpoints
- `/api/v1/scenes` - Scene management
- `/api/v1/clues` - Clue discovery
- `/api/v1/suspects` - Suspect interrogation
- `/api/v1/puzzles` - Puzzle solving
- `/api/v1/progress` - User progress tracking
- `/api/v1/leaderboard` - Top detectives

### 🎮 Testing the App

1. **Open Browser**: http://localhost:3000
2. **Check API**: http://localhost:4000/health
3. **View API Info**: http://localhost:4000/api/v1

### 🔒 Security Notes

- Change database passwords in `.env` for production
- Update `JWT_SECRET` with strong random string
- Enable HTTPS in nginx for production
- Review CORS origins in backend config

---

**Setup Complete!** 🎉

Your Detective Learning Academy is now running with Docker. All microservices are operational.

For issues or questions, check the logs:
```powershell
docker-compose logs -f
```
