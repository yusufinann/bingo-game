import React, { useState, useEffect } from 'react';
import { Paper, Typography, Zoom, Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.6);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

const NumberDisplay = ({ currentNumber, theme, manualMode = false, bingoMode }) => {
  const [activeDisplay, setActiveDisplay] = useState(false);

  useEffect(() => {
    if (currentNumber) {
      setActiveDisplay(true);
      let displayTime = 5000;

      if (bingoMode === 'extended') {
        displayTime = 5000;
      } else if (bingoMode === 'superfast') {
        displayTime = 3000;
      }

      const timer = setTimeout(() => {
        setActiveDisplay(false);
      }, displayTime);
      return () => clearTimeout(timer);
    } else {
      setActiveDisplay(false);
    }
  }, [currentNumber, bingoMode]);

  const animationStyle = activeDisplay ? {
    animation: `${pulseAnimation} 2s infinite`,
    transition: 'all 0.3s ease'
  } : {};

  return (
    <Zoom 
      in={activeDisplay}
      timeout={300} 
    >
      <Paper
        elevation={6}
        sx={{
          width: 120,
          height: 120,
          mx: 'auto',
          mb: 4,
          mt: 4,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.primary.main,
          color: 'white',
          opacity: manualMode && !activeDisplay ? 0.5 : 1,
          transition: 'opacity 0.3s ease',
          position: 'relative',
          border: '3px solid',
          borderColor: theme.palette.primary.light,
          padding: 2,
          ...animationStyle
        }}
      >
        <Box
          sx={{
            visibility: activeDisplay && currentNumber ? 'visible' : 'hidden',
            transform: activeDisplay ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
        >
          <Typography 
            variant="h1"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {currentNumber}
          </Typography>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default NumberDisplay;