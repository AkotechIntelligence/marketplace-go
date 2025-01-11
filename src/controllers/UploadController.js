const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../logger');

class UploadController {
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                // Get subdirectory from request or use default
                const uploadDir = req.uploadDir || 'default';
                const fullPath = path.join('public/uploads', uploadDir);

                // Create directory if it doesn't exist
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }

                cb(null, fullPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        });

        this.fileFilter = (req, file, cb) => {
            // Validate file type
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        };

        this.limits = {
            fileSize: 5 * 1024 * 1024 // 5MB
        };
    }

    // Create multer upload instance with custom directory
    getUploader(subDir, fieldName = 'file') {
        return [
            // Middleware to set upload directory
            (req, res, next) => {
                req.uploadDir = subDir;
                next();
            },
            // Multer upload middleware
            multer({
                storage: this.storage,
                fileFilter: this.fileFilter,
                limits: this.limits
            }).single(fieldName)
        ];
    }

    // Create multer upload instance for multiple files
    getMultiUploader(subDir, fieldName = 'files', maxCount = 5) {
        return [
            // Middleware to set upload directory
            (req, res, next) => {
                req.uploadDir = subDir;
                next();
            },
            // Multer upload middleware
            multer({
                storage: this.storage,
                fileFilter: this.fileFilter,
                limits: this.limits
            }).array(fieldName, maxCount)
        ];
    }

    // Handle file deletion
    async deleteFile(filePath) {
        try {
            const fullPath = path.join('public/uploads', filePath);
            if (fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
                logger.info(`File deleted successfully: ${filePath}`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error(`Error deleting file: ${error.message}`, { error });
            return false;
        }
    }
}

module.exports = new UploadController();