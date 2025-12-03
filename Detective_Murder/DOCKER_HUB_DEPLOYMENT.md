# Docker Hub Upload and Deployment Guide

## Step 1: Login to Docker Hub

```powershell
# Login to Docker Hub (you'll be prompted for password)
docker login
# Enter your Docker Hub username and password
```

## Step 2: Tag Your Images

```powershell
# Replace 'yourusername' with your actual Docker Hub username
$DOCKER_USERNAME="yourusername"

# Tag backend image
docker tag detective_murder-backend:latest ${DOCKER_USERNAME}/detective-academy-backend:latest

# Tag frontend image
docker tag detective_murder-frontend:latest ${DOCKER_USERNAME}/detective-academy-frontend:latest
```

## Step 3: Push Images to Docker Hub

```powershell
# Push backend
docker push ${DOCKER_USERNAME}/detective-academy-backend:latest

# Push frontend
docker push ${DOCKER_USERNAME}/detective-academy-frontend:latest
```

## Step 4: Create Production Docker Compose for Ubuntu Server

Save this as `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: detective_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: detective
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-change_this_password}
      POSTGRES_DB: detective_academy
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - detective_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U detective"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: detective_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - detective_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API Service
  backend:
    image: yourusername/detective-academy-backend:latest
    container_name: detective_backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgresql://detective:${POSTGRES_PASSWORD:-change_this_password}@postgres:5432/detective_academy
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET:-change_this_in_production}
      JWT_EXPIRES_IN: 7d
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - detective_network

  # Frontend Web App
  frontend:
    image: yourusername/detective-academy-frontend:latest
    container_name: detective_frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://${SERVER_IP:-localhost}:4000
      REACT_APP_ENV: production
    depends_on:
      - backend
    networks:
      - detective_network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: detective_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    networks:
      - detective_network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  detective_network:
    driver: bridge
```

## Step 5: Deploy on Ubuntu Server

### On Your Ubuntu Server:

```bash
# 1. Install Docker and Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# 2. Add your user to docker group
sudo usermod -aG docker $USER
# Logout and login again

# 3. Create project directory
mkdir -p ~/detective-academy
cd ~/detective-academy

# 4. Create .env file
cat > .env << EOF
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://your-server-ip
SERVER_IP=your-server-ip
EOF

# 5. Download docker-compose.prod.yml
# Copy the content above or upload via scp

# 6. Create nginx config directory
mkdir -p nginx
# Copy your nginx.conf file

# 7. Pull and start services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# 8. Initialize database
docker-compose -f docker-compose.prod.yml exec postgres psql -U detective -d detective_academy -c "SELECT 1"

# 9. Check status
docker-compose -f docker-compose.prod.yml ps
```

## Step 6: Transfer Files to Ubuntu

From Windows, upload necessary files:

```powershell
# Using SCP (if you have OpenSSH)
scp docker-compose.prod.yml user@your-server-ip:~/detective-academy/
scp .env user@your-server-ip:~/detective-academy/
scp -r nginx user@your-server-ip:~/detective-academy/

# Or use WinSCP/FileZilla GUI
```

## Step 7: Verify Deployment

```bash
# Check running containers
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Test endpoints
curl http://localhost:4000/health
curl http://localhost:3000
```

## Step 8: Access from Browser

Open: `http://your-server-ip:3000`

## Troubleshooting

### Images not pulling?
```bash
# Login to Docker Hub on server
docker login

# Pull manually
docker pull yourusername/detective-academy-backend:latest
docker pull yourusername/detective-academy-frontend:latest
```

### Port conflicts?
```bash
# Check what's using ports
sudo netstat -tlnp | grep -E ':(80|443|3000|4000|5432|6379)'

# Stop conflicting services
sudo systemctl stop apache2  # If Apache is running
sudo systemctl stop nginx    # If nginx is already installed
```

### Database connection issues?
```bash
# Check database logs
docker-compose logs postgres

# Access database directly
docker-compose exec postgres psql -U detective -d detective_academy
```

## Update Deployment

When you make changes:

```powershell
# On Windows - rebuild and push
docker-compose build
docker tag detective_murder-backend:latest yourusername/detective-academy-backend:latest
docker push yourusername/detective-academy-backend:latest
```

```bash
# On Ubuntu - pull and restart
cd ~/detective-academy
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Security Checklist

- [ ] Change default passwords in .env
- [ ] Use strong JWT_SECRET
- [ ] Configure firewall (ufw)
- [ ] Set up SSL/HTTPS (Let's Encrypt)
- [ ] Restrict database access
- [ ] Enable Docker security features
- [ ] Regular backups
- [ ] Monitor logs

## Firewall Configuration

```bash
# Allow necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## SSL Setup (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

**Quick Summary:**
1. `docker login` on Windows
2. Tag images: `docker tag detective_murder-backend yourusername/detective-academy-backend:latest`
3. Push: `docker push yourusername/detective-academy-backend:latest`
4. On Ubuntu: Install Docker, create docker-compose.prod.yml, run `docker-compose up -d`
