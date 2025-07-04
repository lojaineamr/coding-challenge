import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './App.css';
import HomePage from './components/HomePage';
import PerformanceSnapshot from './components/PerformanceSnapshot';
import AthleteCreation from './components/AthleteCreation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

function AppContent() {
  const location = useLocation();
  const isCreateAthletePage = location.pathname === '/create-athlete';

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-left">
            <p>Advanced Performance & Injury Risk Analysis</p>
          </div>
          {!isCreateAthletePage && (
            <div className="header-nav">
              <Link to="/create-athlete" className="nav-create-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="add-icon">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Create Athlete
              </Link>
            </div>
          )}
        </div>
      </header>
      
      <main className="App-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-athlete" element={<AthleteCreation />} />
          <Route path="/sessions/:sessionId" element={<PerformanceSnapshot />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
