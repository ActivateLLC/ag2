import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CaregiverMetrics from './pages/CaregiverMetrics';
import WorkflowManagement from './pages/WorkflowManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ReportGenerator from './pages/ReportGenerator';
import SocialMediaManagement from './pages/SocialMediaManagement';
import MarketingCampaignPerformance from './pages/MarketingCampaignPerformance';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="caregivers" element={<CaregiverMetrics />} />
            <Route path="workflows" element={<WorkflowManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="report-generator" element={<ReportGenerator />} />
            <Route path="settings" element={<Settings />} />
            <Route path="social-media" element={<SocialMediaManagement />} />
            <Route path="marketing-campaigns" element={<MarketingCampaignPerformance />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
