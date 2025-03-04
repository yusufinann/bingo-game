import React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';

const Countdown = ({ countdown }) => {
  return (
    <Dialog open={countdown !== null} PaperProps={{ sx: { textAlign: 'center', p: 4 } }}>
      <DialogContent>
        <Typography variant="h2">{countdown}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default Countdown;
