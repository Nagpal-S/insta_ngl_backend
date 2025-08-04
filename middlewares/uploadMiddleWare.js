const multer = require("multer");
const path = require("path");

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Images
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        'image/tiff',
        'image/x-icon',

        // PDF
        'application/pdf',

        // Word Docs
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

        // Excel
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

        // PowerPoint
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',

        // Text files
        'text/plain',
        'text/csv',
        'text/html',

        // Archives
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/gzip',

        // JSON
        'application/json',

        // Audio (if needed)
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',

        // Video (if needed)
        'video/mp4',
        'video/x-msvideo',
        'video/x-matroska',

        // Any other binary files
        'application/octet-stream',

        'image/heic',
        'image/heif'

    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

// Configure Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter,
}).single("image"); // Ensure 'image' matches the key in Postman

module.exports = upload;
