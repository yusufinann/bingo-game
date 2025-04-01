import React, { useState, useEffect } from 'react';
import { Paper, Typography, Zoom, Box } from '@mui/material'; // Import Box

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

  return (
    <Zoom in={activeDisplay}>
      <Paper
        elevation={6}
        sx={{
          width: 120,
          height: 120,
          mx: 'auto',
          mb: 4,
          mt:4,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.primary.main,
          color: 'white',
          opacity: manualMode && !activeDisplay ? 0.5 : 1,
          transition: 'opacity 0.5s ease',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -8,
            right: -8,
            bottom: -8,
            left: -8,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'primary.light',
            animation: activeDisplay ? 'pulse 1.5s infinite' : 'none'
          }
        }}
      >
        <Box  // Use Box to control visibility of Typography
          sx={{
            visibility: activeDisplay && currentNumber ? 'visible' : 'hidden', // Control visibility
          }}
        >
          <Typography variant="h2">
            {currentNumber}
          </Typography>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default NumberDisplay;