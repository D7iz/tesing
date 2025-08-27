const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Keep original filename with timestamp prefix
        const timestamp = Date.now();
        cb(null, `${timestamp}_${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept IPA files and common image formats for icons
        const allowedTypes = ['.ipa', '.png', '.jpg', '.jpeg', '.json'];
        const fileExt = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(new Error('Only IPA files, images (PNG, JPG), and JSON files are allowed'));
        }
    }
});

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Main upload route
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadDate: new Date().toISOString(),
            path: `/uploads/${req.file.filename}`
        };

        console.log('File uploaded successfully:', fileInfo);
        res.json({ success: true, file: fileInfo });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

// List uploaded files
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir).map(filename => {
            const filePath = path.join(uploadsDir, filename);
            const stats = fs.statSync(filePath);
            return {
                filename,
                size: stats.size,
                uploadDate: stats.mtime,
                path: `/uploads/${filename}`
            };
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Could not list files' });
    }
});

// Get JSON library data
app.get('/api/library/:type', (req, res) => {
    try {
        const { type } = req.params;
        let filename;
        
        if (type === 'ore') {
            filename = 'ore.json';
        } else if (type === 'source') {
            filename = 'source.json';
        } else {
            return res.status(400).json({ error: 'Invalid library type' });
        }
        
        const data = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Could not read library data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('File upload endpoint: POST /upload');
    console.log('View uploaded files: GET /api/files');
});