import React from 'react';

const InjuryRiskVisualization = ({ keypointLoads }) => {
  const getLoadColor = (load) => {
    if (load <= 50) return 'low';
    if (load <= 80) return 'moderate';
    return 'high';
  };

  const getLoadPositions = () => {
    // Define positions for each body part on the silhouette
    // Positions are in percentages relative to the container
    return {
      neck: { top: '8%', left: '50%' },
      leftShoulder: { top: '18%', left: '25%' },
      rightShoulder: { top: '18%', left: '75%' },
      lowerBack: { top: '35%', left: '50%' },
      leftHip: { top: '45%', left: '35%' },
      rightHip: { top: '45%', left: '65%' },
      leftKnee: { top: '65%', left: '35%' },
      rightKnee: { top: '65%', left: '65%' },
      leftAnkle: { top: '85%', left: '35%' },
      rightAnkle: { top: '85%', left: '65%' },
      leftWrist: { top: '50%', left: '15%' },
      rightWrist: { top: '50%', left: '85%' }
    };
  };

  const positions = getLoadPositions();

  return (
    <div className="body-visualization">
      <div className="player-silhouette">
        {/* Head */}
        <div style={{
          position: 'absolute',
          top: '2%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '40px',
          backgroundColor: '#d1d5db',
          borderRadius: '50%'
        }}></div>
        
        {/* Neck */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '15px',
          backgroundColor: '#d1d5db',
          borderRadius: '10px'
        }}></div>
        
        {/* Torso */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '120px',
          backgroundColor: '#d1d5db',
          borderRadius: '40px 40px 20px 20px'
        }}></div>
        
        {/* Arms */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '15px',
          height: '100px',
          backgroundColor: '#d1d5db',
          borderRadius: '15px'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '15px',
          height: '100px',
          backgroundColor: '#d1d5db',
          borderRadius: '15px'
        }}></div>
        
        {/* Legs */}
        <div style={{
          position: 'absolute',
          top: '42%',
          left: '35%',
          width: '18px',
          height: '140px',
          backgroundColor: '#d1d5db',
          borderRadius: '20px'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '42%',
          right: '35%',
          width: '18px',
          height: '140px',
          backgroundColor: '#d1d5db',
          borderRadius: '20px'
        }}></div>

        {/* Load Indicators */}
        {Object.entries(keypointLoads).map(([bodyPart, load]) => {
          const position = positions[bodyPart];
          if (!position) return null;

          return (
            <div
              key={bodyPart}
              className={`load-indicator ${getLoadColor(load)}`}
              style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -50%)'
              }}
              title={`${bodyPart}: ${load}/100`}
            >
              <span style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#374151',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 4px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
              className="load-tooltip"
            >
              {load}
            </span>
          </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .load-indicator:hover .load-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default InjuryRiskVisualization;
