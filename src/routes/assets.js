const express = require('express');
const multer = require('multer');
const path = require('path');
const { validateAsset } = require('../middleware/validation');
const { createAsset, getAllAssets, getAssetById, updateAsset, deleteAsset } = require('../controllers/assetController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'asset-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes
router.post('/', upload.single('image'), validateAsset, createAsset);
router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.put('/:id', upload.single('image'), validateAsset, updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;