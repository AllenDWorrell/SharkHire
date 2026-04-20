// Resume controller – handles GridFS resume uploads and downloads
const mongoose = require('mongoose');
const { Readable } = require('stream');
const Application = require('../models/Application');
const Job = require('../models/Job');

const getGridFSBucket = () =>
  new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'resumes' });

// @desc  Upload a resume file to GridFS
// @route POST /api/resumes
const uploadResume = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const bucket = getGridFSBucket();
    const filename = `${Date.now()}-${req.file.originalname}`;

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    // Stream the in-memory buffer into GridFS
    const readable = Readable.from(req.file.buffer);
    readable.pipe(uploadStream);

    uploadStream.on('finish', () => {
      res.status(201).json({ fileId: uploadStream.id, filename });
    });

    uploadStream.on('error', (err) => {
      res.status(500).json({ message: 'Failed to store resume.', error: err.message });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload resume.', error: error.message });
  }
};

// @desc  Download a resume by GridFS file ID
// @route GET /api/resumes/:fileId
const downloadResume = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: 'Invalid file ID.' });
    }

    const fileObjectId = new mongoose.Types.ObjectId(fileId);

    // Authorization: verify the requesting user has access to this resume
    const application = await Application.findOne({ resumeId: fileObjectId });
    if (!application) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    if (req.user.role === 'student') {
      if (application.student.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized.' });
      }
    } else if (req.user.role === 'employer') {
      const job = await Job.findById(application.job);
      if (!job || job.employer.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized.' });
      }
    }

    const bucket = getGridFSBucket();
    const files = await bucket.find({ _id: fileObjectId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: 'File not found in storage.' });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    bucket.openDownloadStream(fileObjectId).pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to download resume.', error: error.message });
  }
};

module.exports = { uploadResume, downloadResume };
