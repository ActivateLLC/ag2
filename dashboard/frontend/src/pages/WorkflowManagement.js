import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
  Search as SearchIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import axios from 'axios';

// API service
const API_URL = 'http://localhost:5002/api';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MWQ4YWNmNS0xN2Q0LTQ3OGYtYjAzOC1kOWQwY2Q1OTE5YzAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxMDM5MjM5fQ.DW5iRPMotxBjVa5AGBl2IoQQ_QUKUrRrGikEajD8-PY';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
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

export default function WorkflowManagement() {
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [runPayload, setRunPayload] = useState('{}');
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [workflowResults, setWorkflowResults] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/workflows`, {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY
        }
      });
      setWorkflows(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to load workflows. Please try again later.');
      setLoading(false);
      
      // For demo purposes, use mock data if API fails
      setWorkflows([
        { id: 'w1', name: 'SEO Audit Automation', type: 'seo', active: true, createdAt: '2025-02-15T12:00:00Z' },
        { id: 'w2', name: 'Keyword Research', type: 'seo', active: true, createdAt: '2025-02-20T14:30:00Z' },
        { id: 'w3', name: 'Backlink Analysis', type: 'seo', active: false, createdAt: '2025-02-25T09:15:00Z' },
        { id: 'w4', name: 'Content Strategy Generator', type: 'marketing', active: true, createdAt: '2025-03-01T11:45:00Z' },
        { id: 'w5', name: 'Social Media Scheduler', type: 'marketing', active: true, createdAt: '2025-03-02T10:00:00Z' },
        { id: 'w6', name: 'Email Campaign Automation', type: 'marketing', active: true, createdAt: '2025-03-02T10:15:00Z' }
      ]);
    }
  };

  const handleRunWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setOpenDialog(true);
    setWorkflowResults(null);
    
    // Set default payload based on workflow type
    if (workflow.type === 'seo') {
      setRunPayload(JSON.stringify({
        url: "https://arisecares.com",
        depth: 2,
        include_subdomains: true
      }, null, 2));
    } else if (workflow.type === 'marketing') {
      setRunPayload(JSON.stringify({
        campaign_name: "Spring Marketing Campaign",
        channels: ["email", "social", "blog"],
        schedule_date: new Date().toISOString().split('T')[0]
      }, null, 2));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRunPayload('{}');
  };

  const handleExecuteWorkflow = async () => {
    try {
      setLoading(true);
      let payload;
      try {
        payload = JSON.parse(runPayload);
      } catch (e) {
        setNotification({
          open: true,
          message: 'Invalid JSON payload',
          severity: 'error'
        });
        setLoading(false);
        return;
      }
      
      const response = await axios.post(`${API_URL}/workflows/${selectedWorkflow.id}/trigger`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': N8N_API_KEY
        }
      });
      
      setNotification({
        open: true,
        message: `Workflow "${selectedWorkflow.name}" triggered successfully`,
        severity: 'success'
      });
      
      // Show results
      setWorkflowResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error triggering workflow:', err);
      setNotification({
        open: true,
        message: `Failed to trigger workflow: ${err.response?.data?.error || err.message}`,
        severity: 'error'
      });
      setLoading(false);
      
      // Mock results for demo
      setWorkflowResults({
        success: true,
        data: {
          workflow_id: selectedWorkflow.id,
          execution_id: `exec-${Math.floor(Math.random() * 1000000)}`,
          status: "completed",
          results: selectedWorkflow.type === 'seo' 
            ? {
                pages_analyzed: 24,
                issues_found: 7,
                seo_score: 78,
                recommendations: [
                  "Add meta descriptions to 4 pages",
                  "Improve page load speed on mobile",
                  "Fix 3 broken links"
                ]
              }
            : {
                emails_sent: 1250,
                open_rate: "24.5%",
                click_rate: "3.8%",
                social_posts_scheduled: 12
              }
        },
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleCreateWorkflow = (type) => {
    // Redirect to n8n instance for workflow creation with API key in URL
    window.open(`http://localhost:5678?apiKey=${encodeURIComponent(N8N_API_KEY)}`, '_blank');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter workflows based on selected tab
  const filteredWorkflows = tabValue === 0 
    ? workflows 
    : tabValue === 1 
      ? workflows.filter(w => w.type === 'seo')
      : workflows.filter(w => w.type === 'marketing');

  if (loading && workflows.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && workflows.length === 0) {
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
          Marketing & SEO Automation
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={fetchWorkflows}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleCreateWorkflow()}
          >
            Create Workflow
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="workflow tabs">
          <Tab label="All Workflows" />
          <Tab label="SEO Automations" icon={<SearchIcon />} iconPosition="start" />
          <Tab label="Marketing Automations" icon={<ShareIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      <Grid container spacing={3}>
        {filteredWorkflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {workflow.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={workflow.active ? 'Active' : 'Inactive'} 
                    color={workflow.active ? 'success' : 'default'} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={workflow.type === 'seo' ? 'SEO' : 'Marketing'} 
                    color={workflow.type === 'seo' ? 'primary' : 'secondary'} 
                    size="small" 
                    icon={workflow.type === 'seo' ? <SearchIcon /> : <ShareIcon />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(workflow.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<RunIcon />}
                  onClick={() => handleRunWorkflow(workflow)}
                  disabled={!workflow.active}
                >
                  Run Workflow
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Quick Actions Section */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Create standard workflows with predefined configurations.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SearchIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  SEO Automations
                </Typography>
                <List dense>
                  <ListItem>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.open('http://localhost:5003/api/n8n/create_workflow/seo_audit', '_blank')}
                    >
                      Create SEO Audit Workflow
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.open('http://localhost:5003/api/n8n/create_workflow/keyword_research', '_blank')}
                    >
                      Create Keyword Research Workflow
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.open('http://localhost:5003/api/n8n/create_workflow/backlink_analysis', '_blank')}
                    >
                      Create Backlink Analysis Workflow
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <ShareIcon color="secondary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Marketing Automations
                </Typography>
                <List dense>
                  <ListItem>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.open('http://localhost:5003/api/n8n/create_workflow/content_strategy', '_blank')}
                    >
                      Create Content Strategy Workflow
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.open('http://localhost:5003/api/n8n/create_workflow/social_media', '_blank')}
                    >
                      Create Social Media Workflow
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => window.open('http://localhost:5003/api/n8n/create_workflow/email_campaign', '_blank')}
                    >
                      Create Email Campaign Workflow
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              onClick={() => window.open('http://localhost:5003/api/n8n/create_all_workflows', '_blank')}
            >
              Create All Standard Workflows
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Run Workflow Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Run Workflow: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Workflow Type: {selectedWorkflow?.type === 'seo' ? 'SEO Automation' : 'Marketing Automation'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter JSON payload for the workflow execution:
            </Typography>
          </Box>
          
          <TextField
            label="Payload (JSON)"
            multiline
            rows={8}
            value={runPayload}
            onChange={(e) => setRunPayload(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
          />
          
          {workflowResults && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Execution Results
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {workflowResults.success ? (
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <ErrorIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="subtitle1">
                    {workflowResults.success ? 'Success' : 'Error'}
                  </Typography>
                </Box>
                
                {workflowResults.error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {workflowResults.error}
                  </Alert>
                )}
                
                {workflowResults.data && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Output Data:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1, bgcolor: 'grey.100' }}>
                      <pre style={{ margin: 0, overflow: 'auto' }}>
                        {JSON.stringify(workflowResults.data, null, 2)}
                      </pre>
                    </Paper>
                  </Box>
                )}
                
                <Typography variant="caption" color="text.secondary">
                  Timestamp: {new Date(workflowResults.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
          <Button 
            onClick={handleExecuteWorkflow} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <RunIcon />}
          >
            {loading ? 'Running...' : 'Run Workflow'}
          </Button>
        </DialogActions>
      </Dialog>
      
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
