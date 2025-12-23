# fhEVM Playground Pro - Landing Website

A premium, enterprise-ready landing page for "fhEVM Playground Pro" – the complete hub of automated, standalone Hardhat-based fhEVM examples for Zama's December 2025 Bounty Track.

## 🎯 Overview

This is a **fully responsive, single-page website** featuring:

- **Hero Section** with animated gradient background and call-to-action buttons
- **Quick Start Module** with CLI automation highlights
- **Interactive Categories Browser** with searchable/filterable example cards
- **Why Pro Section** showcasing key features and competitive advantages
- **Demo Video** embedded player section
- **Professional Footer** with community links

## 🎨 Design Features

### Color Palette (Zama Official Brand)
- **Primary Navy**: #0A1D37 (trust, encryption depth)
- **Accent Teal/Cyan**: #00D1FF (innovation, FHE clarity)
- **Purple Gradient**: #4B2E83 to #00D1FF (encrypted → transparent)
- **Text**: #FFFFFF (white) on dark backgrounds

### Typography
- **Display Headings**: Space Grotesk (modern, crypto-aesthetic)
- **Body Text**: Inter (clean, highly readable)
- **Code Blocks**: JetBrains Mono (professional monospace)

### Interactive Elements
- Smooth fade-in/slide animations
- Hover scale effects on cards
- Modal dialog for CLI quick start
- Search/filter functionality with real-time results
- Scroll-triggered animations
- Accessible keyboard navigation (Escape to close modals)

## 📁 File Structure

```
fhEVM Playground/
├── index.html          # Main HTML structure
├── styles/             # Split CSS files (see README.css-sections.md)
├── script.js           # JavaScript interactivity & data
└── README.md           # This file
```

## 🚀 Quick Start

### Local Development

1. **Clone or download** this repository
2. **Open in a local server** (required for full functionality):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Navigate to** `http://localhost:8000`

### GitHub Pages Deployment

1. **Create a GitHub repository** (or use existing one)
2. **Push these files** to your repository:
   ```bash
   git add .
   git commit -m "Add fhEVM Playground Pro landing site"
   git push origin main
   ```
3. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Set source to **Main branch** (or your branch)
   - Optional: Add custom domain
4. **Site goes live** at `https://your-username.github.io/repository-name`

## 📋 Customization Guide

### Update Examples Data

Edit the `examplesData` array in `script.js` to add/modify examples:

```javascript
{
    id: 'example-id',
    name: 'Example Name',
    category: 'mandatory', // or 'bonus'
    complexity: 'beginner', // beginner, intermediate, advanced, pro
    description: 'Short description for card',
    details: 'Longer description for modal',
    repo: 'https://github.com/link/to/repo',
    tags: ['Tag1', 'Tag2', 'Tag3']
}
```

### Change Brand Colors

Edit CSS variables in `styles/01-fhevm-playground-pro--master-stylesheet.css` (the `:root` section), or see `README.css-sections.md`:

```css
:root {
    --color-navy: #0A1D37;
    --color-teal: #00D1FF;
    --color-purple: #4B2E83;
    /* ... etc */
}
```

### Update Navigation Links

Modify `.nav-menu` in `index.html`:

```html
<li><a href="#section-id" class="nav-link">Section Name</a></li>
```

### Replace Demo Video

In `index.html`, update the YouTube iframe `src`:

```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"></iframe>
```

### Update Footer Links

Edit the `.footer-section` links in `index.html` to point to actual resources.

## ✨ Key Features

### 1. Smart Filtering & Search
- Filter by: All, Core Concepts (mandatory), Innovative Apps (bonus)
- Real-time search across example names, descriptions, and tags
- Instant card re-rendering with smooth animations

### 2. CLI Quick Start Modal
- Copy-to-clipboard buttons for CLI commands
- Category selector for custom command generation
- Multi-step onboarding instructions

### 3. Responsive Design
- Mobile-first approach
- Adapts perfectly to tablets and desktops
- Touch-friendly button sizes
- Optimized font sizes for all devices

### 4. Performance Optimizations
- CSS custom properties for efficient theming
- Debounced search input
- Lazy animation initialization
- Smooth scrolling with IntersectionObserver

### 5. Accessibility
- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- Reduced motion media query support
- High contrast text for readability

## 🔧 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full responsive support

## 📱 Mobile Optimization

The site is fully optimized for mobile devices:
- Touch-friendly buttons (min 44px)
- Single-column layouts on small screens
- Optimized font sizes (adjusts below 480px)
- Hamburger nav consideration (can be added if needed)
- Reduced padding/margins for mobile

## 🎬 Animations & Transitions

All animations are:
- GPU-accelerated (using `transform` and `opacity`)
- Respects `prefers-reduced-motion` for accessibility
- Smooth 300-500ms transitions
- Non-blocking (using CSS animations, not JS)

## 📊 Example Categories

### Core fhEVM Concepts (Mandatory)
- Basic Counter
- Arithmetic Operations
- Comparisons & Inequalities
- User/Public Encryption & Decryption
- Access Control (FHE.allow)
- Input Proofs & Verification
- Anti-Patterns & Edge Cases
- Handles & Lifecycle Management
- Symbolic Execution & Analysis
- OpenZeppelin Standards (ERC7984, Wrappers, Swaps, Vesting)
- Blind Auction Pro

### Innovative Real-World Apps (Pro Bonus)
- Confidential DAO Voting
- Private Lending Pool
- Blind DEX Order Book (MEV-resistant)
- Encrypted Poker Game
- Private Yield Farming Positions
- MEV-Resistant Arbitrage Demo
- Confidential Stablecoin (Mint/Burn)

## 🛠️ Development Tips

### Adding New Sections

1. Add section to HTML with unique `id`
2. Add nav link pointing to that `id`
3. Create CSS class for styling
4. Update JavaScript if interactivity needed

### Customizing Gradients

Main gradients in CSS:

```css
--gradient-primary: linear-gradient(135deg, #4B2E83 0%, #00D1FF 100%);
--gradient-hero: linear-gradient(135deg, #0A1D37 0%, #4B2E83 50%, #00D1FF 100%);
--gradient-card: linear-gradient(135deg, #0F2A4D 0%, rgba(75, 46, 131, 0.3) 100%);
```


## CSS: Split Sections

- **Summary**: The main stylesheet has been split into section files under the `styles/` directory for maintainability.
- **Files generated**: see [README.css-sections.md](README.css-sections.md) for extracted snippets and descriptions.
- **Usage**: either include individual files from `styles/` in your HTML head or concatenate them during build to preserve cascade order.


### Testing Search Functionality

Open browser console and test:

```javascript
// Search for examples by keyword
document.getElementById('searchInput').value = 'voting';
document.getElementById('searchInput').dispatchEvent(new Event('input'));
```

## 📞 Support & Credits

- **Built for**: Zama's fhEVM | December 2025 Bounty Track
- **Brand**: Zama AI (zama.ai)
- **Fonts**: Google Fonts (Inter, Space Grotesk, JetBrains Mono)
- **Icons**: Unicode emoji + custom SVG

## 📄 License

This landing page template is provided as-is for Zama's fhEVM Playground Pro project.

---

**Last Updated**: December 22, 2025
**Version**: 1.0.0 (Production Ready)

