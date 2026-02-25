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
1. **Clean up redundant files**: (Done) Removed root `style.css` and `main.js`.
2. **Luxury Design Redesign (In Progress)**:
    - Apply 'Luxury & Refined' aesthetic using `frontend-design` principles.
    - **Hero Section**: Refine typography, left-align layout, and enhance visual depth with sophisticated overlays.
    - **Menu Cards**: Implement layered shadows, gold accents, and elegant hover animations.
    - **Typography**: Enhance font sizes and spacing for an editorial look.
3. **UI Fine-tuning**:
    - Adjusted `object-position` for Promotion 1 (Ugeoji Haejangguk) to center its content better within the frame. (Corrected to move content upwards)
    - Updated Restaurant breakfast menu: '전주식콩나물국밥' renamed to '전주식콩나물따로국밥'.
4. **Native Map App Integration**:
    - Replaced generic map links with dedicated buttons for **Naver Map, Kakao Map, and T-map**.
    - Implemented device detection to trigger app schemes on mobile or open web versions on desktop.
5. **Commit & Push**: Commit the design overhaul to trigger auto-deployment.
6. **Verification**: Verify the new luxury aesthetic on the live URL.
