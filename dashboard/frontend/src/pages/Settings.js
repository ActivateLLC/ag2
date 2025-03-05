import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Tab,
  Tabs
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import axios from 'axios';

// API service
const API_URL = 'http://localhost:5002/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [settings, setSettings] = useState({
    n8n: {
      url: 'http://localhost:5678',
      apiKey: '',
      webhookBaseUrl: 'http://localhost:5003'
    },
    ag2Connector: {
      url: 'http://localhost:5003',
      enableLogging: true,
      logLevel: 'info'
    },
    dashboard: {
      refreshInterval: 5,
      enableRealTimeUpdates: true,
      defaultView: 'dashboard'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/settings`);
      setSettings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setNotification({
        open: true,
        message: 'Failed to load settings. Using default values.',
        severity: 'warning'
      });
      setLoading(false);
      // Continue with default settings
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/settings`, settings);
      setNotification({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
      setLoading(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      setNotification({
        open: true,
        message: 'Failed to save settings. Please try again.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (section, key, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  const handleTestConnection = async (service) => {
    try {
      setLoading(true);
      let url;
      
      if (service === 'n8n') {
        url = settings.n8n.url;
      } else if (service === 'ag2Connector') {
        url = settings.ag2Connector.url;
      }
      
      await axios.get(`${API_URL}/test-connection?url=${encodeURIComponent(url)}`);
      
      setNotification({
        open: true,
        message: `Connection to ${service === 'n8n' ? 'n8n' : 'AG2 Connector'} successful`,
        severity: 'success'
      });
      
      setLoading(false);
    } catch (err) {
      console.error(`Error testing ${service} connection:`, err);
      setNotification({
        open: true,
        message: `Connection to ${service === 'n8n' ? 'n8n' : 'AG2 Connector'} failed: ${err.response?.data?.error || err.message}`,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab label="n8n Integration" />
          <Tab label="AG2 Connector" />
          <Tab label="Dashboard" />
        </Tabs>
      </Box>
      
      {/* n8n Integration Settings */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              n8n Integration Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure the connection to your n8n instance.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="n8n URL"
                  value={settings.n8n.url}
                  onChange={(e) => handleSettingChange('n8n', 'url', e.target.value)}
                  fullWidth
                  margin="normal"
                  helperText="The URL of your n8n instance (e.g., http://localhost:5678)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="API Key"
                  value={settings.n8n.apiKey}
                  onChange={(e) => handleSettingChange('n8n', 'apiKey', e.target.value)}
                  fullWidth
                  margin="normal"
                  type="password"
                  helperText="Your n8n API key for authentication (leave empty for local development)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Webhook Base URL"
                  value={settings.n8n.webhookBaseUrl}
                  onChange={(e) => handleSettingChange('n8n', 'webhookBaseUrl', e.target.value)}
                  fullWidth
                  margin="normal"
                  helperText="The base URL for webhook callbacks (e.g., http://localhost:5003)"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => handleTestConnection('n8n')}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                  Test Connection
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      
      {/* AG2 Connector Settings */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AG2 Connector Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure the connection to the AG2 connector service.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="AG2 Connector URL"
                  value={settings.ag2Connector.url}
                  onChange={(e) => handleSettingChange('ag2Connector', 'url', e.target.value)}
                  fullWidth
                  margin="normal"
                  helperText="The URL of your AG2 connector service (e.g., http://localhost:5003)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Log Level"
                  value={settings.ag2Connector.logLevel}
                  onChange={(e) => handleSettingChange('ag2Connector', 'logLevel', e.target.value)}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  fullWidth
                  margin="normal"
                  helperText="The logging level for the AG2 connector"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.ag2Connector.enableLogging}
                      onChange={(e) => handleSettingChange('ag2Connector', 'enableLogging', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Detailed Logging"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => handleTestConnection('ag2Connector')}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                  Test Connection
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      
      {/* Dashboard Settings */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dashboard Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure the behavior and appearance of the dashboard.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Data Refresh Interval (minutes)"
                  value={settings.dashboard.refreshInterval}
                  onChange={(e) => handleSettingChange('dashboard', 'refreshInterval', parseInt(e.target.value) || 0)}
                  type="number"
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1, max: 60 }}
                  helperText="How often the dashboard data should refresh (in minutes)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Default View"
                  value={settings.dashboard.defaultView}
                  onChange={(e) => handleSettingChange('dashboard', 'defaultView', e.target.value)}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  fullWidth
                  margin="normal"
                  helperText="The default page to show when opening the dashboard"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="caregiverMetrics">Caregiver Metrics</option>
                  <option value="workflowManagement">Workflow Management</option>
                  <option value="reports">Reports</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.dashboard.enableRealTimeUpdates}
                      onChange={(e) => handleSettingChange('dashboard', 'enableRealTimeUpdates', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Real-Time Updates"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSettings}
          disabled={loading}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSaveSettings}
          disabled={loading}
        >
          Save Settings
        </Button>
      </Box>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
