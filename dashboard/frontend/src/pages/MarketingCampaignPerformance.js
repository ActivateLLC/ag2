import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Alert,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import EmailIcon from '@mui/icons-material/Email';
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Mock data for initial display - will be replaced with real API data
const mockCampaignData = {
  campaigns: [
    {
      id: 'spring2025',
      name: 'Spring 2025 Promotion',
      startDate: '2025-03-01',
      endDate: '2025-04-30',
      status: 'active',
      metrics: {
        impressions: 15420,
        clicks: 1250,
        conversions: 68,
        ctr: 8.1,
        conversionRate: 5.44,
        roi: 320
      }
    },
    {
      id: 'caregiver2025',
      name: 'Caregiver Recruitment Drive',
      startDate: '2025-02-15',
      endDate: '2025-03-15',
      status: 'completed',
      metrics: {
        impressions: 12800,
        clicks: 980,
        conversions: 45,
        ctr: 7.65,
        conversionRate: 4.59,
        roi: 280
      }
    },
    {
      id: 'family2025',
      name: 'Family Support Webinar Series',
      startDate: '2025-04-01',
      endDate: '2025-05-31',
      status: 'scheduled',
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        roi: 0
      }
    }
  ],
  emailMetrics: {
    campaigns: [
      { name: 'March Newsletter', sent: 2500, opened: 1250, clicked: 375, openRate: 50, clickRate: 30 },
      { name: 'Caregiver Spotlight', sent: 2450, opened: 1470, clicked: 490, openRate: 60, clickRate: 33.3 },
      { name: 'Spring Promotion', sent: 2600, opened: 1300, clicked: 520, openRate: 50, clickRate: 40 }
    ],
    overall: {
      totalSent: 7550,
      averageOpenRate: 53.3,
      averageClickRate: 34.4,
      growthRate: 5.2
    }
  },
  contactList: {
    totalContacts: 4850,
    newContactsLastMonth: 320,
    growthRate: 6.6,
    segments: [
      { name: 'Clients', count: 1250 },
      { name: 'Caregivers', count: 850 },
      { name: 'Family Members', count: 1750 },
      { name: 'Healthcare Partners', count: 650 },
      { name: 'Other', count: 350 }
    ]
  },
  referrals: {
    totalReferrals: 185,
    conversionRate: 42,
    sources: [
      { name: 'Client Referrals', count: 65 },
      { name: 'Caregiver Referrals', count: 45 },
      { name: 'Healthcare Partners', count: 55 },
      { name: 'Website', count: 20 }
    ]
  }
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MarketingCampaignPerformance = () => {
  const [campaignData, setCampaignData] = useState(mockCampaignData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Fetch real campaign data when component mounts
    fetchCampaignData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5002/api/ag2/marketing_campaign');
      if (response.data && response.data.status === 'success') {
        setCampaignData(response.data.result);
      }
    } catch (err) {
      console.error('Error fetching marketing campaign data:', err);
      setError('Failed to load marketing campaign data. Using mock data instead.');
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleRunCampaignAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5002/api/ag2/marketing_campaign', {
        campaign_config: {
          name: "Spring Promotion",
          start_date: "2025-04-01",
          end_date: "2025-04-30",
          target_audience: "Seniors",
          channels: ["email", "social"]
        }
      });
      
      if (response.data && response.data.status === 'success') {
        setCampaignData(prevData => ({
          ...prevData,
          latestAnalysis: response.data.result
        }));
        setError(null);
      }
    } catch (err) {
      console.error('Error running campaign analysis:', err);
      setError('Failed to run campaign analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marketing Campaign Performance
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="marketing campaign tabs">
          <Tab label="Campaign Overview" icon={<CampaignIcon />} iconPosition="start" />
          <Tab label="Email Marketing" icon={<EmailIcon />} iconPosition="start" />
          <Tab label="Contact Growth" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Referral Analytics" icon={<TrendingUpIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Campaign Overview Tab */}
          {activeTab === 0 && (
            <>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRunCampaignAnalysis}
                  disabled={loading}
                >
                  Run Campaign Analysis
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {/* Campaign Summary Cards */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Active Campaigns</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Campaign Name</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date Range</TableCell>
                          <TableCell>Impressions</TableCell>
                          <TableCell>Clicks</TableCell>
                          <TableCell>CTR</TableCell>
                          <TableCell>Conversions</TableCell>
                          <TableCell>Conv. Rate</TableCell>
                          <TableCell>ROI</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {campaignData.campaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell>{campaign.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={campaign.status} 
                                color={
                                  campaign.status === 'active' ? 'success' : 
                                  campaign.status === 'completed' ? 'default' : 'primary'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{`${campaign.startDate} to ${campaign.endDate}`}</TableCell>
                            <TableCell>{campaign.metrics.impressions.toLocaleString()}</TableCell>
                            <TableCell>{campaign.metrics.clicks.toLocaleString()}</TableCell>
                            <TableCell>{`${campaign.metrics.ctr}%`}</TableCell>
                            <TableCell>{campaign.metrics.conversions}</TableCell>
                            <TableCell>{`${campaign.metrics.conversionRate}%`}</TableCell>
                            <TableCell>{`${campaign.metrics.roi}%`}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                {/* Campaign Performance Chart */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Campaign Performance Comparison</Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={campaignData.campaigns.filter(c => c.status !== 'scheduled')}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="metrics.clicks" name="Clicks" fill="#8884d8" />
                          <Bar yAxisId="left" dataKey="metrics.conversions" name="Conversions" fill="#82ca9d" />
                          <Bar yAxisId="right" dataKey="metrics.ctr" name="CTR (%)" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
          
          {/* Email Marketing Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              {/* Email Summary Cards */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Email Overview</Typography>
                    <Typography variant="h3" color="primary">{campaignData.emailMetrics.overall.totalSent.toLocaleString()}</Typography>
                    <Typography variant="body2" color="textSecondary">Total Emails Sent</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h5">{campaignData.emailMetrics.overall.averageOpenRate}%</Typography>
                        <Typography variant="body2" color="textSecondary">Avg. Open Rate</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{campaignData.emailMetrics.overall.averageClickRate}%</Typography>
                        <Typography variant="body2" color="textSecondary">Avg. Click Rate</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Email Campaigns Table */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Recent Email Campaigns</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Campaign</TableCell>
                            <TableCell align="right">Sent</TableCell>
                            <TableCell align="right">Opened</TableCell>
                            <TableCell align="right">Clicked</TableCell>
                            <TableCell align="right">Open Rate</TableCell>
                            <TableCell align="right">Click Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {campaignData.emailMetrics.campaigns.map((campaign, index) => (
                            <TableRow key={index}>
                              <TableCell>{campaign.name}</TableCell>
                              <TableCell align="right">{campaign.sent.toLocaleString()}</TableCell>
                              <TableCell align="right">{campaign.opened.toLocaleString()}</TableCell>
                              <TableCell align="right">{campaign.clicked.toLocaleString()}</TableCell>
                              <TableCell align="right">{`${campaign.openRate}%`}</TableCell>
                              <TableCell align="right">{`${campaign.clickRate}%`}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Email Performance Chart */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Email Performance Trends</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={campaignData.emailMetrics.campaigns}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="openRate" name="Open Rate %" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="clickRate" name="Click Rate %" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Contact Growth Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              {/* Contact List Summary */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact List Overview</Typography>
                    <Typography variant="h3" color="primary">{campaignData.contactList.totalContacts.toLocaleString()}</Typography>
                    <Typography variant="body2" color="textSecondary">Total Contacts</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h5">+{campaignData.contactList.newContactsLastMonth}</Typography>
                        <Typography variant="body2" color="textSecondary">New This Month</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h5">{campaignData.contactList.growthRate}%</Typography>
                        <Typography variant="body2" color="textSecondary">Growth Rate</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Contact Segments Chart */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Segments</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={campaignData.contactList.segments}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {campaignData.contactList.segments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Referral Analytics Tab */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              {/* Referral Summary */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Referral Overview</Typography>
                    <Typography variant="h3" color="primary">{campaignData.referrals.totalReferrals}</Typography>
                    <Typography variant="body2" color="textSecondary">Total Referrals</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h5">{campaignData.referrals.conversionRate}%</Typography>
                    <Typography variant="body2" color="textSecondary">Conversion Rate</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Referral Sources Chart */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Referral Sources</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={campaignData.referrals.sources}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Referrals" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default MarketingCampaignPerformance;
