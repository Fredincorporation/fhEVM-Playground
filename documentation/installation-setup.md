# Installation & Setup

Detailed setup instructions for Windows, macOS, Linux, and GitHub Codespaces.

## Option 1: GitHub Codespaces (Recommended - Zero-Install)

**Best for**: Beginners, trying out without installing anything locally

1. Open the [fhEVM Playground repository](https://github.com/Fredincorporation/fhEVM-Playground)
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for the container to build (2-3 minutes)
4. The guided CLI will start automatically
5. Follow the prompts to create your first example

**What's pre-installed**:
- Node.js v18+
- npm and Git
- All build tools
- VS Code in the browser

## Option 2: Windows

### Step 1: Install Node.js
1. Visit [nodejs.org](https://nodejs.org/) and download the **LTS version** (v20+)
2. Run the installer and follow the setup wizard
3. Accept the default installation path
4. Open **PowerShell** or **Command Prompt** and verify:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install the Scaffolder
```powershell
npm install -g create-fhevm-playground-pro
```

### Step 3: Create Your First Project
```powershell
create-fhevm-playground-pro create --name my-example --category basic-counter
cd my-example
npm install
npm test
```

## Option 3: macOS

### Step 1: Install Node.js

**Using Homebrew (Recommended)**:
```bash
brew install node
```

**Or download directly**:
1. Visit [nodejs.org](https://nodejs.org/) and download the **LTS version**
2. Run the installer

### Step 2: Verify Installation
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

### Step 3: Install the Scaffolder
```bash
npm install -g create-fhevm-playground-pro
```

### Step 4: Create Your First Project
```bash
create-fhevm-playground-pro create --name my-example --category basic-counter
cd my-example
npm install
npm test
```

## Option 4: Linux

### Step 1: Install Node.js

**Ubuntu/Debian**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Fedora/RHEL**:
```bash
sudo dnf install nodejs npm
```

**Arch Linux**:
```bash
sudo pacman -S nodejs npm
```

### Step 2: Verify Installation
```bash
node --version
npm --version
```

### Step 3: Install the Scaffolder
```bash
npm install -g create-fhevm-playground-pro
```

### Step 4: Create Your First Project
```bash
create-fhevm-playground-pro create --name my-example --category basic-counter
cd my-example
npm install
npm test
```

## Troubleshooting

### "Command not found: node"
- **Windows**: Restart PowerShell/Command Prompt after installing Node.js
- **macOS/Linux**: Verify the installation path is in your `$PATH`

### "npm: permission denied"
- On macOS/Linux, try: `sudo npm install -g create-fhevm-playground-pro`
- Or use a Node version manager like [nvm](https://github.com/nvm-sh/nvm)

### Installation taking too long
- The first `npm install` can take 2-5 minutes depending on your internet speed
- Be patient; it's downloading and compiling dependencies

### Tests failing after installation
- Ensure you have the latest npm: `npm install -g npm@latest`
- Try clearing the npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

## Next Steps

- [Getting Started](getting-started.md) — Full onboarding guide
- [Quick Start Guide](quick-start.md) — 30-second setup
- [Building Your First Contract](building-first-contract.md) — Understand the generated code
