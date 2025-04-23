import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
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

// Sample data
const samplePatients = [
  {
    _id: '1',
    name: 'John Doe',
    phone: '1234567890',
    address: '123 Main St',
    visits: []
  },
  {
    _id: '2',
    name: 'Jane Smith',
    phone: '0987654321',
    address: '456 Oak Ave',
    visits: []
  }
];

function Home() {
  const theme = useTheme();
  const [patients, setPatients] = useState(() => {
    // Initialize with sample data if localStorage is empty
    const storedPatients = JSON.parse(localStorage.getItem('patients'));
    if (!storedPatients || storedPatients.length === 0) {
      localStorage.setItem('patients', JSON.stringify(samplePatients));
      return samplePatients;
    }
    return storedPatients;
  });
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.phone.includes(search)
  );

  const handleDeleteClick = (patient, event) => {
    event.preventDefault();
    event.stopPropagation();
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedPatients = patients.filter(p => p._id !== patientToDelete._id);
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    setDeleteDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Patient deleted successfully',
      severity: 'success'
    });
  };

  const handleDownload = () => {
    try {
      const formattedData = patients.map(patient => {
        return `Patient Details:
Name: ${patient.name}
Phone: ${patient.phone}
Address: ${patient.address || 'Not provided'}
ID: ${patient._id}
----------------------------------------`;
      }).join('\n\n');

      const blob = new Blob([formattedData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patient_details_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
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
        {filteredPatients.map((p) => (
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
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                    {p.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" component="div">
                    {p.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    {p.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    {p.address || 'No address provided'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Patient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {patientToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default Home; 