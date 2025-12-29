# fhEVM Playground Pro - Complete Documentation

Welcome to the fhEVM Playground Pro documentation! This comprehensive guide will help you build, test, and deploy fully homomorphic encryption (FHE) applications using Zama's fhEVM framework.

## 📚 Documentation Sections

### **Getting Started** - New users start here
- [Quick Start Guide](getting-started/quick-start.md) - Get up and running in 5 minutes
- [Installation & Setup](getting-started/installation.md) - Detailed setup instructions
- [Your First Example](getting-started/first-example.md) - Build your first FHE contract
- [CLI Commands Reference](getting-started/cli-reference.md) - All available commands

### **Core Concepts** - Understand FHE fundamentals
- [FHE Fundamentals](concepts/fhe-fundamentals.md) - What is homomorphic encryption?
- [fhEVM Architecture](concepts/fhevm-architecture.md) - How the system works

### **Walkthroughs** - Step-by-step tutorials
- [Building Your First Contract](walkthroughs/building-first-contract.md) - Complete walkthrough
- [Testing with Mocked Mode](walkthroughs/testing-mocked-mode.md) - Local testing
- [Deploying to Testnet](walkthroughs/deploying-to-testnet.md) - Go live on testnet

### **24 Complete Examples**
Browse [24 pre-built examples](examples/README.md) from beginner to expert level.

### **Security & Best Practices**
- [Security Overview](security/security-overview.md) - Key security considerations
- [Common Vulnerabilities](security/vulnerabilities.md) - What to avoid

### **Deployment Guide**
- [Network Configuration](deployment/network-config.md) - Setup networks
- [Deployment Steps](deployment/testnet-deployment.md) - Sepolia & Evmos

### **Troubleshooting**
- [Common Issues](troubleshooting/common-issues.md) - Solutions to problems
- [FAQ](troubleshooting/faq.md) - Frequently asked questions

---

## 🚀 Quick Start (30 seconds)

```bash
npm install -g create-fhevm-playground-pro
create-fhevm-playground-pro create --name my-counter --category basic-counter
cd my-counter && npm install && npm run test:mock
```

**Result**: ✅ All tests passing!

---

**Next step**: [Quick Start Guide](getting-started/quick-start.md)
