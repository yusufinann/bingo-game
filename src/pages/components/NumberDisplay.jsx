import React, { useState, useEffect } from 'react';
import { Paper, Typography, Zoom, Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const NumberDisplay = ({ currentNumber, manualMode = false, bingoMode }) => {
  const theme = useTheme();
  const [activeDisplay, setActiveDisplay] = useState(false);

  const pulseAnimation = keyframes`
    0% {
      box-shadow: 0 0 0 0 ${theme.palette.primary.main}80;
    }
    70% {
      box-shadow: 0 0 0 10px ${theme.palette.primary.main}00; /* Pulse biraz küçültüldü */
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
        displayTime = 10000;
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
  } : {};

  return (
    <Zoom
      in={activeDisplay}
      timeout={300}
    >
      <Paper
        elevation={6}
        sx={{
          height: '65%', 
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          opacity: manualMode && !activeDisplay ? 0.5 : 1,
          transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          border: '2px solid', 
          borderColor: theme.palette.primary.light,
          padding: 1.5, 
          ...animationStyle,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -3, 
            left: -3,
            right: -3,
            bottom: -3,
            borderRadius: '50%',
            background: theme.palette.background.gradient,
            zIndex: -1,
            opacity: 0.3
          }
        }}
      >
        <Box
          sx={{
            visibility: activeDisplay && currentNumber ? 'visible' : 'hidden',
            opacity: activeDisplay && currentNumber ? 1 : 0,
            transform: activeDisplay ? 'scale(1.05)' : 'scale(1)', 
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        >
          <Typography
            variant="h2" 
            sx={{
              textAlign: 'center',
              textShadow: `0 1px 3px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)'}`,
              userSelect: 'none',
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