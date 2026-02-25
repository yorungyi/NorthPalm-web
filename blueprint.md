# NorthPalm-web Project Blueprint

## Overview
NorthPalm-web is a modern, responsive single-page application for the NorthPalm Country Club's F&B (Food & Beverage) team. It showcases the club's restaurant menus, snack house offerings, and current promotions.

## Project Structure
- `index.html`: Main entry point.
- `css/style.css`: Main stylesheet containing all visual designs, layout, and responsive rules.
- `js/main.js`: Main JavaScript file handling interactive elements like the hero slider, mobile navigation, menu tabs, and map popup.
- `images/`: Directory for static images (logo, etc.).
- Root images: Promotion and menu images are currently stored in the root directory for easy access.

## Tech Stack
- **HTML5**: Semantic markup.
- **CSS3**: Modern features including CSS Variables, Flexbox, Grid, and responsive design (Baseline).
- **JavaScript (ES6)**: Vanilla JS for interactivity.
- **Fonts**: Noto Serif KR and Noto Sans KR (Google Fonts).
- **Icons**: FontAwesome 6.4.0 (CDN).

## Deployment & Workflow
- **Repository**: [yorungyi/NorthPalm-web](https://github.com/yorungyi/NorthPalm-web)
- **Deployment**: Auto-deployed to [northpalm-web.pages.dev](https://northpalm-web.pages.dev) via Cloudflare Pages integration with GitHub.
- **Automation**: Every push to the `main` branch triggers a new build and deployment.

## Current Plan & Steps
1. **Clean up redundant files**: Remove root `style.css` and `main.js` which are placeholders.
2. **Organize assets (Optional but recommended)**: Consider moving all root images to the `images/` directory and updating `index.html`. (Will keep in root for now as requested/implied by the user's focus on the workflow).
3. **Commit & Push**: Commit the cleanup and any pending changes to GitHub to trigger auto-deployment.
4. **Verification**: Verify the deployment on the live URL.
