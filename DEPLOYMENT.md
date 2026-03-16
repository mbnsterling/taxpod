# Deployment Guide

This guide covers the one-time droplet setup, environment variable management, SSL certificate issuance, and how CI/CD deploys the TaxPod app automatically on every push to `main`.

---

## Architecture overview

```
GitHub repo (push to main)
  └─► GitHub Actions CI (lint + typecheck + build + Docker image push)
        └─► GitHub Actions Deploy (SSH into droplet)
              └─► docker compose pull + up -d
                    ├─ app         (Next.js, port 3000, internal only; image from GHCR)
                    ├─ nginx       (ports 80/443, reverse proxy + SSL termination)
                    └─ certbot     (Let's Encrypt certificate issuance/renewal)
```

---

## 1. GitHub Secrets required

Add the following secrets to your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret name          | Value                                                 |
|----------------------|-------------------------------------------------------|
| `DO_SSH_HOST`        | Droplet public IP address                             |
| `DO_SSH_USER`        | SSH user on droplet (e.g. `root` or `deploy`)         |
| `DO_SSH_PRIVATE_KEY` | Private SSH key that can authenticate to the droplet  |
| `GHCR_READ_TOKEN`    | GitHub PAT with `read:packages` for `mbnsterling`     |

No production application secrets (database URL, SMTP passwords, etc.) are stored in GitHub. They live only on the droplet.

---

## 2. One-time droplet bootstrap

Run these commands once on your DigitalOcean droplet.

### 2a. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
# Add your user to the docker group if not running as root
usermod -aG docker $USER
```

### 2b. Clone the repository

```bash
mkdir -p /var/www
git clone https://github.com/mbnsterling/taxpod.git /var/www/taxpod
cd /var/www/taxpod
```

### 2c. Add the deploy SSH public key

On your local machine, generate a key pair for GitHub Actions (or reuse an existing one):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/taxpod_deploy
```

Copy the **public** key (`~/.ssh/taxpod_deploy.pub`) to the droplet:

```bash
# On the droplet
echo "<public-key-contents>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Store the **private** key (`~/.ssh/taxpod_deploy`) as the `DO_SSH_PRIVATE_KEY` GitHub secret.

### 2d. Create the production environment file

```bash
cp /var/www/taxpod/.env /var/www/taxpod/.env.production
nano /var/www/taxpod/.env.production
```

Set every variable to its **production** value. At minimum:

```dotenv
# Authentication
AUTH_SECRET="<generate with: npx auth secret>"
AUTH_GOOGLE_ID="<prod google client id>"
AUTH_GOOGLE_SECRET="<prod google client secret>"

# Database
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/taxpod"

# SMTP
SMTP_HOST=<prod smtp host>
SMTP_PORT=587
SMTP_USER=<prod smtp user>
SMTP_PASS=<prod smtp password>
SMTP_FROM="no-reply@taxpod.ng"

# App URL
NEXT_PUBLIC_APP_URL=https://taxpod.ng

NODE_ENV=production
```

This file is referenced by the `app` service via `env_file: .env.production` in `docker-compose.yml`. It is listed in `.gitignore` and `.dockerignore` and is never committed.

### 2e. Create data directories for Certbot and Nginx

```bash
mkdir -p /var/www/taxpod/data/certbot/conf
mkdir -p /var/www/taxpod/data/certbot/www
```

### 2f. Generate temporary self‑signed certificates (first‑time only)

Nginx is configured to look for certificates at:

- `/etc/letsencrypt/live/taxpod.ng/fullchain.pem`
- `/etc/letsencrypt/live/taxpod.ng/privkey.pem`

These paths are mounted from the host via:

- `/var/www/taxpod/data/certbot/conf:/etc/letsencrypt`

Before the first real Let’s Encrypt certificate is issued, generate a short‑lived self‑signed certificate so that Nginx can start cleanly on the very first deploy:

```bash
mkdir -p /var/www/taxpod/data/certbot/conf/live/taxpod.ng

openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout /var/www/taxpod/data/certbot/conf/live/taxpod.ng/privkey.pem \
  -out /var/www/taxpod/data/certbot/conf/live/taxpod.ng/fullchain.pem \
  -subj "/CN=taxpod.ng"
```

This certificate is **only for bootstrapping**; it will be replaced by a real Let’s Encrypt certificate in the next step.

### 2g. Obtain the first real SSL certificate

```bash
docker compose run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d taxpod.ng \
  -d www.taxpod.ng \
  --email admin@taxpod.ng \
  --agree-tos \
  --no-eff-email

docker compose exec nginx nginx -s reload
```

### 2h. First full stack start

```bash
cd /var/www/taxpod
docker compose up -d --build
```

---

## 3. Certificate renewal (automated)

Add a cron job on the droplet to renew certificates daily and reload Nginx:

```bash
crontab -e
```

Add this line:

```cron
0 3 * * * docker compose -f /var/www/taxpod/docker-compose.yml run --rm certbot renew --quiet && docker compose -f /var/www/taxpod/docker-compose.yml exec nginx nginx -s reload
```

---

## 4. How CI/CD works (automatic on push to main)

1. **CI job** runs on every push and pull request:
   - Installs npm dependencies
   - Runs `npm run lint`
   - Runs `npm run typecheck`
   - Runs `SKIP_ENV_VALIDATION=1 npm run build` to verify the build succeeds
   - Logs in to GitHub Container Registry (`ghcr.io`)
   - Builds the Docker image using the repo `Dockerfile` and tags it as `ghcr.io/mbnsterling/taxpod:latest`
   - Pushes the image to GHCR

2. **Deploy job** runs only on pushes to `main` after CI passes:
   - SSHes into the droplet using `DO_SSH_PRIVATE_KEY`
   - Logs in to GHCR on the droplet using `GHCR_READ_TOKEN`
   - Runs `docker compose pull` so the droplet fetches the latest `ghcr.io/mbnsterling/taxpod:latest` image and updated nginx/certbot images
   - Runs Prisma migrations inside the app container using production env: `docker compose run --rm app node node_modules/.bin/prisma migrate deploy`
   - Runs `docker compose up -d --remove-orphans` to restart updated containers
   - Prunes dangling images to free disk space

---

## 5. Managing environment variables

| Variable scope                            | Where to manage                                  |
|-------------------------------------------|--------------------------------------------------|
| Production app secrets (DB, SMTP, auth)   | `/var/www/taxpod/.env.production` on droplet      |
| Deployment access (SSH host/user/key)     | GitHub Secrets (`DO_SSH_HOST`, `DO_SSH_USER`, `DO_SSH_PRIVATE_KEY`) |
| Local development                         | `.env` in repo root (never committed in full, template only) |

- The `.env.production` file is **never committed** to git (listed in `.gitignore` and `.dockerignore`).
- To rotate a secret, edit `.env.production` on the droplet and restart the app container: `docker compose up -d app`.
- The Docker build does **not** receive any production secrets; all secrets are injected at runtime via `env_file`.

---

## 6. Useful commands on the droplet

```bash
# View running containers
docker compose ps

# Tail app logs
docker compose logs -f app

# Restart only the app
docker compose up -d app

# Stop everything
docker compose down
```
