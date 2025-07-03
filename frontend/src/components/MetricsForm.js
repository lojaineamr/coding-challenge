import React from 'react';

const MetricsForm = ({ metrics, onMetricChange, disabled }) => {
  const metricDefinitions = {
    verticalJump: { label: 'Vertical Jump', unit: 'cm', min: 0, max: 100, step: 1 },
    sprint_10m: { label: '10m Sprint', unit: 's', min: 0, max: 100, step: 0.1 },
    sprint_20m: { label: '20m Sprint', unit: 's', min: 0, max: 100, step: 0.1 },
    maxSpeed: { label: 'Max Speed', unit: 'km/h', min: 0, max: 50, step: 0.1 },
    accelerationPeak: { label: 'Peak Acceleration', unit: 'm/s²', min: 0, max: 50, step: 0.1 },
    distanceCovered: { label: 'Distance Covered', unit: 'm', min: 0, max: 20000, step: 1 },
    heartRateAvg: { label: 'Avg Heart Rate', unit: 'bpm', min: 0, max: 220, step: 1 },
    heartRateMax: { label: 'Max Heart Rate', unit: 'bpm', min: 0, max: 220, step: 1 }
  };

  return (
    <div className="metrics-form">
      <h4>Performance Metrics (Optional - defaults to 0)</h4>
      <div className="metrics-input-grid">
        {Object.entries(metricDefinitions).map(([key, definition]) => (
          <div key={key} className="metric-input-group">
            <label htmlFor={key}>{definition.label}</label>
            <div className="input-with-unit">
              <input
                type="number"
                id={key}
                value={metrics[key] || ''}
                onChange={(e) => onMetricChange(key, e.target.value)}
                placeholder="0"
                min={definition.min}
                max={definition.max}
                step={definition.step}
                disabled={disabled}
                className="metric-input-field"
              />
              <span className="unit-label">{definition.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsForm;
