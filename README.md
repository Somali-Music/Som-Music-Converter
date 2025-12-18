 <div align="center">

<img src="readme logo.jpg" alt="SOM Music Media Tool Logo" width="400">

# 🎵 SOM Music Media Tool

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-stable-success.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange.svg?style=for-the-badge)

<!-- Tech Stack Badges -->
<img src="https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00" />
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />

</div>

<div align="center">

### 💎 The Ultimate Local Media Converter

**Download YouTube videos, extract high-quality audio, and convert internet images—all running securely on your own machine.**

🚫 Zero ads · 🔒 Zero tracking · 🛡️ Total privacy

</div>

---

## 📺 Visual Demo
See the application in action:

<img src="som-music%20info.gif" alt="How to Use" width="600">

*The GIF above demonstrates how to paste a link, select a format, and download files directly to your system.*

---

## 🌟 Key Features

### 🎧 YouTube Downloader
*   **Audio Mode (MP3):** Extracts the highest quality audio track and converts it to MP3.
*   **Video Mode (MP4):** Merges the best available video stream with the best audio stream for crisp MP4 playback.
*   **Smart Thumbnails:** Automatically previews the video cover before you download.
*   **Cover Art Saver:** Option to save the YouTube thumbnail as a JPG.

### 🖼️ Universal Image Tool
*   **Any Link:** Paste a direct link to any image on the web.
*   **Format Conversion:** Automatically convert downloaded images to your preferred format:
    *   **JPG** (Standard)
    *   **PNG** (Transparent/High Quality)
    *   **SVG** (Vector/Scalable)

### 🔒 Privacy & Local Control
*   **Local Bridge:** Uses a custom Node.js backend to bypass browser security limits.
*   **Direct Saving:** Files are saved directly to your **Desktop**, **Documents**, or **Downloads** folder—no need to dig through temporary files.
*   **Cross-Device:** Host the app on your PC and control it from your smartphone via Wi-Fi.

---

## 🛠️ Tech Stack & Architecture

This project uses a "Local Bridge" architecture to combine the power of desktop tools with the ease of a web interface.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Svelte + Vite** | The reactive user interface (UI). Fast and lightweight. |
| **Styling** | **Tailwind CSS** | Modern, responsive design system. |
| **Backend** | **Node.js + Express** | The local server that handles system commands. |
| **Engine** | **yt-dlp** | A powerful command-line media downloader. |
| **Converter** | **FFmpeg** | The industry-standard tool for processing audio and video files. |

---

## 🚀 Installation Guide

<div align="center">

![Step](https://img.shields.io/badge/Follow_These_Steps-Setup_Guide-blue?style=for-the-badge)

</div>

### ![1](https://img.shields.io/badge/STEP-1-blue?style=flat-square) Prerequisites
Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16.0.0 or higher)
*   [Git](https://git-scm.com/)

### ![2](https://img.shields.io/badge/STEP-2-green?style=flat-square) Clone the Repository

> 📋 Open your terminal and run:
```bash
git clone https://github.com/YOUR_USERNAME/som-music-media-tool.git
cd som-music-media-tool
```

### ![3](https://img.shields.io/badge/STEP-3-orange?style=flat-square) Install Dependencies

> 📦 Download the necessary JavaScript libraries:
```bash
npm install
```

### ![4](https://img.shields.io/badge/STEP-4-red?style=flat-square) Setup FFmpeg (Crucial Step!)

> ⚠️ **IMPORTANT:** This app requires FFmpeg to handle media conversion.

<table>
<tr>
<td>

**📥 Step 4.1:** Download **FFmpeg Essentials (Windows)** from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/).

**📂 Step 4.2:** Open the ZIP file and navigate to the `bin` folder.

**📁 Step 4.3:** Create a new folder named `tools` inside your project's root directory.

**📋 Step 4.4:** Copy `ffmpeg.exe` and `ffprobe.exe` into that `tools` folder.

</td>
</tr>
</table>

Your folder structure should look like this:
```
som-music-media-tool/
├── node_modules/
├── src/
├── tools/                <-- Create this folder
│   ├── ffmpeg.exe        <-- Place file here
│   └── ffprobe.exe       <-- Place file here
├── server.js
├── package.json
└── README.md
```

---

## ⚡ How to Run

<div align="center">

