# 🎯 fhEVM Playground Pro - Quick Reference Guide

## 📁 Project Structure

```
fhEVM Playground/
├── index.html          # Main landing page (update links here)
├── styles.css          # Styling & responsive design (change colors here)
├── script.js           # Interactivity & data (add/edit examples here)
├── README.md           # Complete documentation
├── DEPLOYMENT.md       # GitHub Pages setup guide
├── _config.yml         # GitHub Pages config
└── .gitignore          # Git exclusions
```

---

## 🎨 Colors Reference

Located in `styles.css` at the top (`:root` section):

```css
--color-navy: #0A1D37;           /* Dark backgrounds */
--color-navy-light: #0F2A4D;     /* Lighter navy for cards */
--color-purple: #4B2E83;         /* Accents & gradients */
--color-teal: #00D1FF;           /* Primary accent */
--color-teal-dark: #00AEEF;      /* Hover state */
--color-white: #FFFFFF;          /* Text & foreground */
--color-gray-light: #E0E0E0;     /* Secondary text */
--color-gray-mid: #333333;       /* Tertiary text */
--color-charcoal: #121212;       /* Main background */
```

To change entire theme: Edit these 9 color values only.

---

## 📝 Content Sections Map

### index.html Quick Links

| Section | Find By | Update |
|---------|---------|--------|
| Navigation | `<nav class="navbar">` | Update `.nav-menu` links |
| Hero | `<section class="hero">` | Title, tagline, buttons |
| Quick Start | `<section class="quick-start">` | Feature descriptions |
| Categories | `<section class="categories">` | Filter buttons (data from script.js) |
| Features | `<section class="why-pro">` | Bullet points & descriptions |
| Demo Video | `<section class="demo">` | YouTube iframe src |
| Footer | `<footer class="footer">` | Links & credit |

### script.js Quick Links

| Task | Location | How To |
|------|----------|--------|
| Add example | `examplesData = [...]` | Add new object to array |
| Change category | `category: 'mandatory'` | Use 'mandatory' or 'bonus' |
| Update filter logic | `filterCategories()` | Modify filter conditions |
| Search behavior | `setupSearch()` | Update search fields |
| Modal content | `openCliModal()` | Edit modal HTML structure |

### styles.css Quick Links

| Element | Class | Location |
|---------|-------|----------|
| Navbar | `.navbar` | ~Line 200 |
| Hero section | `.hero` | ~Line 280 |
| Buttons | `.btn-*` | ~Line 400 |
| Cards | `.category-card` | ~Line 700 |
| Footer | `.footer` | ~Line 1050 |
| Mobile | `@media` | ~Line 1200+ |

---

## 🔄 Common Customizations

### Add a New Example

In `script.js`, add to `examplesData` array:

```javascript
{
    id: 'unique-id',
    name: 'Example Name',
    category: 'mandatory',  // or 'bonus'
    complexity: 'beginner', // beginner|intermediate|advanced|pro
    description: 'One-line card description',
    details: 'Longer explanation for modal',
    repo: 'https://github.com/org/repo',
    tags: ['Tag1', 'Tag2', 'Tag3']
}
```

### Change Primary Color

In `styles.css`, find `:root` and change:

```css
--color-teal: #00D1FF;       /* Change this value */
--color-teal-dark: #00AEEF;  /* And this for hover */
```

Then entire site updates automatically.

### Update Navigation

In `index.html`, modify `.nav-menu`:

```html
<li><a href="#section-id" class="nav-link">Link Text</a></li>
```

Must match a `<section id="section-id">`.

### Change Hero Title

In `index.html`, find `.hero-title`:

```html
<h1 class="hero-title">Your New Title</h1>
```

### Update Footer Links

In `index.html`, find `.footer-content`:

```html
<li><a href="https://new-link.com" target="_blank">Link Text</a></li>
```

### Replace Demo Video

In `index.html`, find YouTube iframe:

```html
<iframe src="https://www.youtube.com/embed/PASTE_VIDEO_ID_HERE"></iframe>
```

Get ID from: `https://youtube.com/watch?v=PASTE_VIDEO_ID_HERE`

---

## 🎯 Browser DevTools Shortcuts

