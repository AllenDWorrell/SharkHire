// Job model – represents NSE and FWS job listings
// TODO: Expand schema as requirements are finalized
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Job type: 'NSE' (Nova Student Employment) or 'FWS' (Federal Work-Study)
    type: { type: String, enum: ['NSE', 'FWS'], required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String },
    hoursPerWeek: { type: Number },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'Jobs' }
);

module.exports = mongoose.model('Job', jobSchema);
