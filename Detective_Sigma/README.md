# Detective Sigma - Docker Setup

A gamified educational platform for Singapore Primary 4-6 students to learn Math and Science through detective mysteries.

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- 4GB RAM minimum
- 10GB free disk space

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Detective_Murder_Learning/Detective_Murder
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your settings (use defaults for development).

### 3. Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed sample data
docker-compose exec backend npm run seed
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📦 Services Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Nginx (Port 80)                  │
│              Reverse Proxy & Load Balancer          │
└──────────────┬─────────────────┬────────────────────┘
               │                 │
       ┌───────▼────────┐ ┌─────▼──────────┐
       │   Frontend     │ │    Backend     │
       │  React SPA     │ │   Node.js API  │
       │  (Port 3000)   │ │  (Port 4000)   │
       └────────────────┘ └────────┬────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
           ┌──────▼─────┐   ┌─────▼──────┐  ┌─────▼─────┐
           │ PostgreSQL │   │   Redis    │  │   Nginx   │
           │  Database  │   │   Cache    │  │  Static   │
           │ (Port 5432)│   │(Port 6379) │  │   Files   │
           └────────────┘   └────────────┘  └───────────┘
```

## 🛠️ Development Commands

### Docker Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View service logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec backend sh
docker-compose exec frontend sh

# Restart a specific service
docker-compose restart backend
```

### Database Operations
```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U detective -d detective_academy

# Backup database
docker-compose exec postgres pg_dump -U detective detective_academy > backup.sql

# Restore database
docker-compose exec -T postgres psql -U detective detective_academy < backup.sql

# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

### Backend Development
```bash
# Run tests
docker-compose exec backend npm test

# Run migrations
docker-compose exec backend npm run migrate

# Seed data
docker-compose exec backend npm run seed

# Check logs
docker-compose logs -f backend

# Install new package
docker-compose exec backend npm install package-name
docker-compose restart backend
```

### Frontend Development
```bash
# Install new package
docker-compose exec frontend npm install package-name

# Rebuild frontend
docker-compose exec frontend npm run build

# Check logs
docker-compose logs -f frontend
```

## 🏗️ Project Structure

```
Detective_Murder/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation, etc.
│   │   ├── database/         # DB connection & queries
│   │   └── utils/            # Helpers & utilities
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── Components/           # React components
│   ├── Pages/               # Route pages
│   ├── Entities/            # Data schemas
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── nginx/
│   └── nginx.conf           # Reverse proxy config
├── docker-compose.yml       # Service orchestration
├── .env.example             # Environment template
└── README.md
```

## 🔧 Configuration

### Environment Variables

Key variables in `.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed frontend origin
- `NODE_ENV`: Environment (development/production)

### Ports

Default ports (configurable in `docker-compose.yml`):

- **80**: Nginx reverse proxy
- **3000**: Frontend (React)
- **4000**: Backend API
- **5432**: PostgreSQL
- **6379**: Redis

## 🧪 Testing

```bash
# Run all tests
docker-compose exec backend npm test

# Run tests with coverage
docker-compose exec backend npm test -- --coverage

# Run specific test file
docker-compose exec backend npm test -- cases.test.js
```

## 📊 Monitoring

### Health Checks
```bash
# Check all services
docker-compose ps

# API health
curl http://localhost:4000/health

# Database connection
docker-compose exec postgres pg_isready
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

## 🚀 Production Deployment

### Build Production Images
```bash
# Build optimized images
docker-compose -f docker-compose.prod.yml build

# Push to registry
docker-compose -f docker-compose.prod.yml push
```

### Environment Setup
1. Set `NODE_ENV=production` in `.env`
2. Use strong secrets for `JWT_SECRET` and database passwords
3. Configure SSL certificates in nginx
4. Enable HTTPS redirect in nginx config
5. Set up proper backup strategy

### Security Checklist
- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up monitoring/alerting
- [ ] Regular security updates

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process using port
netstat -ano | findstr :3000
taskkill /PID <process-id> /F
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

**Frontend can't reach backend:**
```bash
# Check network connectivity
docker-compose exec frontend ping backend

# Verify API URL in environment
docker-compose exec frontend env | grep API_URL
```

**Permission denied errors:**
```bash
# On Linux, fix permissions
sudo chown -R $USER:$USER .
```

## 📝 API Documentation

### Base URL
`http://localhost:4000/api/v1`

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

#### Cases
- `GET /cases` - List all cases
- `GET /cases/:id` - Get case details
- `POST /cases/:id/start` - Start a case
- `POST /cases/:id/solve` - Submit solution

#### Progress
- `GET /progress` - Get user progress
- `PUT /progress/:id` - Update progress

#### Leaderboard
- `GET /leaderboard` - Get top detectives

Full API documentation: http://localhost:4000/api/v1

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

- **Issues**: GitHub Issues
- **Email**: support@detectiveacademy.com
- **Discord**: [Join our community](#)

---

Built with ❤️ for Singapore Primary School students
