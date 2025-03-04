import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
