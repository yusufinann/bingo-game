import React from 'react';
import { Typography, Box, useTheme} from '@mui/material';

const ActiveNumbers = ({ activeNumbers, bingoMode,t }) => {
   const theme = useTheme();
  if (bingoMode === 'classic' || bingoMode === 'superfast' || !activeNumbers || activeNumbers.length === 0) {
    return null;
  }
 
  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold"  gutterBottom>
        {t("Active Numbers")}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {activeNumbers.map((num, index) => (
          <Box
            key={index}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.primary.contrastText,
              fontSize: '1rem',
              fontWeight: 'bold',
              boxShadow: 3,
            }}
          >
            {num}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default ActiveNumbers;
