# 🚀 fhEVM Playground Pro - Deployment & Setup Guide

## Quick Deploy Checklist

- [ ] All HTML/CSS/JS files created
- [ ] Tested locally in browser
- [ ] Updated example repository links
- [ ] Updated YouTube video embed link
- [ ] Customized bounty/community links
- [ ] GitHub repository created/configured
- [ ] GitHub Pages enabled in settings
- [ ] Domain configured (optional)
- [ ] Final testing on live URL

---

## 📖 Detailed Deployment Steps

### Step 1: Local Testing

Before deploying, test the site locally:

```bash
# Clone or download the files to your local machine
cd "fhEVM Playground"

# Start a local server (choose one)

# Python 3 (recommended)
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (install via: npm install -g http-server)
http-server

# PHP
php -S localhost:8000
```

Then open: **http://localhost:8000** in your browser

**Test Checklist:**
- [ ] All sections load properly
- [ ] Navigation links work (smooth scroll)
- [ ] Search filters examples correctly
- [ ] Filter tabs switch between All/Core/Innovative
- [ ] "Run CLI Now" button opens modal
- [ ] Copy buttons work (test with clipboard paste)
- [ ] "View Repo" links open in new tabs
- [ ] Mobile responsiveness (test at 375px, 768px, 1200px)
- [ ] Animations smooth and not jerky
- [ ] No console errors (F12 → Console)

---

### Step 2: Create GitHub Repository

1. **Go to github.com** and log in
2. **Click "+" → "New repository"**
3. **Configure:**
   - Repository name: `fhevm-playground` (or similar)
   - Description: "fhEVM Playground Pro - Premium hub for confidential smart contracts"
   - Visibility: **Public**
   - Initialize with: None (we'll push existing files)
4. **Click "Create repository"**

---

### Step 3: Push Files to GitHub

```bash
# Navigate to project directory
cd "/path/to/fhEVM Playground"

# Initialize git (if not already)
git init

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/fhevm-playground.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: fhEVM Playground Pro landing site"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 4: Enable GitHub Pages

1. **Go to your GitHub repository**
2. **Settings → Pages** (left sidebar)
3. **Under "Build and deployment":**
   - Source: Select **"Deploy from a branch"**
   - Branch: Select **"main"** (or your branch)
   - Folder: **"/ (root)"**
4. **Click "Save"**
5. **Wait 1-2 minutes** for deployment
6. **Visit:** `https://YOUR_USERNAME.github.io/fhevm-playground`

---

### Step 5: Custom Domain (Optional)

If you own a domain:

1. **In GitHub repository Settings → Pages**
2. **Add custom domain** (e.g., `fhevm-playground.com`)
3. **Point your domain DNS** to GitHub's IP addresses:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   Or use `USERNAME.github.io` as CNAME

---

## 🔧 Customization Before Deploy

### 1. Update Example Repository Links

In `script.js`, update the `repo` URLs in `examplesData`:

```javascript
repo: 'https://github.com/YOUR_ORG/fhevm-examples/tree/main/examples/example-name'
```

### 2. Update YouTube Video

In `index.html`, replace:

```html
<!-- BEFORE -->
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>

<!-- AFTER -->
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"></iframe>
```

### 3. Update Community Links

In `index.html` and `script.js`, update:

- GitHub organization links
- Zama official links (already correct to zama.ai)
- Discord/Twitter handles
- Documentation URLs

### 4. Update Bounty Information

In `index.html` footer, update:

```html
<li><a href="https://your-bounty-post-url" target="_blank">Bounty Track Details</a></li>
```

---

## 📊 Site Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- Add before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🔍 SEO Optimization

The site includes basic SEO:

- ✅ Meta description
- ✅ Semantic HTML5
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Alt text for images (emoji descriptions)

**Optional additions:**

1. **Add robots.txt** (for crawlers):

```
# robots.txt
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

2. **Add CNAME** (for custom domain):

```
# CNAME file (no extension)
your-custom-domain.com
```

---

## 🚨 Troubleshooting

### Site not showing after 5 minutes

1. Check GitHub Pages settings are correct
2. Verify files are in root directory
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check Actions tab for deployment logs

### Styles not loading

1. Check that the `styles/` directory exists and that `index.html` references the split files (or concatenate them before deploy).
2. Verify file paths use relative paths (not absolute)
3. Clear browser cache

### Search/Filter not working

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `script.js` is loading
4. Test in incognito mode

### Images/Videos not loading

1. Verify links are absolute (use https://)
2. Check YouTube video ID is correct
3. Test links in separate browser tab

---

## 📈 Performance Tips

1. **Minify CSS/JS** (for production):
   ```bash
   # Concatenate split CSS files (keeps cascade order by filename) and minify
   cat styles/*.css > styles.css
   npm install -g cssnano terser
   cssnano styles.css > styles.min.css
   terser script.js > script.min.js
   ```

2. **Use CDN for fonts** (already done with Google Fonts)

3. **Lazy load heavy content**:
   - YouTube iframe loads on-demand
   - Images load asynchronously

4. **Compress assets** (if adding images later):
   ```bash
   # PNG compression
   pngquant image.png --ext .png --force
   ```

---

## 🔐 Security Considerations

- ✅ No sensitive data in code
- ✅ All external links use HTTPS
- ✅ No API keys or secrets
- ✅ External resources from trusted CDNs (Google Fonts, YouTube)

---

## 📱 Mobile Testing Checklist

Test on multiple devices:

- [ ] iPhone (375px width)
- [ ] iPad (768px width)
- [ ] Desktop (1200px+)

Use Chrome DevTools (F12 → Toggle Device Toolbar):
- Test portrait and landscape
- Test on 4G throttling
- Test with touch simulation

---

## 🎬 Post-Launch Tasks

1. **Share on social media** with link
2. **Update GitHub repo description** with link
3. **Add site link to GitHub organization** bio
4. **Monitor traffic** with analytics
5. **Gather feedback** from community
6. **Update examples** as new content ready

---

## 📞 Need Help?

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Zama Documentation**: https://docs.zama.ai/fhevm
- **HTML/CSS/JS References**: https://mdn.mozilla.org

---

**Good luck with your launch! 🚀**

For questions about fhEVM examples, visit: https://github.com/zama-ai/fhevm-examples
