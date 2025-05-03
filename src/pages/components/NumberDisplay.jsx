import React, { useState, useEffect } from 'react';
import { Paper, Typography, Zoom, Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const NumberDisplay = ({ currentNumber, manualMode = false, bingoMode }) => {
  const theme = useTheme();
  const [activeDisplay, setActiveDisplay] = useState(false);

  // Create a dynamic pulse animation based on theme colors
  const pulseAnimation = keyframes`
    0% {
      box-shadow: 0 0 0 0 ${theme.palette.primary.main}80;
    }
    70% {
      box-shadow: 0 0 0 12px ${theme.palette.primary.main}00;
    }
    100% {
      box-shadow: 0 0 0 0 ${theme.palette.primary.main}00;
    }
  `;

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
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          opacity: manualMode && !activeDisplay ? 0.5 : 1,
          transition: 'opacity 0.3s ease',
          position: 'relative',
          border: '3px solid',
          borderColor: theme.palette.primary.light,
          padding: 2,
          ...animationStyle,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            borderRadius: '50%',
            background: theme.palette.background.gradient,
            zIndex: -1,
            opacity: 0.4
          }
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
            variant="h2"
            sx={{
              fontWeight: 'bold',
              textShadow: `0 2px 4px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)'}`,
              userSelect: 'none'
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