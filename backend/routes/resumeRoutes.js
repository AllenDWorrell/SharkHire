// Resume routes – /api/resumes
const express = require('express');
const router = express.Router();
const upload = require('../config/gridfs');
const { uploadResume, downloadResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('resume'), uploadResume);
router.get('/:fileId', protect, downloadResume);

module.exports = router;
