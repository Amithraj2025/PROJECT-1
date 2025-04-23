const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');

// Add patient
router.post('/', async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const patient = new Patient({ name, phone, address });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all or search patients
router.get('/', async (req, res) => {
  const search = req.query.q || '';
  try {
    const patients = await Patient.find({
      $or: [
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ]
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get patient details & visits
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    const visits = await Visit.find({ patientId: patient._id });
    res.json({ patient, visits });
  } catch (err) {
    res.status(404).json({ error: 'Patient not found' });
  }
});

// Delete patient and associated visits
router.delete('/:id', async (req, res) => {
  try {
    // Delete all visits associated with the patient
    await Visit.deleteMany({ patientId: req.params.id });
    // Delete the patient
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient and associated visits deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add visit
router.post('/:id/visits', async (req, res) => {
  const { disease, medication, date } = req.body;
  try {
    const visit = new Visit({
      patientId: req.params.id,
      disease,
      medication,
      date
    });
    await visit.save();
    res.status(201).json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 