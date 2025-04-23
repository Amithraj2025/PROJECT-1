const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  disease: String,
  medication: String,
  date: Date
});

module.exports = mongoose.model('Visit', visitSchema); 