import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Avatar,
  Chip,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

function Home() {
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPatients = useCallback(async () => {
    try {
      const res = await api.get(`/patients?q=${search}`);
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: `Error fetching patients: ${err.response?.data?.error || err.message}`,
        severity: 'error'
      });
    }
  }, [search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDeleteClick = (patient, event) => {
    event.preventDefault();
    event.stopPropagation();
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Attempting to delete patient:', patientToDelete._id);
      const response = await api.delete(`/patients/${patientToDelete._id}`);
      console.log('Delete response:', response.data);
      
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Patient deleted successfully',
        severity: 'success'
      });
      
      // Update the patients list without fetching
      setPatients(patients.filter(p => p._id !== patientToDelete._id));
    } catch (err) {
      console.error('Error deleting patient:', err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: `Error deleting patient: ${err.response?.data?.error || err.message}`,
        severity: 'error'
      });
    }
  };

  const handleDownload = () => {
    try {
      // Format the data for the text file
      const formattedData = patients.map(patient => {
        return `Patient Details:
Name: ${patient.name}
Phone: ${patient.phone}
Address: ${patient.address || 'Not provided'}
ID: ${patient._id}
----------------------------------------`;
      }).join('\n\n');

      // Create a blob with the data
      const blob = new Blob([formattedData], { type: 'text/plain' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient_details_${new Date().toISOString().split('T')[0]}.txt`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSnackbar({
        open: true,
        message: 'Patient details downloaded successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error downloading patient details:', err);
      setSnackbar({
        open: true,
        message: 'Error downloading patient details',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          Clinic Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Download all patient details">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.primary.light,
                }
              }}
            >
              Download
            </Button>
          </Tooltip>
          <Button
            component={Link}
            to="/add"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              }
            }}
          >
            Add New Patient
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {patients.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Card 
              component={Link}
              to={`/patient/${p._id}`}
              sx={{
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                      mr: 2
                    }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {p.name}
                    </Typography>
                    <Chip
                      icon={<PhoneIcon />}
                      label={p.phone}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {p.address || 'No address provided'}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={(e) => handleDeleteClick(p, e)}
                  sx={{ 
                    color: theme.palette.error.main,
                    '&:hover': {
                      bgcolor: theme.palette.error.light,
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Patient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {patientToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Home; 