# PromptBiotics — Clinical Color System

## Design Rationale

This is a **dual-theme clinical palette** for a drug-nutrient interaction checking tool used by clinicians. The default theme is **light** — clean, readable, and appropriate for daytime clinical use. A dark theme is available for night-shift staff.

### Why these colors

| Principle | Decision |
|-----------|----------|
| Light theme default | White background (`#FFFFFF`), off-white surface (`#F8FAFC`), slate text — clean, professional, readable |
| Dark theme available | Slate-900 background (`#0F172A`) — not pure black, reduces halation for night-shift use |
| Medical text safety | Light: `#0F172A` on white (WCAG AAA); Dark: `#F8FAFC` on slate-900 (WCAG AAA) |
| Alert visibility | Warning colors lightened 10–15% in dark mode so they don't go muddy |
| Color-blind safety | Icons and borders accompany color for all status states; never color alone |
| Clinical authority | Teal accent (`#0891B2` light, `#22D3EE` dark) — pharmaceutical-adjacent, trustworthy, not generic blue/purple |
| No AI slop | No neon acid (`#D9FF00`), no neon cyan (`#00F0FF`), no spectral violet (`#A855F7`) — these are algorithmic defaults that read as generated |
| No black/purple | Primary background is white (light) or slate-900 (dark), not obsidian black. Accent is teal, not purple |

---

## Light Theme (`data-theme="light"` — default)

| Role | Variable | Hex | Usage |
|------|----------|-----|-------|
| Background | `--color-bg` | `#FFFFFF` | Page background |
| Surface | `--color-surface` | `#F8FAFC` | Cards, elevated surfaces |
| Border | `--color-border` | `#E2E8F0` | Hairline dividers, input borders |
| Border (focus) | `--color-border-focus` | `#0891B2` | Focused input borders |
| Text (primary) | `--color-text` | `#0F172A` | Headings, body copy, medication names |
| Text (secondary) | `--color-text-muted` | `#475569` | Labels, captions, secondary info |
| Accent (primary) | `--color-accent` | `#0891B2` | Primary buttons, active states, links |
| Accent (hover) | `--color-accent-hover` | `#0E7490` | Button hover |
| Warning | `--color-warning` | `#EA580C` | Drug-nutrient interaction flags |
| Danger | `--color-danger` | `#DC2626` | Contraindications |
| Success | `--color-success` | `#15803D` | Verified safe pairings |
| Info | `--color-info` | `#64748B` | Informational messages |

## Dark Theme (`data-theme="dark"`)

| Role | Variable | Hex | Usage |
|------|----------|-----|-------|
| Background | `--color-bg` | `#0F172A` | Page background |
| Surface | `--color-surface` | `#1E293B` | Cards, elevated surfaces |
| Border | `--color-border` | `#334155` | Hairline dividers, input borders |
| Border (focus) | `--color-border-focus` | `#22D3EE` | Focused input borders |
| Text (primary) | `--color-text` | `#F8FAFC` | Headings, body copy |
| Text (secondary) | `--color-text-muted` | `#94A3B8` | Labels, captions |
| Accent (primary) | `--color-accent` | `#22D3EE` | Primary buttons, links |
| Accent (hover) | `--color-accent-hover` | `#67E8F9` | Button hover |
| Warning | `--color-warning` | `#FB923C` | Drug-nutrient interaction flags |
| Danger | `--color-danger` | `#F87171` | Contraindications |
| Success | `--color-success` | `#4ADE80` | Verified safe pairings |
| Info | `--color-info` | `#94A3B8` | Informational messages |

---

## Usage Rules

1. **Default theme is light.** Set `data-theme="dark"` on `<html>` to switch.
2. **Never use accent color as body text.** Accent is for actions only.
3. **Never use status colors decoratively.** Red/green/orange mean something specific.
4. **Always pair color with an icon or border** for status states.
5. **Max 6 colors in production UI.** Base + text + accent. Status colors are semantic overlays.
6. **No gradients.** Flat colors with hairline borders only.
7. **No neon.** Acid, cyan, spectral violet are banned.

---

## Implementation

Color tokens are defined in `src/app/globals.css` using `[data-theme="light"]` and `[data-theme="dark"]` CSS attribute selectors. Components reference `var(--color-*)` tokens.

A `ThemeToggle` client component is available at `src/app/theme-toggle.jsx` for pages to import and render.

