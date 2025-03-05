import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown,
  TrendingFlat,
  CheckCircle,
  Warning,
  Error,
  Search as SearchIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
Chart.register(...registerables);

// API service
const API_URL = 'http://localhost:5002/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [seoMetrics, setSeoMetrics] = useState(null);
  const [marketingMetrics, setMarketingMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch summary data
        const summaryResponse = await axios.get(`${API_URL}/dashboard/summary`);
        setSummary(summaryResponse.data);
        
        // Fetch SEO metrics
        const seoResponse = await axios.get(`${API_URL}/metrics/seo`);
        setSeoMetrics(seoResponse.data);
        
        // Fetch marketing metrics
        const marketingResponse = await axios.get(`${API_URL}/metrics/marketing`);
        setMarketingMetrics(marketingResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // For demo purposes, use mock data if API fails
  const mockSummary = {
    organic_traffic: 4250,
    conversion_rate: 3.2,
    keyword_rankings: 87,
    alerts: 2,
    last_updated: new Date().toISOString()
  };

  const mockSeoMetrics = {
    overall_score: 78,
    metrics: {
      page_speed: { score: 82, benchmark: 90, trend: "-3%" },
      mobile_friendliness: { score: 94, benchmark: 85, trend: "+5%" },
      backlinks: { score: 68, benchmark: 75, trend: "+8%" },
      content_quality: { score: 85, benchmark: 80, trend: "+2%" },
      on_page_seo: { score: 76, benchmark: 85, trend: "-4%" }
    },
    top_keywords: [
      { keyword: "home care services", position: 3, volume: 5400 },
      { keyword: "senior care near me", position: 5, volume: 3200 },
      { keyword: "caregiver jobs", position: 2, volume: 8100 },
      { keyword: "home health aide", position: 7, volume: 4700 },
      { keyword: "elderly care services", position: 4, volume: 2900 }
    ],
    history: [
      { date: "2025-01", score: 72 },
      { date: "2025-02", score: 75 },
      { date: "2025-03", score: 78 }
    ]
  };

  const mockMarketingMetrics = {
    channels: {
      organic_search: 42,
      paid_search: 18,
      social_media: 24,
      email: 12,
      direct: 4
    },
    campaigns: [
      { name: "Spring Care Package", clicks: 1240, conversions: 68, roi: 320 },
      { name: "Caregiver Recruitment", clicks: 980, conversions: 42, roi: 210 },
      { name: "Family Support Webinar", clicks: 720, conversions: 35, roi: 180 },
      { name: "Senior Wellness Guide", clicks: 1560, conversions: 94, roi: 450 }
    ],
    content_performance: [
      { title: "10 Tips for Family Caregivers", views: 2400, engagement: 8.2 },
      { title: "Understanding Medicare Coverage", views: 1800, engagement: 7.5 },
      { title: "Preventing Caregiver Burnout", views: 3200, engagement: 9.1 },
      { title: "Home Safety Checklist", views: 1500, engagement: 6.8 }
    ]
  };

  // Use real data if available, otherwise use mock data
  const dashboardSummary = summary || mockSummary;
  const seoData = seoMetrics || mockSeoMetrics;
  const marketingData = marketingMetrics || mockMarketingMetrics;

  // Prepare chart data
  const seoHistoryChartData = {
    labels: seoData.history.map(item => item.date),
    datasets: [
      {
        label: 'SEO Score',
        data: seoData.history.map(item => item.score),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const seoMetricsChartData = {
    labels: Object.keys(seoData.metrics).map(key => 
      key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ),
    datasets: [
      {
        label: 'Current Score',
        data: Object.values(seoData.metrics).map(metric => metric.score),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Benchmark',
        data: Object.values(seoData.metrics).map(metric => metric.benchmark),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const marketingChannelsChartData = {
    labels: Object.keys(marketingData.channels).map(key => 
      key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ),
    datasets: [
      {
        data: Object.values(marketingData.channels),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
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
      <Typography variant="h4" gutterBottom>
        SEO & Marketing Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Organic Traffic
              </Typography>
              <Typography variant="h3">
                {dashboardSummary.organic_traffic.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                <TrendingUp fontSize="small" /> +12% vs. last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Conversion Rate
              </Typography>
              <Typography variant="h3">
                {dashboardSummary.conversion_rate}%
              </Typography>
              <Typography variant="body2" color="success.main">
                <TrendingUp fontSize="small" /> +0.5% vs. last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Keyword Rankings
              </Typography>
              <Typography variant="h3">
                {dashboardSummary.keyword_rankings}
              </Typography>
              <Typography variant="body2" color="success.main">
                <TrendingUp fontSize="small" /> +5 vs. last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                SEO Alerts
              </Typography>
              <Typography variant="h3" color={dashboardSummary.alerts > 0 ? "error" : "success"}>
                {dashboardSummary.alerts}
              </Typography>
              <Typography variant="body2" color={dashboardSummary.alerts > 0 ? "error.main" : "success.main"}>
                {dashboardSummary.alerts > 0 ? <Warning fontSize="small" /> : <CheckCircle fontSize="small" />} 
                {dashboardSummary.alerts > 0 ? "Issues need attention" : "All clear"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* SEO Metrics */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        SEO Performance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              SEO Score Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={seoHistoryChartData} 
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 60,
                      max: 100
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              SEO Alerts & Recommendations
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Error color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Page Speed Below Target" 
                  secondary="Mobile pages loading too slowly" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="On-Page SEO Issues" 
                  secondary="Missing meta descriptions on 4 pages" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Mobile Friendliness Excellent" 
                  secondary="5% above industry benchmark" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              SEO Metrics Breakdown
            </Typography>
            <Box sx={{ height: 350 }}>
              <Bar 
                data={seoMetricsChartData} 
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      min: 60,
                      max: 100
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Keywords
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Keyword</TableCell>
                    <TableCell align="right">Position</TableCell>
                    <TableCell align="right">Search Volume</TableCell>
                    <TableCell align="right">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seoData.top_keywords.map((keyword) => (
                    <TableRow key={keyword.keyword}>
                      <TableCell>{keyword.keyword}</TableCell>
                      <TableCell align="right">{keyword.position}</TableCell>
                      <TableCell align="right">{keyword.volume.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {keyword.position <= 3 ? (
                          <TrendingUp color="success" />
                        ) : keyword.position <= 10 ? (
                          <TrendingFlat color="primary" />
                        ) : (
                          <TrendingDown color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Marketing Metrics */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Marketing Performance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Traffic by Channel
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Doughnut 
                data={marketingChannelsChartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Campaign Performance
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                    <TableCell align="right">Conversions</TableCell>
                    <TableCell align="right">ROI (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketingData.campaigns.map((campaign) => (
                    <TableRow key={campaign.name}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell align="right">{campaign.clicks.toLocaleString()}</TableCell>
                      <TableCell align="right">{campaign.conversions}</TableCell>
                      <TableCell align="right">{campaign.roi}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content Performance
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Content Title</TableCell>
                    <TableCell align="right">Views</TableCell>
                    <TableCell align="right">Engagement Score</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketingData.content_performance.map((content) => (
                    <TableRow key={content.title}>
                      <TableCell>{content.title}</TableCell>
                      <TableCell align="right">{content.views.toLocaleString()}</TableCell>
                      <TableCell align="right">{content.engagement}/10</TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <SearchIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography variant="caption" color="textSecondary">
          Last updated: {new Date(dashboardSummary.last_updated).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}
