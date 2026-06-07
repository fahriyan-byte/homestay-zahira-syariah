# Salsabila Hotel — Agent Guide

## Overview
Static landing page for an Islamic hotel in Pangkalan Bun, Indonesia.  
**No build tools, no package.json, no testing framework.** Pure HTML/CSS/JS + one PHP endpoint.

## Stack
- Vanilla HTML/CSS/JS — single page (`index.html`) with hash navigation
- PHP 8+ (`api/visitor.php`) — visitor counter backed by JSON
- Netlify for hosting (`netlify.toml` publishes from root `.`)
- Apache `.htaccess` for XAMPP local dev (error pages use `/Hotel/` subdirectory prefix)
- Icons: Lucide via unpkg CDN. Fonts: Playfair Display + DM Sans via Google Fonts
- CSS custom properties for theme (`--primary: #0d4432`, `--gold: #c9a96c`)

## No commands exist
There is no `npm`, `composer`, lint, test, typecheck, or build command.  
Open `index.html` in a browser or serve via XAMPP to develop.

## Key architecture
| Path | Purpose |
|---|---|
| `index.html` | Entire SPA — all sections, hero, booking form, gallery, map |
| `error.html` | 404/403/500 error page (referenced in both `.htaccess` and `_redirects`) |
| `assets/css/style.css` | All styles (545 lines, no preprocessor) |
| `assets/js/script.js` | All JS (228 lines) — nav, scroll spy, reveal animations, lightbox, booking form |
| `api/visitor.php` | `GET` → read count, `POST` → increment; stores to `visitor-data.json` |
| `api/visitor-data.json` | Auto-created if missing; runtime data, do not commit meaningful data |
| `netlify.toml` | Security headers (`X-Frame-Options: DENY`, etc.) |
| `.htaccess` | Apache error docs (local dev only — Netlify ignores it) |
| `_redirects` | Netlify 404 fallback (replaces `.htaccess` on Netlify) |

## Important gotchas
- **Language**: All UI text is Indonesian (`id`). Keep it consistent.
- **Booking form** submits via hard-coded WhatsApp URL — no backend reservation system.
- **WhatsApp number** is hard-coded in `index.html` (line 39, 185, 210, 235, 325, 363, 373, etc.), `script.js`, and `style.css`. Same number used everywhere.
- **Visitor counter** uses file-based JSON storage — not suitable for high traffic (no DB).
- **Git**: single commit. No branching conventions established.
- **Image paths**: referenced as `assets/img/...` — keep this convention when adding new images.

## Image assets
All images are in `assets/img/` as `.jpg` or `.svg` (favicon). No image optimization pipeline — add optimized JPGs directly.
