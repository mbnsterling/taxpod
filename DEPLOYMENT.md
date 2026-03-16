# Deployment Guide

This guide covers the one-time droplet setup, environment variable management, SSL certificate issuance, and how CI/CD deploys the TaxPod app automatically on every push to `main`.

---

## Architecture overview

```
GitHub repo (push to main)
  └─► GitHub Actions CI/Deploy
        ├─ Builds Docker image → pushed to GHCR (ghcr.io/mbnsterling/taxpod)
        │    Tags: :latest and :<git-sha>
        ├─ Verifies the image exists in GHCR
        └─ SSHes into droplet
              ├─ docker login ghcr.io (using GHCR_READ_TOKEN)
              ├─ docker compose stop app (frees memory before pull)
              ├─ docker pull ghcr.io/mbnsterling/taxpod:latest
              ├─ Prisma migrations (temporary container, abort on failure)
              ├─ docker compose up -d --remove-orphans
              ├─ Container status + log snapshot
              ├─ HTTP health check → https://taxpod.ng/api/health (12 × 10s retries)
              └─ docker image prune -f
```

---

## 1. GitHub Secrets required

Add the following secrets to your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret name          | Value                                                                   |
|----------------------|-------------------------------------------------------------------------|
| `DO_SSH_HOST`        | Droplet public IP address                                               |
| `DO_SSH_USER`        | SSH user on droplet (e.g. `root` or `deploy`)                           |
| `DO_SSH_PRIVATE_KEY` | Private SSH key that can authenticate to the droplet                    |
| ~~`GHCR_READ_TOKEN`~~| No longer needed — `GITHUB_TOKEN` is reused for server-side image pull |
| `NEXT_PUBLIC_APP_URL`| Production app URL baked into the Docker image at build time            |

No production application secrets (database URL, SMTP passwords, etc.) are stored in GitHub. They live only on the droplet in `.env.production`.

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

### 2f. Generate temporary self-signed certificates (first-time only)

Nginx is configured to look for certificates at:

- `/etc/letsencrypt/live/taxpod.ng/fullchain.pem`
- `/etc/letsencrypt/live/taxpod.ng/privkey.pem`

These paths are mounted from the host via:

- `/var/www/taxpod/data/certbot/conf:/etc/letsencrypt`

Before the first real Let's Encrypt certificate is issued, generate a short-lived self-signed certificate so that Nginx can start cleanly on the very first deploy:

```bash
mkdir -p /var/www/taxpod/data/certbot/conf/live/taxpod.ng

openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout /var/www/taxpod/data/certbot/conf/live/taxpod.ng/privkey.pem \
  -out /var/www/taxpod/data/certbot/conf/live/taxpod.ng/fullchain.pem \
  -subj "/CN=taxpod.ng"
```

This certificate is **only for bootstrapping**; it will be replaced by a real Let's Encrypt certificate in the next step.

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

Every push to `main` triggers the `CI / Deploy` workflow, which runs as a single `build_and_deploy` job:

1. **Checkout** — checks out the source at the commit SHA.

2. **Buildx setup** — enables multi-platform builds and GitHub Actions layer cache (`cache-from/cache-to type=gha`) for faster subsequent builds.

3. **GHCR login** — logs in using `GITHUB_TOKEN` (auto-scoped `write:packages`).

4. **Build and push image** — builds for `linux/amd64` and pushes two tags:
   - `ghcr.io/mbnsterling/taxpod:latest`
   - `ghcr.io/mbnsterling/taxpod:<git-sha>`
   
   The SHA tag enables rollbacks (see section 6).

5. **Image verification** — runs `docker buildx imagetools inspect` on the `:latest` tag. If the image cannot be found, the job fails immediately before attempting any server interaction.

6. **Deploy via SSH** — SSHes into the droplet using `DO_SSH_PRIVATE_KEY` and executes the deployment script:
   - Logs into GHCR using the workflow's `GITHUB_TOKEN` (valid for the duration of the run)
   - Stops the `app` container to free memory
   - Prunes stopped containers and dangling images
   - Pulls `ghcr.io/mbnsterling/taxpod:latest`
   - Runs Prisma migrations via `docker compose run --rm app node_modules/prisma/build/index.js migrate deploy`
     - The runner image is distroless (entrypoint = `node`, no shell); the JS entry point is targeted directly
     - If migrations fail, deployment is aborted before the app is restarted
   - Starts the updated stack: `docker compose up -d --remove-orphans`
   - Prints container status and the last 20 log lines
   - Waits up to 2 minutes (12 × 10s retries) for `https://taxpod.ng/api/health` to return HTTP 200
     - On failure, prints the last 50 app log lines and exits non-zero
   - Prunes dangling images

7. **Summary** — prints the deployment summary with the commit SHA for reference.

---

## 5. Managing environment variables

| Variable scope                            | Where to manage                                                        |
|-------------------------------------------|------------------------------------------------------------------------|
| Production app secrets (DB, SMTP, auth)   | `/var/www/taxpod/.env.production` on droplet                           |
| Deployment access (SSH host/user/key)     | GitHub Secrets (`DO_SSH_HOST`, `DO_SSH_USER`, `DO_SSH_PRIVATE_KEY`)    |
| Registry read access on droplet           | Reuses `GITHUB_TOKEN` from the workflow run — no additional secret needed |
| Build-time public vars                    | GitHub Secrets (`NEXT_PUBLIC_APP_URL`) — injected as Docker build args |
| Local development                         | `.env` in repo root (template only, never committed with real values)  |

- The `.env.production` file is **never committed** to git (listed in `.gitignore` and `.dockerignore`).
- To rotate a secret, edit `.env.production` on the droplet and restart the app container: `docker compose up -d app`.
- The Docker image contains **no production secrets**; all secrets are injected at runtime via `env_file`.

---

## 6. Rolling back a deployment

Because every push tags the image with its git SHA, rolling back is straightforward:

```bash
# On the droplet — replace <sha> with the commit SHA of the last known-good deploy
ssh user@droplet
cd /var/www/taxpod

# Pull the old image by SHA
docker pull ghcr.io/mbnsterling/taxpod:<sha>

# Update the running container to use the old image
docker compose stop app
docker run --rm --env-file .env.production ghcr.io/mbnsterling/taxpod:<sha> \
  node_modules/prisma/build/index.js migrate deploy || true
IMAGE=ghcr.io/mbnsterling/taxpod:<sha> docker compose up -d app
```

> Note: if the rollback SHA predates a migration, you will need to manually revert the database schema before running the old image.

---

## 7. Health check endpoint

The app exposes `GET /api/health` which:
- Runs `SELECT 1` against the database.
- Returns `200 { "status": "ok", "db": "connected" }` on success.
- Returns `503 { "status": "error", "db": "unreachable" }` if the DB is not reachable.

This endpoint is used by the CI/CD health check loop and can also be used by external uptime monitors.

---

## 8. Useful commands on the droplet

```bash
# View running containers
docker compose ps

# Tail app logs
docker compose logs -f app

# Restart only the app
docker compose up -d app

# Run a manual health check
curl -s https://taxpod.ng/api/health | jq

# Stop everything
docker compose down
```
