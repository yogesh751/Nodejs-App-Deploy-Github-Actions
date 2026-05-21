# 🚀 Express.js App Deployment with GitHub Actions & Docker on AWS EC2

A beginner-friendly CI/CD project that demonstrates how to automatically deploy an **Express.js application** to an **AWS EC2 instance** using **GitHub Actions**, **Docker**, and **Docker Compose** — triggered on every push to the `main` branch.

---

## 📌 Project Overview

This project sets up a complete automated deployment pipeline:
1. Code is pushed to the `main` branch on GitHub
2. GitHub Actions workflow is triggered automatically
3. Workflow SSHs into the EC2 instance
4. Pulls the latest code from GitHub
5. Builds and runs the Docker container using Docker Compose

---

## Architecture

```
Developer (Local Machine)
        │
        │  git push
        ▼
  GitHub Repository
        │
        │  Triggers on push to main
        ▼
  GitHub Actions Workflow
        │
        │  SSH into EC2
        ▼
  AWS EC2 (Ubuntu)
        │
        │  git pull + docker compose up --build -d
        ▼
  Docker Container (Express.js App running on port 8080)
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| **Node.js 22** | JavaScript runtime |
| **Express.js v5** | Web framework for the REST API |
| **Docker** | Containerizing the application |
| **Docker Compose** | Managing container configuration |
| **GitHub Actions** | CI/CD automation pipeline |
| **AWS EC2 (Ubuntu)** | Cloud server for hosting |
| **SSH** | Secure remote connection to EC2 |

---

## 📁 Project Structure

```
Nodejs-App-Deploy-Github-Actions/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD workflow
├── index.js                  # Main Express.js application
├── package.json              # Project dependencies & scripts
├── Dockerfile                # Docker image instructions
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```

---

## 📝 Application Code

**`index.js`**
```js
import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 8080

app.get('/', (req, res) => {
    return res.json({ msg: 'Hello from the Server V1 after applying github actions...' })
})

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`)
})
```

The app exposes a single `GET /` endpoint that returns a JSON response. It uses **ES Modules** (`import` syntax) and reads the port from the environment variable `PORT`, defaulting to `8080`.

---

## 🐳 Docker Setup

**`Dockerfile`**
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node","index"]
```

**`docker-compose.yml`**
```yaml
services:
  app:
    build:
      context: .
    restart: unless-stopped
    ports:
      - "8080:8080"
```

- `node:22-alpine` keeps the image lightweight
- `restart: unless-stopped` ensures the container auto-restarts on EC2 reboot
- Port `8080` is mapped from container to host

---

## ⚙️ GitHub Actions Workflow

**`.github/workflows/deploy.yml`**
```yaml
name: deploy NodeJS Application to EC2 instance.

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_KEY }}
          script: |
            set -e
            cd /home/ubuntu/Nodejs-App-Deploy-Github-Actions
            git pull
            docker compose up -d --build
```

---

## 🔐 GitHub Secrets Configuration

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Description |
|---|---|
| `SSH_HOST` | Public IP address of your EC2 instance |
| `SSH_KEY` | Private key content of your EC2 key pair (`.pem` file) |

> ⚠️ Secrets are **never exposed** to forked repositories. They are safe to keep as long as the project is active.

---

## 🖥️ EC2 Setup Steps

### 1. Install Docker on EC2
```bash
sudo apt update
sudo apt install docker-compose -y
sudo usermod -aG docker ubuntu
newgrp docker
```

### 2. Clone the Repository
```bash
git clone https://github.com/yogesh751/Nodejs-App-Deploy-Github-Actions.git
cd Nodejs-App-Deploy-Github-Actions
```

### 3. Allow Port 8080 in EC2 Security Group
Go to **AWS Console** → **EC2** → **Security Groups** → Add **Inbound Rule**:
- Type: Custom TCP
- Port: `8080`
- Source: `0.0.0.0/0`

---

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/yogesh751/Nodejs-App-Deploy-Github-Actions.git
cd Nodejs-App-Deploy-Github-Actions

# Run with Docker Compose
docker compose up --build
```

App will be available at: `http://localhost:8080`

Expected response:
```json
{ "msg": "Hello from the Server V1 after applying github actions..." }
```

---

## 📦 Package Info

```json
{
  "name": "nodejs-app-deploy-github-actions",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^5.2.1"
  }
}
```

- Uses **ES Module** syntax (`"type": "module"`)
- **Express v5** — the latest major version

---

## 📚 What I Learned

- Containerizing an Express.js app using Docker & Docker Compose
- Setting up a CI/CD pipeline from scratch with GitHub Actions
- Deploying to AWS EC2 and managing a cloud Ubuntu server
- Storing sensitive credentials securely using GitHub Secrets
- Automating deployments triggered on every `git push` to `main`

---

## 👤 Author

**Yogesh Saidani**
- GitHub: https://github.com/yogesh751

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
