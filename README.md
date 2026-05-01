# 🌌 Git-Galaxy

> **Transform your GitHub profile into a living, interactive 3D solar system.**

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

Git-Galaxy is a completely dynamic, data-driven 3D visualization tool that takes any GitHub username and turns their open-source contributions into a beautiful, explorable cosmos. 

## 🌍 **[Explore the Galaxy Live Here](https://your-git-galaxy.vercel.app)**

---

## ✨ Features

- **Shareable Universes (Dynamic Routing):** Append any username to the URL (e.g., `/ahmednasser1601`) to instantly load their galaxy, perfect for sharing on social media or portfolios.
- **Infinite Scale:** Implements background API pagination loops to bypass default limits, fetching and rendering your entire repository history with self-adjusting orbital physics.
- **Live-Telemetry Search:** Enter any GitHub username, and watch the galaxy rebuild itself in real-time using a debounced API architecture.
- **Procedural Planets:** Each repository becomes a planet. 
  - **Size** is calculated logarithmically based on lines of code.
  - **Color** and glow are mapped to the repository's primary programming language.
- **Orbital Stasis (Time Freeze):** Hover over any planet to pause the universe's rotation via precise Delta-Time calculation.
- **Interactive HUD:** When a planet is hovered, a glassmorphic data card appears with real-time stats (Stars, Issues, Language).
- **Warp Drive:** Click directly on any 3D planet to instantly open its GitHub repository in a new tab.
- **Cinematic Rendering:** Powered by `react-three-fiber` and `@react-three/postprocessing` for high-performance bloom, custom lighting, and starry environments.

## 🚀 How It Works (The Data Mapping)

| GitHub Metric | Celestial Body | Description |
| :--- | :--- | :--- |
| **User Profile** | `Central Star` | A glowing sun that shifts colors, anchoring the solar system. |
| **Repositories** | `Planets` | Orbit the star. Size = Repo Size. Color = Primary Language. |
| **Open Issues** | `Asteroid Belts` | Tumbling space rocks that orbit buggy or highly-active repos. |
| **Forks** | `Moons` | Smaller spheres locked in orbit around popular repositories. |

## 🏗️ Architecture

Built with a professional, modular component structure separating 3D physics from React UI:

    ├── app/
    │   ├── layout.tsx
    │   └── [[...username]]/
    │       └── page.tsx           # Dynamic routing, API telemetry, and main layout
    ├── components/
    │   ├── HUD.tsx                # 2D Glassmorphic overlay & search UI
    │   ├── GalaxyCanvas.tsx       # 3D Environment, lighting, and post-processing
    │   └── CelestialBodies.tsx    # Math & meshes for Stars, Planets, Moons & Asteroids
    └── lib/
        └── constants.ts           # Language-to-Hex color mappings


## 🛠️ The Tech Stack

- **Framework:** Next.js (React / App Router)
- **3D Engine:** Three.js / React Three Fiber / Drei
- **Styling:** Tailwind CSS (with arbitrary values for glassmorphism)
- **Data Source:** GitHub REST API
- **Hosting & CI/CD:** Vercel

## 💻 Local Development

Want to spin up your own universe locally? 

    # Clone the repository
    git clone https://github.com/ahmednasser1601/git-galaxy.git

    # Navigate into the project
    cd git-galaxy

    # Install the dependencies
    npm install

    # Start the warp drive (development server)
    npm run dev

Open http://localhost:3000 to view it in your browser.

---

<img src="https://hits.sh/github.com/AhmedNasser1601/git-galaxy.svg?"/>
