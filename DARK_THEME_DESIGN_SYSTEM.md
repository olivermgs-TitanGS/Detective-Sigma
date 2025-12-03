# 🕵️ Detective Sigma - Dark Crime Scene Design System

## Color Palette

### Primary Colors
- **Background**: `bg-black`, `bg-slate-950` - Pure black and near-black
- **Crime Tape Yellow**: `border-amber-500`, `text-amber-400` - #F59E0B, #FBBF24
- **Blood Red**: `text-red-500`, `border-red-800` - Crime scene accents
- **Evidence Tag**: `bg-amber-600/30` - Translucent amber overlays

### Text Colors
- **Primary Text**: `text-slate-100`, `text-amber-50` - Light gray, off-white
- **Secondary Text**: `text-slate-400`, `text-slate-500` - Muted gray
- **Accent Text**: `text-amber-400`, `text-amber-500` - Crime tape yellow
- **Danger**: `text-red-400`, `text-red-500` - Blood/warning red

### Border & Dividers
- **Primary Border**: `border-amber-600` - Crime tape border (2-4px)
- **Secondary Border**: `border-slate-800`, `border-slate-700` - Subtle dividers
- **Dashed Chalk**: `border-dashed border-slate-400/30` - Chalk outline effect

### Backgrounds
- **Card BG**: `bg-black/80`, `bg-slate-950/90` - Dark translucent
- **Overlay**: `bg-black/60` with `backdrop-blur-sm`
- **Gradients**: `from-black via-slate-950 to-black`

## Typography

### Font Family
- **Primary**: `font-mono` - Courier New, monospace
- **All Caps Headers**: Use `uppercase` and `tracking-widest` (0.3-0.4em)

### Font Sizes
- **Hero**: `text-7xl` to `text-9xl`
- **Headers**: `text-2xl` to `text-4xl` with `tracking-[0.2em]`
- **Body**: `text-base` with `tracking-wide`
- **Small**: `text-sm` to `text-xs` with `tracking-wider`

### Font Weights
- **Bold**: `font-bold` for headers
- **Black**: `font-black` for hero text
- **Semibold**: `font-semibold` for emphasis

## Components

### Crime Scene Tape
```tsx
<div className="border-y-4 border-amber-500 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 transform -rotate-2">
  <p className="text-amber-400 font-mono tracking-widest">⚠️ CRIME SCENE • DO NOT CROSS ⚠️</p>
</div>
```

### Evidence Tag / Card
```tsx
<div className="border-2 border-amber-600 bg-black/90 p-6 backdrop-blur-sm hover:border-amber-500 transition-colors">
  <h3 className="text-amber-500 font-mono font-bold tracking-widest">EVIDENCE</h3>
  <p className="text-slate-400 font-mono">Description</p>
</div>
```

### Clue Hotspot
```tsx
<button className="w-14 h-14 bg-amber-500/30 border-2 border-amber-400 backdrop-blur-sm animate-pulse hover:scale-125 transition-all">
  🔍
  <div className="absolute inset-0 animate-ping bg-amber-400"></div>
</button>
```

### Button Styles

**Primary (Evidence Tag)**:
```tsx
className="border-2 border-amber-600 bg-black/90 px-10 py-5 font-mono font-bold tracking-wider text-amber-400 hover:bg-amber-600 hover:text-black transition-all hover:scale-105"
```

**Secondary (Neutral)**:
```tsx
className="border-2 border-slate-600 bg-black/90 px-8 py-3 font-mono tracking-wider text-slate-400 hover:bg-slate-700 hover:text-amber-400 transition-all"
```

**Danger (Crime)**:
```tsx
className="border-2 border-red-800 bg-black/90 px-8 py-3 font-mono tracking-wider text-red-400 hover:bg-red-900 transition-all"
```

## Layout Patterns

### Portal Navigation
```tsx
<nav className="bg-black border-b-2 border-amber-600/50">
  <div className="flex items-center gap-8 px-6 py-4">
    <h1 className="text-2xl font-bold font-mono tracking-widest text-amber-500">
      🔍 DETECTIVE SIGMA
    </h1>
    <Link className="text-slate-400 hover:text-amber-400 font-mono tracking-wider">
      DASHBOARD
    </Link>
  </div>
</nav>
```

