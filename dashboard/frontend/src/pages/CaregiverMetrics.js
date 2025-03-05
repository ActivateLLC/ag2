import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';

// API service
const API_URL = 'http://localhost:5002/api';

export default function CaregiverMetrics() {
  const [loading, setLoading] = useState(true);
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        setLoading(true);
        
        // Fetch all caregivers
        const response = await axios.get(`${API_URL}/metrics/caregivers`);
        setCaregivers(response.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching caregivers:', err);
        setError('Failed to load caregiver data. Please try again later.');
        setLoading(false);
        
        // Mock data for development
        setCaregivers([
          { id: 'CG001', name: 'John Smith', role: 'Home Health Aide', overall_score: 91.8 },
          { id: 'CG002', name: 'Maria Garcia', role: 'Registered Nurse', overall_score: 95.0 },
          { id: 'CG003', name: 'David Johnson', role: 'Personal Care Assistant', overall_score: 88.4 }
        ]);
      }
    };
    
    fetchCaregivers();
  }, []);

  const fetchCaregiverDetails = async (caregiverId) => {
    try {
      setLoading(true);
      
      // Fetch caregiver details
      const response = await axios.get(`${API_URL}/metrics/caregiver/${caregiverId}`);
      setSelectedCaregiver(response.data);
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching caregiver ${caregiverId}:`, err);
      setError(`Failed to load details for caregiver ${caregiverId}. Please try again later.`);
      setLoading(false);
    }
  };

  const filteredCaregivers = caregivers.filter(caregiver => 
    caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caregiver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caregiver.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare radar chart data if a caregiver is selected
  const radarChartData = selectedCaregiver ? {
    labels: Object.keys(selectedCaregiver.metrics).map(key => 
      key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ),
    datasets: [
      {
        label: 'Score',
        data: Object.values(selectedCaregiver.metrics).map(metric => metric.score),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Benchmark',
        data: Object.values(selectedCaregiver.metrics).map(metric => metric.benchmark),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
      }
    ],
  } : null;

  const getTrendIcon = (trend) => {
    if (trend.startsWith('+')) {
      return <TrendingUpIcon color="success" />;
    } else if (trend.startsWith('-')) {
      return <TrendingDownIcon color="error" />;
    } else {
      return <TrendingFlatIcon color="info" />;
    }
  };

  if (loading && caregivers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && caregivers.length === 0) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Caregiver Metrics
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search caregivers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedCaregiver ? 6 : 12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Overall Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCaregivers.map((caregiver) => (
                  <TableRow 
                    key={caregiver.id}
                    hover
                    onClick={() => fetchCaregiverDetails(caregiver.id)}
                    sx={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedCaregiver?.id === caregiver.id ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                    }}
                  >
                    <TableCell>{caregiver.id}</TableCell>
                    <TableCell>{caregiver.name}</TableCell>
                    <TableCell>{caregiver.role}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${caregiver.overall_score.toFixed(1)}%`}
                        color={caregiver.overall_score >= 90 ? 'success' : caregiver.overall_score >= 80 ? 'primary' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        {selectedCaregiver && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {selectedCaregiver.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {selectedCaregiver.role} | ID: {selectedCaregiver.id}
                </Typography>
                
                <Box sx={{ height: 300, mb: 4 }}>
                  <Radar 
                    data={radarChartData} 
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          min: 70,
                          max: 100,
                          ticks: {
                            stepSize: 10
                          }
                        }
                      }
                    }} 
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Detailed Metrics
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Score</TableCell>
                        <TableCell align="right">Benchmark</TableCell>
                        <TableCell align="right">Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(selectedCaregiver.metrics).map(([key, metric]) => (
                        <TableRow key={key}>
                          <TableCell>
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </TableCell>
                          <TableCell align="right">{metric.score}%</TableCell>
                          <TableCell align="right">{metric.benchmark}%</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              {metric.trend}
                              {getTrendIcon(metric.trend)}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
