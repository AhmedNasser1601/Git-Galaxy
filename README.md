# 🌌 Git-Galaxy

> **Transform your GitHub profile into a living, interactive 3D solar system.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

Git-Galaxy is a completely dynamic, data-driven 3D visualization tool that takes any GitHub username and turns their open-source contributions into a beautiful, explorable cosmos. 

## 🌍 **[Explore the Galaxy Live Here](https://your-git-galaxy.vercel.app)**

---

## ✨ Features

- **Live-Telemetry Search:** Enter any GitHub username, and watch the galaxy rebuild itself in real-time.
- **Procedural Planets:** Each repository becomes a planet. 
  - **Size** is calculated algorithmically based on lines of code.
  - **Color** and glow are mapped to the repository's primary programming language.
- **Interactive UI:** Hover over any planet to pause its orbit and reveal a glassmorphic data card with stats (Stars, Issues, Language) and a direct warp link to the code.
- **Cinematic Rendering:** Powered by `react-three-fiber` and `@react-three/postprocessing` for high-performance bloom, lighting, and starry environments.

## 🛠️ The Tech Stack

- **Framework:** Next.js (App Router)
- **3D Engine:** Three.js / React Three Fiber / Drei
- **Styling:** Tailwind CSS (with arbitrary values for glassmorphism)
- **Data Source:** GitHub REST API
- **Hosting & CI/CD:** Vercel

## 🚀 How It Works (The Data Mapping)

| GitHub Metric | Celestial Body | Description |
| :--- | :--- | :--- |
| **User Profile** | `Central Star` | A glowing sun that shifts colors, anchoring the solar system. |
| **Repositories** | `Planets` | Orbit the star. Size = Repo Size. Color = Primary Language. |
| **Open Issues** | `Asteroid Belts` | Tumbling space rocks that orbit buggy or highly-active repos. |
| **Forks** | `Moons` | Smaller spheres locked in orbit around popular repositories. |

## 💻 Local Development

Want to spin up your own universe locally? 

```bash
# Clone the repository
git clone https://github.com/ahmednasser1601/git-galaxy.git

# Navigate into the project
cd git-galaxy

# Install the dependencies
npm install

# Start the warp drive (development server)
npm run dev

Open http://localhost:3000 to view it in your browser
