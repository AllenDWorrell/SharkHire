// Application controller – handles job application submissions and status updates
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc  Get all applications (admin/employer view)
// @route GET /api/applications
const getApplications = async (req, res) => {
  try {
    // If user is employer, filter by their job postings
    // Otherwise, filter by student ID
    let filters = {};
    
    if (req.user.role === 'employer') {
      // Get all jobs posted by this employer
      const Job = require('../models/Job');
      const employerJobs = await Job.find({ employer: req.user.id }).select('_id');
      const jobIds = employerJobs.map(job => job._id);
      filters.job = { $in: jobIds };
    } else if (req.user.role === 'student') {
      // Get only this student's applications
      filters.student = req.user.id;
    }

    const applications = await Application.find(filters)
      .populate('student', 'name email')
      .populate('job', 'title description')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve applications', error: error.message });
  }
};

// @desc  Get a single application by ID
// @route GET /api/applications/:id
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application ID format.' });
    }

    const application = await Application.findById(id)
      .populate('student', 'name email')
      .populate('job', 'title description');

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve application', error: error.message });
  }
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
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application ID format.' });
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use pending, reviewed, accepted, or rejected.' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Verify user has permission (must be employer of the job)
    const job = await Job.findById(application.job);
    if (job.employer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
};

// @desc  Delete/withdraw an application
// @route DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application ID format.' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Verify user has permission (student who submitted or employer)
    const isStudent = application.student.toString() === req.user.id.toString();
    let isEmployer = false;

    if (!isStudent) {
      const job = await Job.findById(application.job);
      isEmployer = job.employer.toString() === req.user.id.toString();
    }

    if (!isStudent && !isEmployer) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(id);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete application', error: error.message });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
