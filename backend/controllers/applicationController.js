// Application controller – handles job application submissions and status updates
// TODO: Connect to MongoDB Application model

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
const createApplication = async (req, res) => {
  res.status(201).json({ message: 'createApplication – not yet implemented' });
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
