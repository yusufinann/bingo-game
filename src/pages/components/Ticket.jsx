import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const Ticket = ({ ticket, markedNumbers = [], activeNumbers = [], onMarkNumber }) => {
  // Her satır için boş/dolu pozisyonları tanımlama
  const rowPatterns = [
    [true, false, true, false, true, false, true, true, false], // İlk satır
    [true, true, false, true, false, true, false, true, false], // İkinci satır
    [true, false, true, false, true, false, true, false, true]  // Üçüncü satır
  ];

  const renderTicket = () => {
    return rowPatterns.map((pattern, rowIndex) => {
      let numberIndex = 0;
      const rowStart = rowIndex * 5; // Her satır için ticket array'inden başlangıç indexi

      return (
        <Grid container key={rowIndex} sx={{ mb: rowIndex < 2 ? 0 : 0 }}>
          {pattern.map((hasNumber, cellIndex) => {
            const currentNumber = hasNumber ? ticket[rowStart + numberIndex++] : null;
            const isMarked = currentNumber && markedNumbers.includes(currentNumber);
            const isActive = currentNumber && activeNumbers.includes(currentNumber);

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
                    border: '2px solid black',
                    borderRadius: 0,
                    // bgcolor: isMarked ? '#1976d2' : 'white',
                    // color: isMarked ? 'white' : '#1976d2',
                     // Background color logic updated
                     bgcolor: isMarked 
                     ? '#4caf50' // Green when marked
                     : hasNumber 
                       ? '#1976d2' // Blue for true squares
                       : 'white',  // White for false squares
                   // Text color logic
                   color: hasNumber ? 'white' : 'transparent',
                
                    cursor: 'default',
                    m: 0,
                    p: 0,
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
     <Box sx={{display: 'flex', alignItems: 'center',justifyContent:'center'}}>
    <Box
      sx={{
        width: '60%',
        //maxWidth: '400px',
        border: '2px solid #1976d2',
        p: 0.5,
        bgcolor: 'white'
      }}
    >
      {renderTicket()}
    </Box>
    </Box>
  );
};

export default Ticket;