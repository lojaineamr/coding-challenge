import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';

const AverageMetricsChart = () => {
  const [averageData, setAverageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAverageMetrics();
  }, []);

  const fetchAverageMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/metrics/averages');
      setAverageData(response.data);
    } catch (error) {
      console.error('Error fetching average metrics:', error);
      setError('Failed to load average metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricLabel = (key) => {
    const labels = {
      verticalJump: 'Vertical Jump',
      sprint_10m: '10m Sprint',
      sprint_20m: '20m Sprint',
      maxSpeed: 'Max Speed',
      accelerationPeak: 'Peak Acceleration'
    };
    
    return labels[key] || key;
  };

  const createChartData = (averages) => {
    const chartMetrics = ['verticalJump', 'sprint_10m', 'sprint_20m', 'maxSpeed', 'accelerationPeak'];
    const labels = chartMetrics.map(key => getMetricLabel(key));
    const data = chartMetrics.map(key => averages[key]);

    return {
      labels,
      datasets: [
        {
          label: 'Average Performance Metrics',
          data,
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(236, 72, 153, 1)',
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
        text: `Average Performance Metrics (${averageData?.totalSessions || 0} Athletes)`,
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
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading average metrics...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Paper>
    );
  }

  if (!averageData || averageData.totalSessions === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography variant="h5" component="h3" gutterBottom>
          No Data Available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create some athlete sessions to see average metrics
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h3" gutterBottom>
        Team Performance Overview
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Chart Section - 50% of the box */}
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Box sx={{ height: 400 }}>
            <Bar data={createChartData(averageData.averages)} options={chartOptions} />
          </Box>
        </Paper>
        
        {/* Metrics Section - 50% of the box with 4 columns and 2 rows */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={1.5} sx={{ height: 400 }}>
            {Object.entries(averageData.averages).map(([key, value], index) => (
              <Grid item xs={3} key={key}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    textAlign: 'center', 
                    p: 1.5,
                    height: '190px',
                    width: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h6" color="primary" gutterBottom sx={{ fontSize: '1.5rem', mb: 0.5 }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                    {getMetricLabel(key)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AverageMetricsChart;
