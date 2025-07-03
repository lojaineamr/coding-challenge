import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AverageMetricsChart from './AverageMetricsChart';

const HomePage = () => {
  const [recentSessions, setRecentSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setRecentSessions(response.data.slice(0, 10)); // Show last 10 sessions
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

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Welcome to Performance Tracker</h2>
        <p>Track athletic performance and assess injury risks with advanced analytics</p>
      </div>
      
      <AverageMetricsChart />
      
      {recentSessions.length > 0 ? (
        <div className="recent-sessions">
          <h3>Recent Athletes</h3>
          <div className="sessions-grid">
            {recentSessions.map((session) => (
              <div
                key={session.sessionId}
                className="session-card"
                onClick={() => handleSessionClick(session.sessionId)}
              >
                <div className="session-info">
                  <h4>{session.playerName}</h4>
                  <p>Session #{session.sessionId}</p>
                  <p>{new Date(session.sessionDate).toLocaleDateString()}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteSession(session.sessionId, session.playerName, e)}
                  title="Delete session"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="trash-icon">
                    <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h3>No Athletes Yet</h3>
          <p>Create your first athlete to get started with performance tracking</p>
          <p className="empty-hint">Use the "Create Athlete" button in the navigation above</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