### Page Header
```tsx
<div className="border-2 border-amber-600/50 bg-black/80 p-8 backdrop-blur-sm">
  <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em]">
    PAGE TITLE
  </h1>
  <p className="text-slate-400 font-mono tracking-wide">
    Description text
  </p>
</div>
```

### Stat Cards
```tsx
<div className="border-2 border-amber-600/30 bg-black/60 p-6">
  <div className="text-4xl font-bold text-amber-500 mb-2">123</div>
  <div className="text-slate-400 font-mono text-sm tracking-wider">STAT LABEL</div>
</div>
```

## Effects & Animations

### Glow Effect
```tsx
className="drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]"
```

### Pulse Animation
```tsx
className="animate-pulse"
// Duration: style={{ animationDuration: '2s' }}
```

### Hover Scale
```tsx
className="hover:scale-105 transition-transform duration-300"
```

### Backdrop Blur
```tsx
className="backdrop-blur-sm bg-black/60"
```

## Icons & Emojis

### Crime Scene / Investigation
- 🔍 - Magnifying glass (evidence search)
- 📍 - Location pin (crime scene)
- ⚠️ - Warning (caution tape)
- 📄 - Document (evidence)
- 🔒 - Locked evidence
- ✓ - Collected evidence

### Actions
- → - Next/Continue
- ← - Back/Previous
- ✕ - Close/Cancel
- ⚖️ - Justice/Verdict

### Categories
- 🧩 - Puzzles
- 👥 - Suspects
- 📊 - Statistics/Reports
- 🎯 - Objectives

## Portal-Specific Theming

### Student Portal
- **Primary**: Amber (`amber-500`, `amber-600`)
- **Accent**: Green for progress (`green-500`)
- **BG**: `bg-black` to `bg-slate-950`

### Teacher Portal
- **Primary**: Amber with slate accents
- **Accent**: Blue for data (`blue-500`)
- **BG**: `bg-black` to `bg-slate-900`

### Admin Portal
- **Primary**: Amber with red accents
- **Accent**: Red for danger (`red-500`, `red-800`)
- **BG**: `bg-black` to `bg-slate-950`

## Example Page Structure

```tsx
export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      {/* Crime Scene Tape Header */}
      <div className="border-b-4 border-amber-500 bg-amber-500/10 p-2">
        <p className="text-amber-400 font-mono text-center tracking-widest text-sm">
          ⚠️ ACTIVE INVESTIGATION ⚠️
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="border-2 border-amber-600/50 bg-black/80 p-8 mb-8">
          <h1 className="text-4xl font-bold text-amber-50 font-mono tracking-[0.2em] mb-2">
            PAGE TITLE
          </h1>
          <p className="text-slate-400 font-mono">Description</p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="border-2 border-amber-600/30 bg-black/60 p-6">
            Content
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-amber-600/30 bg-black/90 py-6">
        <p className="text-slate-600 font-mono text-center tracking-wider text-sm">
          CASE FILE #2025 • DETECTIVE SIGMA
        </p>
      </footer>
    </div>
  );
}
```

## Implementation Checklist

- [ ] Update all portal layouts with black BG and amber borders
- [ ] Replace purple/blue gradients with black/amber
- [ ] Add crime scene tape elements to headers
- [ ] Update all fonts to `font-mono`
- [ ] Add `tracking-widest` to all uppercase headers
- [ ] Update all buttons to evidence tag style
- [ ] Add glow effects to important elements
- [ ] Update all stat cards with amber borders
- [ ] Add chalk outline effects to evidence boards
- [ ] Update all modal/dialog styles

## Key Design Principles

1. **Dark & Gritty**: Always use black or near-black backgrounds
2. **High Contrast**: Bright amber/yellow against pure black
3. **Monospace Everything**: All text uses monospace fonts
4. **Wide Letter Spacing**: Headers use tracking-widest
5. **Crime Scene Aesthetic**: Borders mimic police tape
6. **Evidence Tags**: Cards styled like forensic evidence markers
7. **Minimal Rounded Corners**: Sharp, angular design (no rounded-lg)
8. **Glowing Accents**: Important elements glow with amber
9. **Noir Feel**: Dark, mysterious, detective atmosphere
10. **Uppercase Headers**: All major headers in ALL CAPS

---

**Generated for Detective Sigma MVP**
**Theme**: Dark Crime Scene / Murder Mystery
**Target**: Singapore Primary School P4-P6 Educational Platform
