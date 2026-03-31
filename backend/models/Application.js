// Application model – tracks student job applications
// TODO: Expand schema as requirements are finalized
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    // Status progression: pending -> reviewed -> accepted | rejected
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    coverLetter: { type: String },
  },
  { timestamps: true, collection: 'Applications' }
);

module.exports = mongoose.model('Application', applicationSchema);
