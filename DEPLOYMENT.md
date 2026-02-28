# VulAI Deployment Guide

This guide covers deploying VulAI to production environments.

## Deployment Options

### 1. Docker (Recommended for MVP)

#### Single Container Deployment

```bash
# Build image
docker build -t vulai-backend:latest backend/

# Run container
docker run -d \
  --name vulai-backend \
  -p 8000:8000 \
  -e BACKEND_HOST=0.0.0.0 \
  -e LLM_API_KEY=$LLM_API_KEY \
  -e LLM_MODEL=claude-opus-4-20250514 \
  -e DEBUG=false \
  vulai-backend:latest

# Verify
curl http://localhost:8000/health

# View logs
docker logs vulai-backend

# Stop
docker stop vulai-backend
docker rm vulai-backend
```

#### Docker Compose (Full Stack)

```bash
# Create .env file with credentials
cat > .env <<EOF
LLM_API_KEY=sk-your-api-key-here
BACKEND_PORT=8000
DEBUG=false
EOF

# Start stack
docker-compose up -d

# Verify
curl http://localhost:8000/docs

# Stop
docker-compose down
```

### 2. Cloud Platforms

#### AWS ECS (Elastic Container Service)

```bash
# Create ECR repository
aws ecr create-repository --repository-name vulai-backend

# Build and push image
docker build -t vulai-backend:latest backend/
docker tag vulai-backend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/vulai-backend:latest

aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/vulai-backend:latest

# Create ECS task definition and service (see AWS console or CloudFormation)
```

#### Google Cloud Run

```bash
# Build and push to Google Artifact Registry
gcloud builds submit --tag gcr.io/$PROJECT_ID/vulai-backend backend/

# Deploy
gcloud run deploy vulai-backend \
  --image gcr.io/$PROJECT_ID/vulai-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars LLM_API_KEY=$LLM_API_KEY,LLM_PROVIDER=anthropic
```

#### Heroku

```bash
# Login
heroku login

# Create app
heroku create vulai-backend

# Set config
heroku config:set LLM_API_KEY=$LLM_API_KEY -a vulai-backend

# Deploy
git push heroku main
```

### 3. Kubernetes

#### Create Deployment

```yaml
# vulai-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vulai-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vulai-backend
  template:
    metadata:
      labels:
        app: vulai-backend
    spec:
      containers:
      - name: vulai-backend
        image: vulai-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: BACKEND_HOST
          value: "0.0.0.0"
        - name: LLM_API_KEY
          valueFrom:
            secretKeyRef:
              name: vulai-secrets
              key: llm-api-key
        - name: LLM_MODEL
          value: "claude-opus-4-20250514"
        - name: DEBUG
          value: "false"
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: vulai-backend-service
spec:
  selector:
    app: vulai-backend
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

```bash
# Create secret
kubectl create secret generic vulai-secrets \
  --from-literal=llm-api-key=$LLM_API_KEY

# Deploy
kubectl apply -f vulai-deployment.yaml

# Check status
kubectl get pods
kubectl get svc

# View logs
kubectl logs deployment/vulai-backend -f
```

## Environment Configuration

### Production Environment Variables

```env
# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DEBUG=false

# LLM
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-...
LLM_MODEL=claude-opus-4-20250514

# Analysis
ANALYSIS_TIMEOUT=30
ENABLE_CACHING=true

# Logging
LOG_LEVEL=INFO
ENABLE_LOGGING=true
```

### Security Best Practices

1. **Never commit secrets** - Use environment variables or secret management
2. **Use HTTPS** - Enable SSL/TLS in production
3. **API Key rotation** - Rotate LLM API keys regularly
4. **Rate limiting** - Implement in reverse proxy
5. **Input validation** - Already built-in with Pydantic
6. **CORS configuration** - Restrict to known domains

## Monitoring & Logging

### Health Checks

```bash
# Check backend health
curl http://your-domain:8000/health

# Response
{
  "status": "ok",
  "service": "VulAI Backend",
  "version": "0.1.0"
}
```

### Logging

Logs are output to stdout (container logs).

```bash
# View logs
docker logs vulai-backend

# Or with Kubernetes
kubectl logs deployment/vulai-backend
```

### Metrics (Future)

Prometheus metrics endpoint planned:
```
http://localhost:8000/metrics
```

## Reverse Proxy Configuration

### Nginx

```nginx
upstream vulai_backend {
    server vulai-backend:8000;
}

server {
    listen 443 ssl;
    server_name api.vulai.dev;

    ssl_certificate /etc/ssl/certs/vulai.crt;
    ssl_certificate_key /etc/ssl/private/vulai.key;

    location / {
        proxy_pass http://vulai_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Traefik

```yaml
services:
  vulai-backend:
    image: vulai-backend:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.vulai.rule=Host(`api.vulai.dev`)"
      - "traefik.http.routers.vulai.entrypoints=websecure"
      - "traefik.http.routers.vulai.tls=true"
      - "traefik.http.services.vulai.loadbalancer.server.port=8000"
```

## Scaling Considerations

### Horizontal Scaling

Backend is stateless → scales horizontally with load balancer:

```
Load Balancer
├─ Instance 1
├─ Instance 2
└─ Instance 3
```

### Caching

For production, enable Redis caching:

```yaml
# docker-compose.yml with Redis
services:
  backend:
    environment:
      - ENABLE_CACHING=true
      - REDIS_URL=redis://redis:6379
  redis:
    image: redis:7-alpine
```

### Database (Future)

For persistent findings storage:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy VulAI Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/build-push-action@v4
        with:
          context: backend
          push: true
          tags: ${{ secrets.DOCKER_REPO }}/vulai-backend:latest
          env:
            LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
deploy:
  image: docker:latest
  script:
    - docker build -t vulai-backend backend/
    - docker push vulai-backend
  only:
    - main
```

## Post-Deployment Checklist

- [ ] Health check passing: `curl https://api.vulai.dev/health`
- [ ] API docs accessible: `https://api.vulai.dev/docs`
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] Logging enabled and monitored
- [ ] Secrets properly managed
- [ ] Monitoring/alerts set up
- [ ] Backup strategy defined
- [ ] Load balancer configured
- [ ] Auto-scaling rules set

## Troubleshooting

### Container won't start
```bash
docker logs vulai-backend
# Check BACKEND_HOST=0.0.0.0 is set
```

### High latency
```bash
# Check LLM API timeout
curl -w "@curl-format.txt" -o /dev/null -s http://api.vulai.dev/api/analyze
# Increase ANALYSIS_TIMEOUT if needed
```

### Out of memory
```bash
# Scale horizontally with load balancer
# Or increase memory allocation
```

## Support

For production issues:
- Check logs: `docker logs` or `kubectl logs`
- Health check: `/health` endpoint
- API docs: `/docs` endpoint
- GitHub Issues: Bug reports and feature requests

---

**Deployment Version:** 0.1.0
**Last Updated:** 2025-02-26
