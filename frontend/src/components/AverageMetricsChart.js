import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

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
      accelerationPeak: 'Peak Acceleration',
      heartRateAvg: 'Avg Heart Rate'
    };
    
    return labels[key] || key;
  };

  const createChartData = (averages) => {
    const chartMetrics = ['verticalJump', 'sprint_10m', 'sprint_20m', 'maxSpeed', 'accelerationPeak', 'heartRateAvg'];
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
      <div className="average-metrics-container">
        <div className="loading">Loading average metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="average-metrics-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!averageData || averageData.totalSessions === 0) {
    return (
      <div className="average-metrics-container">
        <div className="empty-state">
          <h3>No Data Available</h3>
          <p>Create some athlete sessions to see average metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="average-metrics-container">
      <div className="average-metrics-section">
        <div className="average-content-grid">
          <div className="chart-container">
            <Bar data={createChartData(averageData.averages)} options={chartOptions} />
          </div>
          
          <div className="average-stats-grid">
            {Object.entries(averageData.averages).slice(0, Math.ceil(Object.entries(averageData.averages).length / 2)).map(([key, value]) => (
              <div key={key} className="average-stat-card">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{getMetricLabel(key)}</div>
              </div>
            ))}
          </div>
          
          <div className="average-stats-grid">
            {Object.entries(averageData.averages).slice(Math.ceil(Object.entries(averageData.averages).length / 2)).map(([key, value]) => (
              <div key={key} className="average-stat-card">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{getMetricLabel(key)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageMetricsChart;
