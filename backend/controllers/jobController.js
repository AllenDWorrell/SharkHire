// Job controller – handles CRUD operations for job listings
const mongoose = require('mongoose');
const Job = require('../models/Job');

// @desc  Get all job listings
// @route GET /api/jobs
/**
 * Returns a job list with optional query-based filtering for discovery screens.
 *
 * Expected query params:
 * - type: 'NSE' | 'FWS'
 * - isOpen: 'true' | 'false' (string form, converted to boolean)
 * - location: free-text partial match (case-insensitive)
 * - search: free-text keyword match against title and description
 *
 * Assumptions/limitations:
 * - Text filters use regex and are not full-text indexed search.
 * - Results are sorted newest-first to align with typical job-feed behavior.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */

// Jobs: filtering + newest-first sorting
const getJobs = async (req, res) => {
  try {
    const { type, isOpen, search, location } = req.query;
    const filters = {};

    // Filter for if job is NSE or FWS
    if (type) {
      if (!['NSE', 'FWS'].includes(type)) {
        return res.status(400).json({ message: 'Invalid job type. Use NSE or FWS.' });
      }
      filters.type = type;
    }
    // Filter for if job is open or closed
    if (typeof isOpen !== 'undefined') {
      if (isOpen !== 'true' && isOpen !== 'false') {
        return res.status(400).json({ message: 'Invalid isOpen value. Use true or false.' });
      }
      filters.isOpen = isOpen === 'true';
    }

    // Filter for location
    if (location) {
      filters.location = { $regex: location.trim(), $options: 'i' };
    }

    // Filter for search keyword in title or description
    if (search) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filters.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Execute query with filters and sort by newest first
    const jobs = await Job.find(filters).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve job listings.', error: error.message });
  }
};

// @desc  Get a single job by ID
// @route GET /api/jobs/:id
/**
 * Fetches one job by id, with early validation to avoid unnecessary DB work.
 *
 * @param {import('express').Request} req - req.params.id must be a Mongo ObjectId string.
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID format.' });
    }

    // Find job by ID after validating ID format
    // This will return null if not found, which we handle with a 404 response.
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve job.', error: error.message });
  }
};

// @desc  Create a new job listing
// @route POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, description, type, location, hoursPerWeek } = req.body;

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'title, description, and type are required' });
    }

    // Validate job type
    if (!['NSE', 'FWS'].includes(type)) {
      return res.status(400).json({ message: 'Invalid job type. Use NSE or FWS.' });
    }

    // Create job (employer is current authenticated user)
    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      type,
      employer: req.user.id,
      location: location ? location.trim() : '',
      hoursPerWeek: hoursPerWeek || 0,
      isOpen: true,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// @desc  Update a job listing
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, location, hoursPerWeek, isOpen } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID format.' });
    }

    // Check if job exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Verify the user is the job owner (employer)
    if (job.employer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Update fields if provided
    if (title) job.title = title.trim();
    if (description) job.description = description.trim();
    if (type) {
      if (!['NSE', 'FWS'].includes(type)) {
        return res.status(400).json({ message: 'Invalid job type. Use NSE or FWS.' });
      }
      job.type = type;
    }
    if (location !== undefined) job.location = location ? location.trim() : '';
    if (hoursPerWeek !== undefined) job.hoursPerWeek = hoursPerWeek;
    if (isOpen !== undefined) job.isOpen = isOpen;

    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

// @desc  Delete a job listing
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job ID format.' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Verify the user is the job owner (employer)
    if (job.employer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
