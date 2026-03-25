// Application controller – handles job application submissions and status updates
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc  Get all applications (admin/employer view)
// @route GET /api/applications
const getApplications = async (req, res) => {
  res.status(200).json({ message: 'getApplications – not yet implemented' });
};

// @desc  Get a single application by ID
// @route GET /api/applications/:id
const getApplicationById = async (req, res) => {
  res.status(200).json({ message: `getApplicationById ${req.params.id} – not yet implemented` });
};

// @desc  Submit a new job application
// @route POST /api/applications
/**
 * Creates a job application for a student while enforcing business rules.
 *
 * Expected body:
 * - job: Mongo ObjectId string (required)
 * - student: Mongo ObjectId string (required if req.user.id is unavailable)
 * - coverLetter: string up to 2000 chars (optional)
 *
 * Behavior and assumptions:
 * - Uses req.user.id when authenticated, otherwise falls back to body.student.
 * - Rejects duplicate student+job applications.
 * - Rejects applications for jobs that are missing or closed.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */

const createApplication = async (req, res) => {
  try {
    const { job, coverLetter, student } = req.body;
    const studentId = req.user?.id || student;

    if (!studentId || !job) {
      return res.status(400).json({ message: 'student and job are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(job)) {
      return res.status(400).json({ message: 'Invalid student or job ID format.' });
    }

    if (coverLetter && typeof coverLetter !== 'string') {
      return res.status(400).json({ message: 'coverLetter must be a string.' });
    }

    if (coverLetter && coverLetter.trim().length > 2000) {
      return res.status(400).json({ message: 'coverLetter cannot exceed 2000 characters.' });
    }

    const existingJob = await Job.findById(job);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (!existingJob.isOpen) {
      return res.status(400).json({ message: 'This job is no longer accepting applications.' });
    }

    // This preserves idempotent user intent: repeat submit should not create duplicates.
    const duplicate = await Application.findOne({ student: studentId, job });
    if (duplicate) {
      return res.status(409).json({ message: 'You have already applied to this job.' });
    }

    const application = await Application.create({
      student: studentId,
      job,
      coverLetter: coverLetter?.trim(),
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application.', error: error.message });
  }
};

// @desc  Update application status (e.g., accepted / rejected)
// @route PUT /api/applications/:id
const updateApplication = async (req, res) => {
  res.status(200).json({ message: `updateApplication ${req.params.id} – not yet implemented` });
};

// @desc  Delete/withdraw an application
// @route DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  res.status(200).json({ message: `deleteApplication ${req.params.id} – not yet implemented` });
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
