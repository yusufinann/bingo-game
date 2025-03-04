import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const DrawnNumbers = ({ drawnNumbers }) => {
  const isNumberDrawn = (number) => drawnNumbers.includes(number);

  return (
    <Paper 
      elevation={3}
      sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}
    >
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        Drawn Numbers
      </Typography>
      <Grid container spacing={0.5}>
        {Array.from({ length: 90 }, (_, i) => i + 1).map(number => (
          <Grid item xs={1} key={number}>
            <Paper
              elevation={1}
              sx={{
                p: 0.5,
                textAlign: 'center',
                minWidth: 30,
                bgcolor: isNumberDrawn(number) ? 'primary.light' : 'background.paper',
                color: isNumberDrawn(number) ? 'white' : 'text.primary',
                transition: 'all 0.3s ease',
                opacity: isNumberDrawn(number) ? 1 : 0.7
              }}
            >
              {number}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default DrawnNumbers;
