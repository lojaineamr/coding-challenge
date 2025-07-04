import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import InjuryRiskVisualization from './InjuryRiskVisualization';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceSnapshot = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetrics, setEditedMetrics] = useState({});
  const [editedPlayerName, setEditedPlayerName] = useState('');

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/sessions/${sessionId}`);
      setSessionData(response.data);
      setEditedMetrics(response.data.metrics);
      setEditedPlayerName(response.data.playerName);
    } catch (error) {
      console.error('Error fetching session data:', error);
      setError('Failed to load session data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionData) return;
    
    if (window.confirm(`Are you sure you want to delete the session for ${sessionData.playerName}?`)) {
      try {
        await axios.delete(`/api/sessions/${sessionId}`);
        navigate('/'); // Redirect to home page after deletion
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edited values to original values if canceling
      setEditedMetrics(sessionData.metrics);
      setEditedPlayerName(sessionData.playerName);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`/api/sessions/${sessionId}`, {
        metrics: editedMetrics,
        playerName: editedPlayerName
      });
      
      // Update local session data
      setSessionData({
        ...sessionData,
        metrics: editedMetrics,
        playerName: editedPlayerName
      });
      
      setIsEditing(false);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleMetricChange = (key, value) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setEditedMetrics({
        ...editedMetrics,
        [key]: numericValue
      });
    }
  };

  const formatMetricValue = (key, value) => {
    const units = {
      verticalJump: 'cm',
      sprint_10m: 's',
      sprint_20m: 's',
      maxSpeed: 'km/h',
      accelerationPeak: 'm/s²',
      distanceCovered: 'm',
      heartRateAvg: 'bpm',
      heartRateMax: 'bpm'
    };
    
    return `${value}${units[key] || ''}`;
  };

  const getMetricLabel = (key) => {
    const labels = {
      verticalJump: 'Vertical Jump',
      sprint_10m: '10m Sprint',
      sprint_20m: '20m Sprint',
      maxSpeed: 'Max Speed',
      accelerationPeak: 'Peak Acceleration',
      distanceCovered: 'Distance Covered',
      heartRateAvg: 'Avg Heart Rate',
      heartRateMax: 'Max Heart Rate'
    };
    
    return labels[key] || key;
  };

  const createChartData = (metrics) => {
    const chartMetrics = ['verticalJump', 'sprint_10m', 'sprint_20m', 'maxSpeed'];
    const labels = chartMetrics.map(key => getMetricLabel(key));
    const data = chartMetrics.map(key => metrics[key]);

    return {
      labels,
      datasets: [
        {
          label: 'Performance Metrics',
          data,
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        // text: 'Key Performance Indicators',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading session data...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>Error</Typography>
            <Typography>{error}</Typography>
          </Alert>
          <Button component={Link} to="/" variant="contained" startIcon={<ArrowBackIcon />}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!sessionData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>Session Not Found</Typography>
            <Typography>The requested session could not be found.</Typography>
          </Alert>
          <Button component={Link} to="/" variant="contained" startIcon={<ArrowBackIcon />}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Navigation Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Breadcrumbs>
            <MuiLink 
              component={Link} 
              to="/" 
              color="inherit" 
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <ArrowBackIcon fontSize="small" />
              Home
            </MuiLink>
            <Typography color="text.primary">Performance Snapshot</Typography>
          </Breadcrumbs>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isEditing ? (
              <>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
                <Button 
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditToggle}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outlined"
                color="primary"
                onClick={handleEditToggle}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            )}
            <Button 
              variant="outlined"
              color="error"
              onClick={handleDeleteSession}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Box>
        </Box>
        
        {/* Player Information */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          {isEditing ? (
            <TextField
              fullWidth
              value={editedPlayerName}
              onChange={(e) => setEditedPlayerName(e.target.value)}
              variant="outlined"
              size="large"
              sx={{ mb: 2 }}
            />
          ) : (
            <Typography variant="h3" component="h2" gutterBottom>
              {sessionData.playerName}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Session Date: ${new Date(sessionData.sessionDate).toLocaleDateString()}`}
              variant="outlined"
              color="primary"
            />
            <Chip 
              label={`Session ID: #${sessionData.sessionId}`}
              variant="outlined"
              color="secondary"
            />
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Half: Performance Metrics + Chart */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h4" component="h3" gutterBottom>
                Performance Metrics
              </Typography>
              {/* Metrics Grid: 2 rows, equal size boxes */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  {Object.entries(isEditing ? editedMetrics : sessionData.metrics).slice(0, 4).map(([key, value]) => (
                    <Grid item xs={3} key={key}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 , height: '100px', width: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        
                        {isEditing ? (
                          <>
                            <TextField
                              type="number"
                              inputProps={{ step: 0.1 }}
                              value={editedMetrics[key]}
                              onChange={(e) => handleMetricChange(key, e.target.value)}
                              size="small"
                              fullWidth
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {getMetricLabel(key)}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="h6" color="primary" gutterBottom>
                              {formatMetricValue(key, value)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getMetricLabel(key)}
                            </Typography>
                          </>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Grid container spacing={2}>
                  {Object.entries(isEditing ? editedMetrics : sessionData.metrics).slice(4, 8).map(([key, value]) => (
                    <Grid item xs={3} key={key}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 , height: '100px', width: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {isEditing ? (
                          <>
                            <TextField
                              type="number"
                              inputProps={{ step: 0.1 }}
                              value={editedMetrics[key]}
                              onChange={(e) => handleMetricChange(key, e.target.value)}
                              size="small"
                              fullWidth
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {getMetricLabel(key)}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="h6" color="primary" gutterBottom>
                              {formatMetricValue(key, value)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getMetricLabel(key)}
                            </Typography>
                          </>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              {/* Chart */}
              <Box sx={{ height: 300, mb: 2 }}>
                <Bar data={createChartData(isEditing ? editedMetrics : sessionData.metrics)} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>

          {/* Right Half: Injury Risk Assessment */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', width: '117%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Typography variant="h4" component="h3" gutterBottom>
                Injury Risk Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Body load indicators
              </Typography>
              <InjuryRiskVisualization keypointLoads={sessionData.keypointLoads} />
              <Divider sx={{ my: 2 }} />
              {/* Legend */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Risk Levels
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#4CAF50', borderRadius: 1 }} />
                    <Typography variant="body2">Low Risk (1-50)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#FF9800', borderRadius: 1 }} />
                    <Typography variant="body2">Moderate Risk (51-80)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#F44336', borderRadius: 1 }} />
                    <Typography variant="body2">High Risk (81-100)</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PerformanceSnapshot;
