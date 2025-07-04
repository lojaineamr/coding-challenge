import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import MetricsForm from './MetricsForm';

const AthleteCreation = () => {
  const [playerName, setPlayerName] = useState('');
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    try {
      // Prepare metrics with default values of 0 for empty fields
      const processedMetrics = {
        verticalJump: parseFloat(metrics.verticalJump) || 0,
        sprint_10m: parseFloat(metrics.sprint_10m) || 0,
        sprint_20m: parseFloat(metrics.sprint_20m) || 0,
        maxSpeed: parseFloat(metrics.maxSpeed) || 0,
        accelerationPeak: parseFloat(metrics.accelerationPeak) || 0,
        distanceCovered: parseInt(metrics.distanceCovered) || 0,
        heartRateAvg: parseInt(metrics.heartRateAvg) || 0,
        heartRateMax: parseInt(metrics.heartRateMax) || 0
      };

      const response = await axios.post('/api/sessions', {
        playerName: playerName.trim(),
        metrics: processedMetrics
      });
      
      const { sessionId } = response.data;
      navigate(`/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricChange = (key, value) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
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
          <Typography color="text.primary">Create Athlete</Typography>
        </Breadcrumbs>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Create New Athlete
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Enter athlete information and performance metrics
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Basic Information
              </Typography>
              <TextField
                fullWidth
                label="Athlete Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter athlete's full name"
                required
                disabled={isLoading}
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </Box>
            
            <MetricsForm 
              metrics={metrics}
              onMetricChange={handleMetricChange}
              disabled={isLoading}
            />
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button 
                component={Link}
                to="/"
                variant="outlined"
                color="secondary"
                size="large"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading || !playerName.trim()}
                startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                sx={{ minWidth: 160 }}
              >
                {isLoading ? 'Creating...' : 'Create Athlete'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AthleteCreation;