### Test Search
```javascript
// In browser console (F12)
document.getElementById('searchInput').value = 'voting';
document.getElementById('searchInput').dispatchEvent(new Event('input'));
```

### Toggle Dark Mode (future)
```javascript
document.body.style.filter = 'invert(1)';
```

### Test Mobile Width
```javascript
// In console
document.body.style.maxWidth = '375px';
document.body.style.margin = '0 auto';
```

### Check Performance
```javascript
// In console
performance.timing.loadEventEnd - performance.timing.navigationStart
// Returns page load time in ms
```

---

## 📊 Data Structure Reference

### Example Object Properties

```javascript
{
    id: string,              // Unique identifier (used in URLs)
    name: string,            // Display name
    category: string,        // 'mandatory' or 'bonus'
    complexity: string,      // 'beginner'|'intermediate'|'advanced'|'pro'
    description: string,     // Short (one line for card)
    details: string,         // Long (for modal/expansion)
    repo: string,            // GitHub repository URL
    tags: string[]           // Array of keyword tags
}
```

### Filter States

```javascript
// Active filter in DOM:
document.querySelector('.filter-tab.active')
// Returns active filter button

// Current search term:
document.getElementById('searchInput').value
// Returns search input text
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Submit search / Select option |
| Escape | Close modal |
| Space | Toggle button/checkbox |
| Tab | Navigate through elements |
| Ctrl+K | Focus search (custom - can add) |
| Page Up/Down | Scroll page |
| Home/End | Go to top/bottom |

---

## 🔍 CSS Class Naming Convention

All classes follow pattern: `block__element--modifier`

```css
.category-card           /* Block - main component */
.category-card h3        /* Element - part of block */
.category-card:hover     /* Modifier - state change */
.category-tag            /* Sub-block - nested component */
.tag-pro                 /* Modifier - variant */
```

This makes styling predictable and maintainable.

---

## 🚀 Performance Checklist

- [x] CSS custom properties (no repeated values)
- [x] GPU acceleration (using transform, opacity)
- [x] Smooth scroll (CSS scroll-behavior)
- [x] Responsive images (will load as needed)
- [x] Font loading (Google Fonts CDN)
- [x] No render-blocking resources
- [x] Accessibility features (ARIA, semantic HTML)
- [ ] Image optimization (add if using images)
- [ ] Service worker (optional, for offline)
- [ ] Code minification (for production)

---

## 🐛 Quick Debugging Tips

### Nothing showing up?
1. Check browser console (F12 → Console)
2. Verify file paths are correct
3. Clear browser cache (Ctrl+Shift+Delete)

### Styles not applying?
1. Check `.css` file is linked in `<head>`
2. Verify CSS class names match HTML
3. Check for typos in `class="..."`

### JavaScript errors?
1. Open F12 → Console tab
2. Look for red error messages
3. Check `script.js` line numbers in error

### Search not working?
1. Verify `script.js` loaded (F12 → Sources)
2. Test in browser console: `examplesData.length`
3. Check search input has `id="searchInput"`

### Mobile looking wrong?
1. Open F12 → Device Toolbar
2. Test different screen widths
3. Check `@media` queries in CSS (line 1200+)

---

## 📚 External Resources

- **HTML Docs**: https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS Reference**: https://developer.mozilla.org/en-US/docs/Web/CSS
- **JavaScript Guide**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Git Guide**: https://git-scm.com/book/en/v2
- **GitHub Pages**: https://docs.github.com/en/pages

---

## ✅ Pre-Launch Checklist

- [ ] All links updated and tested
- [ ] YouTube video ID updated
- [ ] No console errors (F12)
- [ ] Mobile responsive tested
- [ ] Search/filter working
- [ ] Modal opens/closes smoothly
- [ ] Copy buttons working
- [ ] Footer links correct
- [ ] Zama branding consistent
- [ ] Ready for GitHub Pages

---

## 🎉 You're Ready!

Your landing site is production-ready. Follow `DEPLOYMENT.md` to go live.

**Questions?** Check README.md for full documentation.

**Need examples?** Visit: https://github.com/zama-ai/fhevm-examples

---

**Version**: 1.0.0 | Last Updated: December 22, 2025
