import React from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';

const Ticket = ({ ticket, markedNumbers = [], activeNumbers = [], onMarkNumber }) => {
  const theme = useTheme();
  
  // Row patterns for ticket layout
  const rowPatterns = [
    [true, false, true, false, true, false, true, true, false], // First row
    [true, true, false, true, false, true, false, true, false], // Second row
    [true, false, true, false, true, false, true, false, true]  // Third row
  ];

  const renderTicket = () => {
    return rowPatterns.map((pattern, rowIndex) => {
      let numberIndex = 0;
      const rowStart = rowIndex * 5; // Starting index for each row from ticket array

      return (
        <Grid container key={rowIndex}>
          {pattern.map((hasNumber, cellIndex) => {
            const currentNumber = hasNumber ? ticket[rowStart + numberIndex++] : null;
            const isMarked = currentNumber && markedNumbers.includes(currentNumber);
            const isActive = currentNumber && activeNumbers.includes(currentNumber);

            // Get appropriate colors based on theme
            const cellBgColor = isMarked 
              ? theme.palette.warning.main
              : hasNumber 
                ? theme.palette.primary.main
                : theme.palette.background.paper;

            const cellColor = hasNumber 
              ? theme.palette.primary.contrastText 
              : 'transparent';

            return (
              <Grid item xs key={cellIndex}>
                <Paper
                  elevation={0}
                  onClick={() => {
                    if (currentNumber && isActive && !isMarked && onMarkNumber) {
                      onMarkNumber(currentNumber);
                    }
                  }}
                  sx={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 0,
                    bgcolor: cellBgColor,
                    color: cellColor,
                    cursor: isActive && !isMarked ? 'pointer' : 'default',
                    m: 0,
                    p: 0,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      opacity: isActive && !isMarked ? 0.9 : 1,
                    }
                  }}
                >
                  {currentNumber && (
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      sx={{
                        fontSize: '1rem',
                        userSelect: 'none'
                      }}
                    >
                      {currentNumber}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      );
    });
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: theme.shadows[2]
      }}
    >
      <Box
        sx={{
          width: '100%',
          border: `2px solid ${theme.palette.primary.main}`,
          p: 0.5,
          bgcolor: theme.palette.background.paper
        }}
      >
        {renderTicket()}
      </Box>
    </Box>
  );
};

export default Ticket;