import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';

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
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" component="h4" gutterBottom>
        Performance Metrics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Defaults to 0 if left empty
      </Typography>
      
      <Grid container spacing={6}>
        {Object.entries(metricDefinitions).map(([key, definition]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <TextField
              sx={{ width: '120%', maxWidth: '300px', '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                } }}
              type="number"
              label={definition.label}
              value={metrics[key] || ''}
              onChange={(e) => onMetricChange(key, e.target.value)}
              placeholder="0"
              disabled={disabled}
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">{definition.unit}</InputAdornment>,
                inputProps: {
                  min: definition.min,
                  max: definition.max,
                  step: definition.step
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsForm;
