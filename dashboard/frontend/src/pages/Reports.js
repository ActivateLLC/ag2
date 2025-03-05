import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip
} from '@mui/material';
import {
  Description as ReportIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

// API service
const API_URL = 'http://localhost:5002/api';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('performance');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        type: reportType,
        date_range: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        }
      };
      
      const response = await axios.post(`${API_URL}/reports/generate`, payload);
      setReport(response.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again later.');
      setLoading(false);
      
      // Mock data for demo
      if (reportType === 'performance') {
        setReport({
          type: 'performance',
          generated_at: new Date().toISOString(),
          date_range: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          },
          data: {
            summary: {
              overall_score: 91,
              improvement: "+2%",
              areas_of_concern: ["visit_timeliness", "medication_management"],
              strengths: ["documentation_quality", "client_satisfaction"]
            },
            caregivers: {
              top_performers: ["CG002", "CG003", "CG007"],
              needs_improvement: ["CG004", "CG009"]
            },
            recommendations: [
              "Provide additional training on medication management",
              "Implement visit scheduling optimization",
              "Recognize top performers with monthly awards"
            ]
          }
        });
      } else if (reportType === 'compliance') {
        setReport({
          type: 'compliance',
          generated_at: new Date().toISOString(),
          date_range: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          },
          data: {
            summary: {
              overall_compliance: 87,
              improvement: "+1%",
              areas_of_concern: ["documentation_timeliness"],
              strengths: ["visit_completion", "care_plan_adherence"]
            },
            caregivers: {
              top_performers: ["CG001", "CG005", "CG008"],
              needs_improvement: ["CG006", "CG010"]
            },
            recommendations: [
              "Implement mobile documentation tools",
              "Provide documentation templates",
              "Schedule regular compliance reviews"
            ]
          }
        });
      }
    }
  };

  const handleDownloadReport = () => {
    // In a real implementation, this would generate a PDF or Excel file
    alert('Report download functionality would be implemented here.');
  };

  const handleShareReport = () => {
    // In a real implementation, this would open a sharing dialog
    alert('Report sharing functionality would be implemented here.');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.href = '/report-generator'}
            sx={{ mr: 2 }}
          >
            SEO & Marketing Reports
          </Button>
        </Box>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Generate Report
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="performance">Performance Report</MenuItem>
                <MenuItem value="compliance">Compliance Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleGenerateReport}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <ReportIcon />}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {report && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {reportType === 'performance' ? 'Performance Report' : 'Compliance Report'}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadReport}
                sx={{ mr: 1 }}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShareReport}
              >
                Share
              </Button>
            </Box>
          </Box>
          
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Date Range: {new Date(report.date_range.start).toLocaleDateString()} - {new Date(report.date_range.end).toLocaleDateString()}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      Overall {reportType === 'performance' ? 'Score' : 'Compliance'}: {
                        reportType === 'performance' 
                          ? report.data.summary.overall_score 
                          : report.data.summary.overall_compliance
                      }%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Improvement: {
                        reportType === 'performance' 
                          ? report.data.summary.improvement 
                          : report.data.summary.improvement
                      }
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Areas of Concern:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {report.data.summary.areas_of_concern.map((area) => (
                      <Chip
                        key={area}
                        label={area.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        color="error"
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Strengths:
                  </Typography>
                  <Box>
                    {report.data.summary.strengths.map((strength) => (
                      <Chip
                        key={strength}
                        label={strength.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        color="success"
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Caregivers
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Top Performers:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {report.data.caregivers.top_performers.map((caregiver) => (
                      <Chip
                        key={caregiver}
                        label={caregiver}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Needs Improvement:
                  </Typography>
                  <Box>
                    {report.data.caregivers.needs_improvement.map((caregiver) => (
                      <Chip
                        key={caregiver}
                        label={caregiver}
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  
                  <List>
                    {report.data.recommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Generated: {new Date(report.generated_at).toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
