import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        text: 'Key Performance Indicators',
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
    return <div className="loading">Loading session data...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="error">
        <h3>Session Not Found</h3>
        <p>The requested session could not be found.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="snapshot-container">
      <div className="navigation-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button 
                className="save-button"
                onClick={handleSaveChanges}
                title="Save changes"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="save-icon">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                <span className="button-text">Save</span>
              </button>
              <button 
                className="cancel-button"
                onClick={handleEditToggle}
                title="Cancel editing"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="cancel-icon">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                <span className="button-text">Cancel</span>
              </button>
            </>
          ) : (
            <button 
              className="edit-button"
              onClick={handleEditToggle}
              title="Edit session data"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="edit-icon">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              <span className="button-text">Edit</span>
            </button>
          )}
          <button 
            className="delete-button"
            onClick={handleDeleteSession}
            title="Delete athlete session"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="trash-icon2">
              <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
            </svg>
            <span className="button-text">Delete</span>
          </button>
        </div>
      </div>
      
      <div className="player-info">
        {isEditing ? (
          <input
            type="text"
            value={editedPlayerName}
            onChange={(e) => setEditedPlayerName(e.target.value)}
            className="player-name-input"
          />
        ) : (
          <h2>{sessionData.playerName}</h2>
        )}
        <p className="session-date">
          Session Date: {new Date(sessionData.sessionDate).toLocaleDateString()}
        </p>
        <p className="session-date">Session ID: #{sessionData.sessionId}</p>
      </div>

      <div className="content-grid">
        <div className="metrics-section">
          <h3>Performance Metrics</h3>
          
          <div className="metrics-grid">
            {Object.entries(isEditing ? editedMetrics : sessionData.metrics).map(([key, value]) => (
              <div key={key} className="metric-card">
                {isEditing ? (
                  <div className="metric-edit">
                    <input
                      type="number"
                      step="0.1"
                      value={editedMetrics[key]}
                      onChange={(e) => handleMetricChange(key, e.target.value)}
                      className="metric-input"
                    />
                    <div className="metric-label">{getMetricLabel(key)}</div>
                  </div>
                ) : (
                  <>
                    <div className="metric-value">{formatMetricValue(key, value)}</div>
                    <div className="metric-label">{getMetricLabel(key)}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="chart-container">
            <Bar data={createChartData(isEditing ? editedMetrics : sessionData.metrics)} options={chartOptions} />
          </div>
        </div>

        <div className="injury-risk-section">
          <h3>Injury Risk Assessment</h3>
          <p>Body load indicators based on biomechanical analysis</p>
          
          <InjuryRiskVisualization keypointLoads={sessionData.keypointLoads} />
          
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color low"></div>
              <span>Low Risk (1-50)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color moderate"></div>
              <span>Moderate Risk (51-80)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color high"></div>
              <span>High Risk (81-100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSnapshot;
