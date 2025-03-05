import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Visibility as VisibilityIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BarChart as ChartIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// API service
const API_URL = 'http://localhost:5002/api';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`social-tabpanel-${index}`}
      aria-labelledby={`social-tab-${index}`}
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

// Mock data for development
const mockSocialData = {
  platforms: [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <InstagramIcon />,
      color: '#E1306C',
      followers: 2450,
      followerGrowth: '+120',
      growthPercentage: 5.2,
      engagement: {
        likes: 1250,
        comments: 320,
        shares: 180
      },
      engagementRate: 4.8,
      posts: [
        { id: 'p1', date: '2025-03-10', status: 'scheduled', content: 'New caregiver training program launching next week! #SeniorCare #CaregiverTraining', image: 'training.jpg' },
        { id: 'p2', date: '2025-03-15', status: 'scheduled', content: 'Tips for helping seniors stay active during spring. #ActiveSeniors #SpringActivities', image: 'active-seniors.jpg' },
        { id: 'p3', date: '2025-03-20', status: 'scheduled', content: 'Meet our caregiver of the month: Sarah Johnson! #CaregiverSpotlight', image: 'caregiver-spotlight.jpg' },
        { id: 'p4', date: '2025-03-01', status: 'published', content: 'How our specialized dementia care program is changing lives. #DementiaCare #MemoryCare', image: 'dementia-care.jpg' }
      ],
      trends: [
        { month: 'Jan', followers: 2200, engagement: 3.8 },
        { month: 'Feb', followers: 2330, engagement: 4.2 },
        { month: 'Mar', followers: 2450, engagement: 4.8 }
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877F2',
      followers: 3850,
      followerGrowth: '+95',
      growthPercentage: 2.5,
      engagement: {
        likes: 980,
        comments: 215,
        shares: 320
      },
      engagementRate: 3.9,
      posts: [
        { id: 'p5', date: '2025-03-12', status: 'scheduled', content: 'Join our virtual caregiver support group this Thursday at 7PM. #CaregiverSupport', image: 'support-group.jpg' },
        { id: 'p6', date: '2025-03-18', status: 'scheduled', content: 'New blog post: "10 Ways to Prevent Falls in the Home" #FallPrevention #SeniorSafety', image: 'fall-prevention.jpg' },
        { id: 'p7', date: '2025-03-02', status: 'published', content: 'Congratulations to our newest certified caregivers! #CertifiedCaregivers #Training', image: 'certification.jpg' }
      ],
      trends: [
        { month: 'Jan', followers: 3650, engagement: 3.2 },
        { month: 'Feb', followers: 3755, engagement: 3.6 },
        { month: 'Mar', followers: 3850, engagement: 3.9 }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      color: '#0A66C2',
      followers: 1850,
      followerGrowth: '+210',
      growthPercentage: 12.8,
      engagement: {
        likes: 420,
        comments: 85,
        shares: 145
      },
      engagementRate: 3.5,
      posts: [
        { id: 'p8', date: '2025-03-14', status: 'scheduled', content: "Arise Cares is hiring! We're looking for compassionate caregivers to join our growing team. #Hiring #CaregiverJobs", image: 'hiring.jpg' },
        { id: 'p9', date: '2025-03-22', status: 'scheduled', content: "Our CEO will be speaking at the Senior Care Innovation Summit next month. #SeniorCareInnovation", image: 'conference.jpg' },
        { id: 'p10', date: '2025-03-05', status: 'published', content: "Arise Cares partners with local university for caregiver training program. #Partnership #CaregiverEducation", image: 'partnership.jpg' }
      ],
      trends: [
        { month: 'Jan', followers: 1450, engagement: 2.8 },
        { month: 'Feb', followers: 1640, engagement: 3.1 },
        { month: 'Mar', followers: 1850, engagement: 3.5 }
      ]
    }
  ]
};

export default function SocialMediaManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: '',
    content: '',
    date: '',
    image: ''
  });

  useEffect(() => {
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would be an API call
      // const response = await axios.get(`${API_URL}/social/metrics`);
      // setSocialData(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setSocialData(mockSocialData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching social media data:', err);
      setError('Failed to load social media data. Please try again later.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewPost({
      platform: '',
      content: '',
      date: '',
      image: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value
    });
  };

  const handleAddPost = () => {
    // In a real implementation, this would be an API call
    // const response = await axios.post(`${API_URL}/social/posts`, newPost);
    
    // For now, just update the local state
    const updatedData = { ...socialData };
    const platformIndex = updatedData.platforms.findIndex(p => p.id === newPost.platform);
    
    if (platformIndex !== -1) {
      const newId = `p${Math.floor(Math.random() * 10000)}`;
      updatedData.platforms[platformIndex].posts.push({
        id: newId,
        date: newPost.date,
        status: 'scheduled',
        content: newPost.content,
        image: newPost.image || 'default.jpg'
      });
      
      setSocialData(updatedData);
    }
    
    handleCloseDialog();
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
      <Box sx={{ m: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Social Media Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Schedule Post
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {socialData.platforms.map((platform) => (
          <Grid item xs={12} md={4} key={platform.id}>
            <Card>
              <CardHeader
                avatar={React.cloneElement(platform.icon, { style: { color: platform.color } })}
                title={platform.name}
                subheader={`${platform.followers.toLocaleString()} Followers`}
                action={
                  <Chip 
                    label={`${platform.followerGrowth} (${platform.growthPercentage}%)`} 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LikeIcon color="action" />
                      <Typography variant="body2" color="text.secondary">Likes</Typography>
                      <Typography variant="h6">{platform.engagement.likes}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CommentIcon color="action" />
                      <Typography variant="body2" color="text.secondary">Comments</Typography>
                      <Typography variant="h6">{platform.engagement.comments}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ShareIcon color="action" />
                      <Typography variant="body2" color="text.secondary">Shares</Typography>
                      <Typography variant="h6">{platform.engagement.shares}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Engagement Rate
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {platform.engagementRate}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for different platforms */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {socialData.platforms.map((platform, index) => (
            <Tab 
              key={platform.id} 
              label={platform.name} 
              icon={React.cloneElement(platform.icon, { style: { color: platform.color } })} 
              id={`social-tab-${index}`}
              aria-controls={`social-tabpanel-${index}`}
            />
          ))}
        </Tabs>

        {socialData.platforms.map((platform, index) => (
          <TabPanel key={platform.id} value={tabValue} index={index}>
            <Grid container spacing={4}>
              {/* Content Calendar */}
              <Grid item xs={12} lg={7}>
                <Typography variant="h6" gutterBottom>
                  Content Calendar
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {platform.posts.sort((a, b) => new Date(a.date) - new Date(b.date)).map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>{post.content}</TableCell>
                          <TableCell>
                            <Chip 
                              label={post.status} 
                              color={post.status === 'published' ? 'success' : 'primary'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton size="small" color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Analytics */}
              <Grid item xs={12} lg={5}>
                <Typography variant="h6" gutterBottom>
                  Performance Trends
                </Typography>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Follower Growth
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={platform.trends}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="followers" stroke={platform.color} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Engagement Rate (%)
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={platform.trends}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="engagement" fill={platform.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        ))}
      </Paper>

      {/* Add Post Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Schedule New Social Media Post</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="platform-select-label">Platform</InputLabel>
              <Select
                labelId="platform-select-label"
                id="platform-select"
                name="platform"
                value={newPost.platform}
                label="Platform"
                onChange={handleInputChange}
              >
                {socialData.platforms.map((platform) => (
                  <MenuItem key={platform.id} value={platform.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {React.cloneElement(platform.icon, { style: { marginRight: 8, color: platform.color } })}
                      {platform.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Post Content"
              name="content"
              multiline
              rows={4}
              value={newPost.content}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Scheduled Date"
              name="date"
              type="date"
              value={newPost.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Image Name"
              name="image"
              value={newPost.image}
              onChange={handleInputChange}
              helperText="Enter image filename (e.g., 'senior-care.jpg')"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddPost} 
            variant="contained" 
            disabled={!newPost.platform || !newPost.content || !newPost.date}
          >
            Schedule Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
