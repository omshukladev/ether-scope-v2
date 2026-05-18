# Frontend Creative Direction

This document defines the visual and interaction direction for EtherScope Mobile.

The app MUST feel:
- premium
- modern
- technical
- interactive
- high-performance
- motion-designed

This is NOT a generic wallet app. It's a professional blockchain explorer.

---

## Core Feeling

The app should communicate:

- intelligence
- sophistication
- blockchain expertise
- premium tooling
- confidence
- speed
- technical excellence

The UI should feel alive and responsive.

Avoid:
- plain centered layouts
- template mobile apps
- static, dead screens
- generic Bootstrap-style components

---

## Visual Style

Use:
- dark cinematic backgrounds (default dark mode)
- ambient gradients (blue/purple/cyan on black)
- glassmorphism lightly (frosted glass cards)
- glow effects (neon accents on hover/press)
- depth layering (shadows, z-index)
- subtle grid overlays
- motion-reactive lighting

The app should feel dimensional and alive.

**Color Palette**:
- Primary BG: Pure black (#000000)
- Surface: Dark gray (#111111 / #1F1F1F)
- Text: White (#FFFFFF)
- Accent: Cyan/Blue (#00D4FF / #3B82F6)
- Success: Green (#10B981)
- Danger: Red (#EF4444)
- Warning: Yellow (#FBBF24)

---

## Motion Philosophy

Motion is mandatory. Every interaction should have micro-motion.

Use:
- Framer Motion + React Native Reanimated
- smooth reveals (fade + slide)
- stagger animations (list items)
- scroll transforms (parallax)
- floating ambient objects
- touch-reactive animations
- haptic feedback on interactions

Avoid:
- excessive bouncing
- childish animations
- random spinning effects
- laggy or slow animations

Motion should feel:
- intentional
- expensive (high-quality)
- smooth (60 FPS minimum)
- subtle (enhances, not distracts)

---

## Three.js / Reanimated Usage

Use Reanimated selectively for high-end effects:

**Allowed**:
- Hero background with animated particles
- Floating orbs in corners
- Glow effects on cards
- Subtle 3D depth (scale transforms)
- Gesture-reactive animations

**Avoid**:
- Giant heavy 3D scenes
- Game-like interfaces
- Complex GPU-heavy animations

Performance matters. Animations enhance the UI.
They should not dominate or slow down the app.

---

## Screen Experience

Each screen should feel:
- smooth
- immersive
- responsive
- fast

Use:
- smooth transitions between screens
- staggered list reveals
- bottom sheet modals (not full screen)
- haptic feedback on actions
- immediate visual feedback on press

Avoid:
- static screen jumps
- dead/empty sections
- abrupt transitions
- unresponsive buttons

---

## Search Screen (Hero)

The search screen must:
- instantly communicate value
- feel visually impressive
- contain layered depth
- use motion immediately
- establish premium quality

Elements:
- Large title "Wallet Explorer"
- Ambient background with particles/glow
- Search input with animated border on focus
- Quick action buttons with hover glow
- Floating orbs in corners
- List of recent searches below

Animations:
- Title fades in on load
- Input border glows on focus
- Buttons scale up on press with haptic
- Transaction cards slide in (staggered)
- Pull-to-refresh animation smooth

---

## Typography Direction

Typography should feel:
- bold
- sharp
- cinematic
- premium

Use:
- Large, confident headlines (20-32px)
- Strong hierarchy (clear info hierarchy)
- Controlled whitespace
- Elegant muted secondary text (gray)
- Monospace for wallet addresses/hashes

Avoid:
- Excessive paragraph density
- Tiny unreadable text
- Cluttered layouts
- Too much text per screen

---

## Interaction Design

Interactive elements should react immediately.

Use:
- Press glow (buttons light up on press)
- Scale transforms (buttons get slightly bigger)
- Haptic feedback (vibration on tap)
- Color transitions (smooth state changes)
- Animated borders (glow effect)

All buttons should feel:
- tactile and responsive
- high-quality and premium
- fast and snappy

---

## Component Philosophy

Components should:
- feel handcrafted
- feel polished
- animate naturally
- be reusable

Avoid:
- default shadcn appearance (adapt heavily)
- raw Tailwind examples
- unstyled primitives

Every component is a foundation,
not the final visual design.
Customize heavily.

---

## Visual Density

The app should contain:
- ambient visuals (particles, glows)
- layered depth (shadows, overlays)
- subtle decoration (grid, lines)
- visual rhythm (consistent spacing)

Avoid:
- empty black voids (add ambient visuals)
- overly sparse sections (add subtle decoration)
- excessive whitespace without purpose

---

## Performance Constraints

Despite premium visuals:

Must maintain:
- fast app load (<3 seconds)
- responsive interactions (<100ms)
- smooth animation FPS (60 FPS minimum)
- battery efficiency
- low memory footprint

Prefer:
- CSS transforms (Tailwind, NativeWind)
- GPU-friendly animations (Reanimated)
- lazy image loading
- optimized renders (React.memo)

Avoid:
- unnecessary re-renders
- extremely heavy particle systems
- large unoptimized images
- blocking main thread

---

## Design References

Primary inspiration for EtherScope:

Mobile Apps:
- Robinhood (premium financial app feel)
- Coinbase (clean crypto interface)
- Strike (smooth animations)
- Twitter (smooth scrolling)

Websites:
- linear.app (cinematic design)
- vercel.com (premium minimalism)
- stripe.com (polished components)
- raycast.com (premium tooling)

---

## Screen-by-Screen Direction

### Search/Explorer Screen
- **Feeling**: Powerful, fast, premium
- **Key Element**: Large search bar with glow
- **Motion**: Staggered transaction list, smooth pull-to-refresh
- **Color**: Black BG with cyan accents

### History Screen
- **Feeling**: Quick access, organized, clean
- **Key Element**: Recent wallet list with timestamps
- **Motion**: Smooth scroll, quick delete animations
- **Color**: Dark gray surfaces with subtle dividers

### Track Screen
- **Feeling**: Live, real-time, alert-ready
- **Key Element**: Live status indicators (● online markers)
- **Motion**: Pulse animations on live data, smooth state transitions
- **Color**: Green for active, gray for inactive

### Settings Screen
- **Feeling**: Simple, accessible, premium
- **Key Element**: Dark/Light toggle (default dark)
- **Motion**: Smooth toggle animation, theme transition
- **Color**: Consistent with app theme

---

## Final Creative Rule

Every screen should make the user feel:

**"This app is professionally built and blockchain-native."**

If a screen feels generic,
it must be redesigned.

If an interaction feels sluggish,
it must be optimized.

If motion feels cheap,
it must be refined.

---

## Animation Inspiration Files

- `HistoryCardMotion.tsx` - Reference for list animations
- `AnimatedModal.tsx` - Reference for modal transitions
- `AnimatedOrb.tsx` - Reference for ambient effects

---

## Accessibility Note

Premium visuals MUST NOT compromise accessibility:
- All text must be readable (sufficient contrast)
- All buttons must be tappable (44x44px minimum)
- Animations must be optional (respect `prefers-reduced-motion`)
- All interactive elements must have visible focus states

---

## Related Documents

- See FRONTEND_RULES.md for coding implementation
- See FRONTEND_ARCHITECTURE.md for folder structure
- See SESSION_LOG.md for design decisions made
