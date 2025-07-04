import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import AverageMetricsChart from './AverageMetricsChart';

const HomePage = () => {
  const [recentSessions, setRecentSessions] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setRecentSessions(response.data.slice(0, 100)); // Show last 100 sessions
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    }
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleDeleteSession = async (sessionId, playerName, e) => {
    e.stopPropagation(); // Prevent triggering the session click
    
    if (!window.confirm(`Are you sure you want to delete the session for ${playerName}?`)) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      // Refresh the sessions list
      fetchRecentSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsCreating(true);
    try {
      // Create session with just player name - backend will generate random metrics
      const response = await axios.post('/api/sessions', {
        playerName: playerName.trim()
      });
      
      const { sessionId } = response.data;
      navigate(`/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Welcome to Performance Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track athlete's performance and assess injury risks
          </Typography>
        </Box>
        
        {/* Quick Session Creation Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Quick Session Creation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter an athlete's name to create a session with random performance metrics
          </Typography>
          <Box component="form" onSubmit={handleCreateSession} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Athlete Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter athlete's name"
              required
              disabled={isCreating}
              variant="outlined"
            />
            <Button 
              type="submit" 
              variant="contained"
              color="primary"
              size="large"
              disabled={isCreating || !playerName.trim()}
              startIcon={<PersonAddIcon />}
              sx={{ minWidth: 200 }}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </Box>
        </Paper>
        
        {/* Average Metrics Chart */}
        <Box sx={{ mb: 4 }}>
          <AverageMetricsChart />
        </Box>
        
        {/* Recent Sessions */}
        {recentSessions.length > 0 ? (
          <Box>
            <Typography variant="h5" component="h3" gutterBottom>
              Recent Athletes
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentSessions.map((session) => (
                <Card 
                  key={session.sessionId}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleSessionClick(session.sessionId)}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" component="h4" gutterBottom>
                        {session.playerName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Session #${session.sessionId}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Session Date: {new Date(session.sessionDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={(e) => handleDeleteSession(session.sessionId, session.playerName, e)}
                      title="Delete session"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              No Athletes Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Create your first athlete to get started with performance tracking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the "Create Athlete" button in the navigation above
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
