# 🏃‍♂️ Self-Hosted GitHub Runner Setup

## Prerequisites

- Ubuntu/Linux machine
- Docker installed
- GitHub repository access

## Step 1: Create GitHub Runner

1. Go to your GitHub repository
2. Navigate to **Settings** → **Actions** → **Runners**
3. Click **New self-hosted runner**
4. Select **Linux** as the operating system
5. Copy the provided commands

## Step 2: Install Runner on Your Machine

```bash
# Create a folder for the runner
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner
./config.sh --url https://github.com/Mide69/IT-Asset-Inventory-app --token YOUR_TOKEN

# Install as a service (optional but recommended)
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start
```

## Step 3: Configure Docker Hub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

## Step 4: Test the Runner

```bash
# Check runner status
sudo ./svc.sh status

# View runner logs
sudo journalctl -u actions.runner.* -f
```

## Step 5: Verify CI Pipeline

1. Make a change to any file in `src/` or `frontend/`
2. Commit and push to GitHub
3. Check the **Actions** tab in your repository
4. The CI pipeline should trigger automatically

## Manual Trigger

You can also manually trigger the pipeline:
1. Go to **Actions** tab
2. Select **IT Asset Inventory CI Pipeline**
3. Click **Run workflow**
4. Choose environment and click **Run workflow**

## Troubleshooting

### Runner Not Starting
```bash
# Check runner logs
sudo journalctl -u actions.runner.* -f

# Restart runner service
sudo ./svc.sh stop
sudo ./svc.sh start
```

### Docker Permission Issues
```bash
# Add runner user to docker group
sudo usermod -aG docker $(whoami)
sudo systemctl restart docker
```

### Pipeline Failing
```bash
# Check if Docker Hub credentials are set
# Go to GitHub Settings → Secrets → Actions
# Verify DOCKER_USERNAME and DOCKER_PASSWORD are set

# Test Docker login locally
docker login
```

## Runner Management

```bash
# Stop runner
sudo ./svc.sh stop

# Start runner
sudo ./svc.sh start

# Uninstall runner
sudo ./svc.sh uninstall
./config.sh remove --token YOUR_REMOVAL_TOKEN
```