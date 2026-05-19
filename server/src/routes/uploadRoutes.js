const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  // If uploaded to Cloudinary, req.file.path holds the secure remote URL
  // If uploaded locally, we return the relative serving path
  const fileUrl = req.file.path.startsWith('http')
    ? req.file.path
    : `http://localhost:5000/uploads/${req.file.filename}`;

  res.status(201).json({
    message: 'Image uploaded successfully!',
    url: fileUrl
  });
});

module.exports = router;