![Run](https://img.shields.io/badge/Choose_Your_Method-Launch_App-success?style=for-the-badge)

</div>

### 🖱️ Method 1: The One-Click Launcher (Windows)

> 🚀 **Easiest Way!** We have included a batch script for easy startup.

<table>
<tr>
<td>

**1️⃣** Locate `start.bat` in the project folder.

**2️⃣** Double-click it.

**3️⃣** It will open the backend, frontend, and launch your default browser automatically.

</td>
</tr>
</table>

### ⌨️ Method 2: Manual Terminal Startup

> 💻 If you prefer using the command line, open two separate terminals.

**Terminal 1 (The Backend Worker):**
```bash
node server.js
```
You should see: `Backend Worker running on http://localhost:3001`

**Terminal 2 (The Web Interface):**
```bash
npm run dev
```
You should see: `Local: http://localhost:5173/`

---

## 📖 Usage Manual

<div align="center">

![Usage](https://img.shields.io/badge/How_To_Use-User_Guide-purple?style=for-the-badge)

</div>

### 🎧 Mode 1: YouTube Downloader

<table>
<tr>
<td>

**1️⃣** Click the **"YouTube"** tab in the app.

**2️⃣** Paste a YouTube link (e.g., `https://www.youtube.com/watch?v=...`).

**3️⃣** Wait for the thumbnail preview to appear.

**4️⃣** Select your format:
   - 🎵 **MP3:** For music/audio only.
   - 🎬 **MP4:** For full video.

**5️⃣** Select your Save Location (e.g., "System Downloads").

**6️⃣** Click **Download**. The progress bar will show the status.

</td>
</tr>
</table>

### 🖼️ Mode 2: Image Tool

<table>
<tr>
<td>

**1️⃣** Click the **"Image Tool"** tab.

**2️⃣** Paste a direct link to an image (e.g., a Google Image result ending in `.jpg` or `.png`).

**3️⃣** Select the output format you want (JPG, PNG, or SVG).

**4️⃣** Click **Download Image**. The app will download and convert it automatically.

</td>
</tr>
</table>

---

## 📱 Mobile / Local Network Usage

<div align="center">

![Mobile](https://img.shields.io/badge/Control_From-Your_Phone-ff69b4?style=for-the-badge)

</div>

> 📲 You can use this tool on your phone to trigger downloads on your computer!

<table>
<tr>
<td>

**1️⃣** Ensure your PC and Phone are connected to the same Wi-Fi network.

**2️⃣** Run the app on your PC.

**3️⃣** Check the Frontend terminal (where you ran `npm run dev`). It will show a Network IP:
   ```
   > Network:  http://192.168.1.15:5173/
   ```

**4️⃣** Type that specific address (IP:Port) into your phone's browser (Chrome/Safari).

**5️⃣** The app will load on your phone. Any download you start will save files to your PC's hard drive.

</td>
</tr>
</table>

---

## ❓ Troubleshooting

<div align="center">

![Help](https://img.shields.io/badge/Need_Help-Common_Issues-yellow?style=for-the-badge)

</div>

<table>
<tr>
<td>

### 🐛 **Q: The download stays at 0% forever.**
**A:** Check your internet connection. Also, verify that `tools/ffmpeg.exe` exists. If the backend cannot find FFmpeg, it cannot start the conversion.

### 🔴 **Q: I get a "Network Error" red box.**
**A:** Ensure the Backend is running. The frontend needs `node server.js` running in the background to work.

### 🖼️ **Q: The Image Tool says "Image not found".**
**A:** Ensure the link is a direct image link (usually ends in `.jpg`, `.png`, `.webp`). Some websites block direct downloading (hotlinking).

</td>
</tr>
</table>

---

## 🤝 Contributing

<div align="center">

![Contribute](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge)

</div>

> 💡 Contributions are welcome! If you have an idea for a new feature:

<table>
<tr>
<td>

**1️⃣** Fork the repository.

**2️⃣** Create a new branch (`git checkout -b feature/AmazingFeature`).

**3️⃣** Commit your changes.

**4️⃣** Push to the branch.

**5️⃣** Open a Pull Request.

</td>
</tr>
</table>

---

## ⚖️ License & Disclaimer

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Use](https://img.shields.io/badge/Use-Personal_&_Educational-orange?style=for-the-badge)

</div>

<table>
<tr>
<td align="center">

**📜 License:** MIT License. Free to use and modify.

**⚠️ Disclaimer:**  
This tool is intended for **Personal and Educational Use Only**. The developers do not endorse copyright infringement. Users are responsible for complying with YouTube's Terms of Service and applicable copyright laws in their country.

</td>
</tr>
</table>

---

<div align="center">

### Made with 💻 by **Yusuf**

⭐ **Star this repo if you find it useful!** ⭐

</div>