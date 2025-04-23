import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Grid
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import axios from 'axios';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [visitForm, setVisitForm] = useState({
    disease: '',
    medication: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
      setPatient(res.data.patient);
      setVisits(res.data.visits);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setVisitForm({ ...visitForm, [e.target.name]: e.target.value });
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/patients/${id}/visits`, visitForm);
    setVisitForm({ disease: '', medication: '', date: new Date().toISOString().split('T')[0] });
    const updated = await axios.get(`http://localhost:5000/api/patients/${id}`);
    setVisits(updated.data.visits);
  };

  if (!patient) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {patient.name}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
            <Typography><strong>Phone:</strong> {patient.phone}</Typography>
            <Typography><strong>Address:</strong> {patient.address}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add Visit
            </Typography>
            <form onSubmit={handleAddVisit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Disease"
                    name="disease"
                    value={visitForm.disease}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medication"
                    name="medication"
                    value={visitForm.medication}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Date"
                    name="date"
                    value={visitForm.date}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">
                    Add Visit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Visit History
            </Typography>
            <List>
              {visits.map((visit) => (
                <ListItem key={visit._id}>
                  <ListItemText
                    primary={visit.disease}
                    secondary={`${new Date(visit.date).toLocaleDateString()} - ${visit.medication}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PatientDetails; 