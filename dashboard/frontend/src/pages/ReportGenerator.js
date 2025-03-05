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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Article as ArticleIcon,
  Insights as InsightsIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  DateRange as DateRangeIcon,
  CompareArrows as CompareArrowsIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

// API service
const API_URL = 'http://localhost:5002/api';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ReportGenerator() {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('seo_performance');
  const [website, setWebsite] = useState('https://arisecares.com');
  const [competitors, setCompetitors] = useState('');
  const [keywords, setKeywords] = useState('');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare request data based on report type
      const requestData = {
        report_type: reportType,
        website: website,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      };
      
      if (competitors) {
        requestData.competitors = competitors.split(',').map(c => c.trim());
      }
      
      if (keywords) {
        requestData.keywords = keywords.split(',').map(k => k.trim());
      }
      
      // Call API to generate report
      const response = await axios.post(`${API_URL}/reports/generate`, requestData);
      setReportData(response.data);
      
      setNotification({
        open: true,
        message: 'Report generated successfully!',
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again later.');
      setLoading(false);
      
      // For demo purposes, use mock data if API fails
      generateMockReportData();
    }
  };

  const generateMockReportData = () => {
    // Mock report data for demo purposes
    const mockReportData = {
      report_type: reportType,
      website: website,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      competitors: competitors ? competitors.split(',').map(c => c.trim()) : [],
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
    };
    
    setReportData(mockReportData);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          SEO & Marketing Reports
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="All Reports" />
          <Tab label="SEO Reports" icon={<SearchIcon />} iconPosition="start" />
          <Tab label="Marketing Reports" icon={<ShareIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Report Generator Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Generate New Report
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                label="Report Type"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="seo_performance">SEO Performance Report</MenuItem>
                <MenuItem value="keyword_rankings">Keyword Rankings Report</MenuItem>
                <MenuItem value="competitor_analysis">Competitor Analysis Report</MenuItem>
                <MenuItem value="content_performance">Content Performance Report</MenuItem>
                <MenuItem value="social_media_analytics">Social Media Analytics Report</MenuItem>
                <MenuItem value="email_performance">Email Campaign Performance Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Grid>
          
          {(reportType === 'competitor_analysis' || reportType === 'keyword_rankings') && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Competitors (comma separated)"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
              />
            </Grid>
          )}
          
          {(reportType === 'keyword_rankings' || reportType === 'seo_performance') && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Keywords (comma separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
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
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Report Data */}
      {reportData && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Report Data
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1" gutterBottom>
                Report Type: {reportData.report_type}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1" gutterBottom>
                Website: {reportData.website}
              </Typography>
            </Grid>
            
            {(reportType === 'competitor_analysis' || reportType === 'keyword_rankings') && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" gutterBottom>
                  Competitors: {reportData.competitors.join(', ')}
                </Typography>
              </Grid>
            )}
            
            {(reportType === 'keyword_rankings' || reportType === 'seo_performance') && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body1" gutterBottom>
                  Keywords: {reportData.keywords.join(', ')}
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1" gutterBottom>
                Start Date: {reportData.start_date}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1" gutterBottom>
                End Date: {reportData.end_date}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SearchIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  SEO Quick Actions
                </Typography>
                <List>
                  <ListItem button onClick={() => {
                    setReportType('seo_performance');
                    setTabValue(0);
                  }}>
                    <ListItemIcon>
                      <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Generate SEO Performance Report" />
                  </ListItem>
                  <ListItem button onClick={() => {
                    setReportType('keyword_rankings');
                    setTabValue(0);
                  }}>
                    <ListItemIcon>
                      <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Check Keyword Rankings" />
                  </ListItem>
                  <ListItem button onClick={() => {
                    setReportType('competitor_analysis');
                    setTabValue(0);
                  }}>
                    <ListItemIcon>
                      <CompareArrowsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Analyze Competitors" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <ShareIcon color="secondary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Marketing Quick Actions
                </Typography>
                <List>
                  <ListItem button onClick={() => {
                    setReportType('content_performance');
                    setTabValue(0);
                  }}>
                    <ListItemIcon>
                      <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Analyze Content Performance" />
                  </ListItem>
                  <ListItem button onClick={() => {
                    setReportType('social_media_analytics');
                    setTabValue(0);
                  }}>
                    <ListItemIcon>
                      <ShareIcon />
                    </ListItemIcon>
                    <ListItemText primary="Social Media Analytics" />
                  </ListItem>
                  <ListItem button onClick={() => {
                    setReportType('email_performance');
                    setTabValue(0);
                  }}>
                    <ListItemIcon>
                      <InsightsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email Campaign Performance" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Integration with AG2 Connector */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          AG2 Connector Integration
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info">
              This dashboard integrates with the AG2 connector API to provide real-time SEO and marketing data.
              The following endpoints are available:
            </Alert>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="SEO Audit Endpoint" 
                  secondary="http://localhost:5002/api/ag2/seo_audit"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Content Strategy Endpoint" 
                  secondary="http://localhost:5002/api/ag2/content_strategy"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ShareIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Marketing Campaign Endpoint" 
                  secondary="http://localhost:5002/api/ag2/marketing_campaign"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}