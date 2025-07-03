import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
    <div className="athlete-creation-container">
      <div className="page-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h2>Create New Athlete</h2>
        <p>Enter athlete information and performance metrics</p>
      </div>

      <form onSubmit={handleSubmit} className="athlete-creation-form">
        <div className="basic-info-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="playerName">Athlete Name *</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter athlete's full name"
              required
              disabled={isLoading}
              className="athlete-name-input"
            />
          </div>
        </div>
        
        <MetricsForm 
          metrics={metrics}
          onMetricChange={handleMetricChange}
          disabled={isLoading}
        />
        
        <div className="form-actions">
          <Link to="/" className="btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading || !playerName.trim()}
          >
            {isLoading ? 'Creating Athlete...' : 'Create Athlete'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AthleteCreation;
