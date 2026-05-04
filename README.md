## **Transform a GitHub profile into a living, interactive 3D solar system.**

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

> Git-Galaxy is a completely dynamic, data-driven 3D visualization tool that takes any GitHub username and turns their open-source contributions into a beautiful, explorable solar system. 
 **[Explore the Galaxy Live Here](https://your-git-galaxy.vercel.app)**

## Features

- **Shareable Universes (Dynamic Routing):** Append any username to the URL (e.g., `/ahmednasser1601`) to instantly load their galaxy, perfect for sharing on social media or portfolios.
- **Infinite Scale:** Implements background API pagination loops to bypass default limits, fetching and rendering your entire repository history with self-adjusting orbital physics.
- **Live-Telemetry Search:** Enter any GitHub username, and watch the galaxy rebuild itself in real-time using a debounced API architecture.
- **Procedural Planets:** Each repository becomes a planet. 
- **Size** is calculated logarithmically based on lines of code.
- **Color** and glow are mapped to the repository's primary programming language.
- **Orbital Stasis (Time Freeze):** Hover over any planet to pause the solar systems's rotation via precise Delta-Time calculation.
- **Interactive HUD:** When a planet is hovered, a glassmorphic data card appears with real-time stats (Stars, Issues, Language).
- **Warp Drive:** Click directly on any 3D planet to instantly open its GitHub repository in a new tab.
- **Cinematic Rendering:** Powered by `react-three-fiber` and `@react-three/postprocessing` for high-performance bloom, custom lighting, and starry environments.

## Tech Stack

- **Framework:** Next.js (React / App Router)
- **3D Engine:** Three.js / React Three Fiber / Drei
- **Styling:** Tailwind CSS (with arbitrary values for glassmorphism)
- **Data Source:** GitHub REST API
- **Hosting & CI/CD:** Vercel

## Getting Started

Want to spin up your own solar system locally? 
```
    # Clone this repository:
    git clone https://github.com/ahmednasser1601/git-galaxy.git

    # Navigate into the project directory:
    cd git-galaxy

    # Install the dependencies using NPM:
    npm install

    # Host on your own machine:
    npm run dev
```

## Contributers:
* [AhmedNasser1601](https://github.com/AhmedNasser1601)
* [0u44](https://github.com/0u44)
