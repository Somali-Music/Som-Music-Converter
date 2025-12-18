import express from 'express';
import cors from 'cors';
import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- STATE ---
let currentJob = { progress: 0, status: 'idle', error: null };

function getDownloadPath(type) {
    const home = os.homedir();
    switch (type) {
        case 'desktop': return path.join(home, 'Desktop');
        case 'documents': return path.join(home, 'Documents');
        case 'downloads': return path.join(home, 'Downloads');
        case 'app':
        default:
            const appDl = path.join(__dirname, 'downloads');
            if (!fs.existsSync(appDl)) fs.mkdirSync(appDl);
            return appDl;
    }
}

app.get('/', (req, res) => res.send('✅ Backend is working!'));
app.get('/progress', (req, res) => res.json(currentJob));

// --- ROUTE: YouTube Downloader (Audio & Video) ---
app.post('/convert', (req, res) => {
    // mode can be 'audio' (mp3) or 'video' (mp4)
    const { url, targetFolder, mode = 'audio' } = req.body;
    
    if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });
    if (currentJob.status === 'downloading') {
        return res.status(409).json({ success: false, error: 'Busy' });
    }

    currentJob = { progress: 0, status: 'downloading', error: null };
    res.json({ success: true, message: 'Started' });

    const savePath = getDownloadPath(targetFolder);
    const ffmpegPath = path.join(__dirname, 'tools');

    // ARGS SETUP
    let args = [
        '--ffmpeg-location', ffmpegPath,
        '--newline',
        '-o', path.join(savePath, '%(title)s.%(ext)s'),
        url
    ];

    if (mode === 'audio') {
        // Audio Mode (MP3)
        args.unshift('-x', '--audio-format', 'mp3');
    } else {
        // Video Mode (MP4)
        // This gets best video + best audio and merges them into MP4
        args.unshift('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
    }

    console.log(`\n🚀 NEW JOB (${mode.toUpperCase()}): ${url}`);
    
    const ytDlp = spawn('yt-dlp', args);

    ytDlp.stdout.on('data', (data) => {
        const text = data.toString();
        process.stdout.write(text); 
        const match = text.match(/(\d{1,3}\.\d)%/);
        if (match && match[1]) currentJob.progress = parseFloat(match[1]);
    });

    ytDlp.stderr.on('data', (data) => {
        const text = data.toString();
        if (text.includes('ERROR:')) {
            console.error('❌ ERROR:', text);
            currentJob.status = 'error';
            currentJob.error = 'Download failed.';
        }
    });

    ytDlp.on('close', (code) => {
        if (code === 0) {
            currentJob.progress = 100;
            currentJob.status = 'completed';
        } else {
            if (currentJob.status !== 'error') {
                currentJob.status = 'error';
                currentJob.error = 'Process failed.';
            }
        }
    });
});

// --- ROUTE: General Image Downloader (Any URL) ---
app.post('/download-image', (req, res) => {
    const { imageUrl, targetFolder, format = 'jpg' } = req.body;
    if (!imageUrl) return res.status(400).json({ success: false });

    const savePath = getDownloadPath(targetFolder);
    // Create a generic name based on timestamp
    const timestamp = Date.now();
    const tempFile = path.join(__dirname, 'downloads', `temp_${timestamp}`); // No extension yet
    const finalFile = path.join(savePath, `image-${timestamp}.${format}`);

    if (!fs.existsSync(path.join(__dirname, 'downloads'))) fs.mkdirSync(path.join(__dirname, 'downloads'));

    console.log(`🖼️ Downloading image: ${imageUrl}`);

    const file = fs.createWriteStream(tempFile);

    https.get(imageUrl, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                
                // Use FFmpeg to convert whatever we downloaded to the target format
                console.log(`🔄 Converting to ${format.toUpperCase()}...`);
                const ffmpegPath = path.join(__dirname, 'tools', 'ffmpeg.exe');
                
                const convert = spawn(ffmpegPath, ['-i', tempFile, '-y', finalFile]);

                convert.on('close', (code) => {
                    fs.unlink(tempFile, () => {}); // cleanup temp
                    
                    if (code === 0) {
                        res.json({ success: true, message: `Saved as ${format.toUpperCase()}` });
                    } else {
                        res.status(500).json({ success: false, error: 'Conversion failed' });
                    }
                });
            });
        } else {
            file.close();
            fs.unlink(tempFile, () => {});
            res.status(404).json({ success: false, error: 'Image not found' });
        }
    }).on('error', () => {
        fs.unlink(tempFile, () => {});
        res.status(500).json({ success: false, error: 'Network error' });
    });
});

// --- ROUTE: YouTube Thumbnail Saver (Specific for YT Preview) ---
app.post('/save-thumbnail', (req, res) => {
    // Reuse the image downloader logic internally, but keep route for backward compatibility
    // Or just forward request to download-image logic if we wanted.
    // For now, let's keep the dedicated code for simplicity.
    const { imageUrl, videoId, targetFolder, format = 'jpg' } = req.body;
    
    // We can actually just redirect to the logic above, but let's copy/paste to ensure stability
    // reusing the /download-image logic manually:
    const savePath = getDownloadPath(targetFolder);
    const tempFile = path.join(__dirname, 'downloads', `temp_${videoId}.jpg`);
    const finalFile = path.join(savePath, `thumbnail-${videoId}.${format}`);
    
    const file = fs.createWriteStream(tempFile);
    https.get(imageUrl, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                const ffmpegPath = path.join(__dirname, 'tools', 'ffmpeg.exe');
                const convert = spawn(ffmpegPath, ['-i', tempFile, '-y', finalFile]);
                convert.on('close', (code) => {
                    fs.unlinkSync(tempFile);
                    if (code === 0) res.json({ success: true, message: `Saved as ${format.toUpperCase()}` });
                    else res.status(500).json({ success: false });
                });
            });
        } else {
            file.close();
            res.status(404).json({ success: false });
        }
    }).on('error', () => res.status(500).json({ success: false }));
});

app.post('/open-folder', (req, res) => {
    const { targetFolder } = req.body;
    const savePath = getDownloadPath(targetFolder);
    exec(`start "" "${savePath}"`); 
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Backend Worker running on http://localhost:${PORT}`);
});