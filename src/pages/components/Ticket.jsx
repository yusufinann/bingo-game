import React from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';

const Ticket = ({ ticket, markedNumbers = [], activeNumbers = [], onMarkNumber, playerColor,t }) => {
  const theme = useTheme();

  if (!ticket || !ticket.layout || !ticket.numbersGrid) {
    return <Typography>{t("TicketLoading")}</Typography>;
  }

  const { layout: ticketLayout, numbersGrid: ticketNumbersGrid } = ticket;

  const basePlayerColor = playerColor || theme.palette.primary.main;

  const renderTicket = () => {
    return ticketLayout.map((rowPattern, rowIndex) => {
      return (
        <Grid container key={rowIndex} wrap="nowrap">
          {rowPattern.map((hasNumber, cellIndex) => {
            const currentNumber = ticketNumbersGrid[rowIndex][cellIndex];
            const isMarked = currentNumber && markedNumbers.includes(currentNumber);
            const isActive = currentNumber && activeNumbers.includes(currentNumber);

            let cellBgColor;
            let cellTextColor;

            if (isMarked) {
              cellBgColor = theme.palette.warning.main;
              cellTextColor = theme.palette.getContrastText(cellBgColor);
            } else if (hasNumber) {
              cellBgColor = basePlayerColor;
              try {
                cellTextColor = theme.palette.getContrastText(basePlayerColor);
              } catch (e) {
                console.warn("Geçersiz oyuncu rengi formatı, metin rengi için varsayılan kullanılıyor:", basePlayerColor);
                cellTextColor = theme.palette.common.black; 
              }

            } else {
              cellBgColor = theme.palette.background.paper;
              cellTextColor = 'transparent'; 
            }
            
            const canBeClicked = currentNumber && isActive && !isMarked && onMarkNumber;

            return (
              <Grid item xs key={cellIndex} sx={{ minWidth: '11.11%', maxWidth: '11.11%' }}>
                <Paper
                  elevation={0}
                  onClick={() => {
                    if (canBeClicked) {
                      onMarkNumber(currentNumber);
                    }
                  }}
                  sx={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400]}`, 
                    borderRadius: 0.5,
                    bgcolor: cellBgColor, 
                    color: cellTextColor, 
                    cursor: canBeClicked ? 'pointer' : 'default',
                    m: 0.25,
                    p: 0,
                    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out, color 0.2s ease-in-out',
                    userSelect: 'none',
                    '&:hover': {
                      opacity: canBeClicked ? 0.85 : 1,
                      transform: canBeClicked ? 'scale(1.05)' : 'none',
                    },
                  }}
                >
                  {currentNumber && (
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
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
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: theme.shadows[3],
        border: `3px solid ${basePlayerColor}`, 
        p: 0.5,
        width: '100%',
        margin: 'auto',
      }}
    >
      {renderTicket()}
    </Box>
  );
};

export default Ticket;