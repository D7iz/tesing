# IPA Library - File Upload

A simple web application for uploading and managing IPA files and associated resources.

## Features

- 📁 **File Upload**: Drag and drop or browse to upload files
- 🎯 **File Type Support**: IPA files, images (PNG, JPG), and JSON files
- 📊 **File Management**: View uploaded files with details (size, date)
- 🔗 **Download Links**: Direct download access to uploaded files
- 📱 **Responsive Design**: Clean, mobile-friendly interface
- 🔒 **File Validation**: Size limits and type restrictions

## Quick Start

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### API Endpoints

- `POST /upload` - Upload a file
- `GET /api/files` - List all uploaded files
- `GET /api/library/ore` - Get ore.json library data
- `GET /api/library/source` - Get source.json library data
- `GET /uploads/<filename>` - Download uploaded files

### Supported File Types

- `.ipa` - iOS App Package files
- `.png`, `.jpg`, `.jpeg` - Image files for icons
- `.json` - JSON configuration files

### File Size Limit

Maximum file size: **100MB**

## Usage

1. Open `http://localhost:3000` in your browser
2. Drag and drop files or click "Choose Files" to upload
3. View uploaded files in the "Uploaded Files" section
4. Click "Download" to access uploaded files

## File Structure

```
├── public/
│   └── index.html          # Web interface
├── uploads/                # Uploaded files storage
├── server.js              # Express server
├── package.json           # Dependencies
├── ore.json               # CyPwn IPA Library data
└── source.json            # swaggyP36000 IPA Library data
```
