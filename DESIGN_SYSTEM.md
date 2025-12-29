# 🎨 fhEVM Playground Pro - Visual Design System

## Color Palette Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SITE THEME: GOLD & BLACK                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PRIMARY GOLD (Brand Accent)                                        │
│  ██████████ #FFD700  (`--color-gold`)    - Primary accent / CTAs     │
│  ██████████ #DAA520  (`--color-gold-dark`) - Darker accent / hover   │
│                                                                     │
│  GOLD LIGHT                                                         │
│  ██████████ #FFF8DC  (`--color-gold-light`) - Subtle highlights     │
│                                                                     │
│  PRIMARY BLACK & SURFACES                                           │
│  ██████████ #000000  (`--color-black`)   - Core background / text   │
│  ██████████ #1A1A1A  (`--color-charcoal`) - Dark surface / cards     │
│                                                                     │
│  NEUTRALS                                                            │
│  ██████████ #FFFFFF  (`--color-white`) - UI text on dark backgrounds│
│  ██████████ #333333  (`--color-gray-dark`) - Muted text / borders    │
│                                                                     │
│  GRADIENTS (CSS variables)
│  --gradient-primary: linear-gradient(135deg, #FFD700 0%, #DAA520 100%)
│  --gradient-hero:    linear-gradient(135deg, #000000 0%, #1A1A1A 50%, #FFD700 100%)
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Gradient Combinations

```
Hero Gradient:
┌─────────────────────────────────────────────────┐
│ #0A1D37 (Navy)  →  #4B2E83 (Purple)  →  #00D1FF (Teal) │
│ [████████] [████████] [████████]                │
│ Trust              Mystery         Innovation   │
└─────────────────────────────────────────────────┘

Card Gradient:
┌──────────────────────────┐
│ #0F2A4D (Navy Light) →   │
│ rgba(75,46,131,0.3)      │
│ [████████] [████████]    │
└──────────────────────────┘

Button Gradient:
┌────────────────────┐
│ #00D1FF → #00AEEF  │
│ [████████]         │
│ Teal Shine         │
└────────────────────┘
```

## Typography Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ DISPLAY HEADINGS (Space Grotesk, Bold)                      │
├─────────────────────────────────────────────────────────────┤
│ H1: 4rem        fhEVM Playground Pro (Hero Title)            │
│ H2: 2.5rem      Section Titles                              │
│ H3: 1.5rem      Card Titles                                 │
│ H4: 1.25rem     Subsection Titles                           │
├─────────────────────────────────────────────────────────────┤
│ BODY TEXT (Inter, Regular/Semi-Bold)                        │
├─────────────────────────────────────────────────────────────┤
│ P:  1rem        Body paragraphs                             │
│ Small: 0.95rem  Descriptions                               │
│ Tiny: 0.9rem    Labels, captions                           │
├─────────────────────────────────────────────────────────────┤
│ CODE (JetBrains Mono, Regular)                              │
├─────────────────────────────────────────────────────────────┤
│ Code: 0.9rem    Inline code & CLI                           │
│ Pre: 0.85rem    Code blocks                                │
└─────────────────────────────────────────────────────────────┘
```

## Component Spacing

```
SPACING SCALE (Used consistently throughout):

xs  = 0.5rem   = 8px      (tight spacing)
sm  = 1rem     = 16px     (normal spacing)
md  = 1.5rem   = 24px     (medium spacing)
lg  = 2rem     = 32px     (large spacing)
xl  = 3rem     = 48px     (extra large)
2xl = 4rem     = 64px     (hero spacing)

Example Card Padding:
┌─────────────────────────┐
│  (lg padding)           │ ▲ 2rem
│  ┌───────────────────┐  │
│  │ Example Title     │  │
│  │ (md margin-bottom)│  │
│  │                   │  │
│  │ Description text  │  │
│  │ (md margin-bottom)│  │
│  │                   │  │
│  │ [Button] [Button] │  │
│  └───────────────────┘  │
│  (lg padding)           │ ▼ 2rem
└─────────────────────────┘
  ◄─ lg padding (2rem) ─►
```

## Animation Timings

```
TRANSITION SPEEDS:

Fast    = 150ms ease-in-out   (quick interactions)
├─ Button hover color
├─ Icon transitions
└─ Checkbox toggles

Base    = 300ms ease-in-out   (normal interactions)
├─ Card hover lift
├─ Modal open/close
├─ Color transitions
└─ Border animations

Slow    = 500ms ease-in-out   (entrance animations)
├─ Page load fades
├─ Section scroll reveals
└─ Hero background floats
```

## Responsive Breakpoints

```
┌──────────────────────────────────────────────────────────────┐
│ MOBILE FIRST APPROACH                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Base Styles                                                 │
│ (Mobile: 320px - 480px)                                    │
│   └─ Single column layouts                                 │
│   └─ Touch-friendly (44px+ buttons)                        │
│   └─ Optimized font sizes                                  │
│                                                              │
│ @media (max-width: 768px)                                  │
│ (Tablet: 481px - 768px)                                   │
│   └─ 2-column grids where appropriate                      │
│   └─ Reduced padding/margins                               │
│   └─ Adjusted line heights                                 │
│                                                              │
│ @media (max-width: 480px)                                  │
│ (Small Mobile: < 480px)                                   │
│   └─ Extreme simplification                                │
│   └─ Stacked navigation                                    │
│   └─ Single column only                                    │
│                                                              │
│ Default Styles (Desktop: 769px+)                           │
│   └─ Multi-column layouts                                  │
│   └─ Full spacing applied                                  │
│   └─ Hover effects enabled                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Component States

```
BUTTON STATES:

Default:
┌─────────────────┐
│ Explore Examples │  ← Teal gradient, shadow
└─────────────────┘

Hover:
┌─────────────────┐
│ Explore Examples │  ← Darker teal, lifted up 3px
└─────────────────┘    (transform: translateY(-3px))

Active/Pressed:
┌─────────────────┐
│ Explore Examples │  ← Darker, no lift
└─────────────────┘

Disabled: (not used, but if added)
┌─────────────────┐
│ Explore Examples │  ← 50% opacity, no hover effects
└─────────────────┘


CARD STATES:

Default:
┌──────────────────────────┐
│ Example Title            │  ← Subtle gradient, neutral
│ Description              │    border
│ [Button] [Button]        │
└──────────────────────────┘

Hover:
┌──────────────────────────┐
│ Example Title            │  ← Lifts up 8px
│ Description              │    Brighter border
│ [Button] [Button]        │    Glow effect added
└──────────────────────────┘
  (transform: translateY(-8px))


FILTER TAB STATES:

Inactive:
[Core Concepts]  ← Navy background, gray text

Hover:
[Core Concepts]  ← Navy background, teal text, teal border

Active:
[Core Concepts]  ← Teal gradient background, navy text
```

## Interactive Elements Flow

```
USER INTERACTION FLOWCHART:

                    ┌─ Click "Run CLI Now"
                    │
                    ▼
         ┌──────────────────────┐
         │  CLI Modal Opens     │
         │  (slide-up animation)│
         └──────┬───────────────┘
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
   Copy CLI         Select Category
   Command            Button
   (200ms pulse)       (highlight)
       │                 │
       └────────┬────────┘
                │
                ▼
    "✓ Copied!" (2sec timeout)
                │
                ▼
     [Escape] or [X] Close
     Modal fades out


SEARCH FLOW:

User Types ──→ Input Event ──→ Filter Examples ──→ Re-render Grid
(real-time)    (debounced?)   (2 filters active)  (fade-in)
                                                       │
                                         Show matching
                                         cards only
```

## Accessibility Features

```
┌─────────────────────────────────────────────────────────────┐
│ ACCESSIBILITY CHECKLIST                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✓ Semantic HTML5 (nav, section, footer, article)          │
│ ✓ Proper heading hierarchy (H1 → H2 → H3)                 │
│ ✓ Color contrast (WCAG AA standard)                       │
│ ✓ Keyboard navigation (Tab, Enter, Escape)                │
│ ✓ Focus indicators (outline on tab focus)                 │
│ ✓ ARIA labels where needed                                │
│ ✓ Alt text for images (emoji descriptions)               │
│ ✓ Skip to content link (optional, can add)               │
│ ✓ Reduced motion support (@media prefers-reduced-motion) │
│ ✓ Touch-friendly targets (44px minimum)                   │
│ ✓ High contrast dark mode (existing)                      │
│ ✓ Screen reader friendly structure                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Shadow & Depth System

```
SHADOW ELEVATION LEVELS:

Shallow (cards):
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  ┌────────┐
  │        │  ▀ ▀  ▀    (subtle depth)
  └────────┘

Medium (navbar):
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  ─────────────────────
  ▀ ▀  ▀    (standard depth)

Deep (modal):
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  ┌────────────┐
  │            │  ▀  ▀  ▀  ▀  (prominent depth)
  │            │
  └────────────┘

Hover/Focus:
  box-shadow: 0 12px 35px rgba(0, 209, 255, 0.4);
  ┌────────┐
  │        │  ▀ ▀  ▀    ▄ ▄ ▄ (lifted + glow)
  └────────┘
```

## Example Card Layout Diagram

```
┌────────────────────────────────────────────┐
│                                            │  ▲
│  ┌─────────────┐  "Core Concept"           │  │  padding-lg
│  │ tag-basic   │  (colored tag)            │  │  (2rem)
│  └─────────────┘  ▲ margin-bottom: md     │  │
│                   │                       │  │
│  Blind Auction Pro ◄─────────────────────  │  ├─ padding
│  (h3, white)      │ Card Title             │  │
│                   │                       │  │
│  Sealed-bid auction with encrypted bids.  │  ├─ description
│  (p, light gray) ▼ margin-bottom: md      │  │
│                                            │  │
│  ┌──────────────┐  ┌──────────────┐       │  ├─ actions
│  │ View Repo → │  │ Copy CLI     │       │  │
│  └──────────────┘  └──────────────┘       │  │
│  ▲                                        │  │
│  └─ flex, gap: md                         │  ▼
│                                            │
└────────────────────────────────────────────┘
 ◄────────────────────────────────────────────►
           Grid: 280px - 1fr
```

## Mobile Optimization Details

```
DEVICE WIDTHS TARGETED:

┌─────────────────────────────────────────────────────────┐
│ iPhone SE (375px)                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔔 fhEVM Playground Pro                             │ │
│ │ ─────────────────────────────────────────────────   │ │
│ │ Premium Hub for Confidential Smart Contracts        │ │
│ │ ───────────────────────────────────────────────     │ │
│ │ A curated collection of ~21 standalone...           │ │
│ │ ───────────────────────────────────────────────     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ [Explore Examples]                              │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ [Run CLI Now]                                   │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ [Watch Demo Video]                              │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ iPad (768px)                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ fhEVM Playground Pro | [Quick Start] [Categories] │ │
│ │ ─────────────────────────────────────────────────   │ │
│ │ Premium Hub for Confidential Smart Contracts        │ │
│ │                                                     │ │
│ │ ┌──────────────────┐ ┌──────────────────────────┐ │ │
│ │ │ [Explore Examples]│ │  2-column layout begins │ │ │
│ │ └──────────────────┘ └──────────────────────────┘ │ │
│ │ ┌──────────────────┐ ┌──────────────────────────┐ │ │
│ │ │ [Run CLI Now]    │ │  Cards show side-by-side │ │ │
│ │ └──────────────────┘ └──────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Desktop (1200px+)                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ fhEVM | [Quick Start] [Categories] [Features]      │ │
│ │ ─────────────────────────────────────────────────   │ │
│ │ Premium Hub for Confidential Smart Contracts        │ │
│ │                                                     │ │
│ │ ┌────────────────┐ ┌────────────────────────────┐ │ │
│ │ │  Full Layout   │ │  3+ columns, full spacing  │ │ │
│ │ │  with optimal  │ │  All features visible      │ │ │
│ │ │  white space   │ │  Hover effects enabled     │ │ │
│ │ └────────────────┘ └────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Principles Applied

1. **Consistency**: Color palette repeated throughout
2. **Hierarchy**: Clear typographic and spatial priority
3. **Feedback**: Hover states and transitions
4. **Accessibility**: High contrast, semantic HTML
5. **Performance**: GPU acceleration, no blocking resources
6. **Simplicity**: Complex features, simple interface
7. **Premium Feel**: Gradients, shadows, smooth animations
8. **Brand Identity**: Zama colors, crypto aesthetic

---

**Design System Version**: 1.0.0 | Last Updated: December 22, 2025
