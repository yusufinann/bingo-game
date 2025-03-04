import React from 'react';
import { Stack, Chip } from '@mui/material';

const ActiveNumbers = ({ activeNumbers }) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
      {activeNumbers && activeNumbers.map((num, index) => (
        <Chip key={index} label={num} color="primary" />
      ))}
    </Stack>
  );
};

export default ActiveNumbers;
