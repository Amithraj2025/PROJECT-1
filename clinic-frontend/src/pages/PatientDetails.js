import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [newVisit, setNewVisit] = useState({
    date: '',
    diagnosis: '',
    prescription: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const foundPatient = patients.find(p => p._id === id);
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      setSnackbar({
        open: true,
        message: 'Patient not found',
        severity: 'error'
      });
      setTimeout(() => navigate('/'), 2000);
    }
  }, [id, navigate]);

  const handleVisitChange = (e) => {
    setNewVisit({
      ...newVisit,
      [e.target.name]: e.target.value
    });
  };

  const handleAddVisit = (e) => {
    e.preventDefault();
    if (!newVisit.date || !newVisit.diagnosis) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const visit = {
      ...newVisit,
      _id: Date.now().toString()
    };

    const updatedPatient = {
      ...patient,
      visits: [...patient.visits, visit]
    };

    // Update localStorage
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const updatedPatients = patients.map(p => 
      p._id === patient._id ? updatedPatient : p
    );
    localStorage.setItem('patients', JSON.stringify(updatedPatients));

    setPatient(updatedPatient);
    setNewVisit({ date: '', diagnosis: '', prescription: '' });
    setSnackbar({
      open: true,
      message: 'Visit added successfully',
      severity: 'success'
    });
  };

  const handleDeleteVisit = (visitId) => {
    const updatedPatient = {
      ...patient,
      visits: patient.visits.filter(v => v._id !== visitId)
    };

    // Update localStorage
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const updatedPatients = patients.map(p => 
      p._id === patient._id ? updatedPatient : p
    );
    localStorage.setItem('patients', JSON.stringify(updatedPatients));

    setPatient(updatedPatient);
    setSnackbar({
      open: true,
      message: 'Visit deleted successfully',
      severity: 'success'
    });
  };

  if (!patient) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Patient Details
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Name:</strong> {patient.name}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {patient.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {patient.address || 'Not provided'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Add New Visit
        </Typography>
        <form onSubmit={handleAddVisit}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={newVisit.date}
            onChange={handleVisitChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Diagnosis"
            name="diagnosis"
            value={newVisit.diagnosis}
            onChange={handleVisitChange}
            margin="normal"
            required
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Prescription"
            name="prescription"
            value={newVisit.prescription}
            onChange={handleVisitChange}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Visit
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Visit History
        </Typography>
        {patient.visits.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No visits recorded yet.
          </Typography>
        ) : (
          <List>
            {patient.visits.map((visit) => (
              <Paper
                key={visit._id}
                elevation={1}
                sx={{ mb: 2, p: 2, borderRadius: 1 }}
              >
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteVisit(visit._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={new Date(visit.date).toLocaleDateString()}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          <strong>Diagnosis:</strong> {visit.diagnosis}
                        </Typography>
                        {visit.prescription && (
                          <Typography variant="body2" color="text.primary">
                            <strong>Prescription:</strong> {visit.prescription}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PatientDetails; 