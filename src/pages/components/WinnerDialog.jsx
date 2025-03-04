import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, Chip, Button, Box } from '@mui/material';
import { Celebration as CelebrationIcon, Casino as CasinoIcon } from '@mui/icons-material';

const WinnerDialog = ({ winnerDetails, currentUser, onClose }) => {
  if (!winnerDetails) return null;
  
  return (
    <Dialog 
      open={!!winnerDetails} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, maxWidth: 400 }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        bgcolor: 'success.main',
        color: 'white',
        pb: 3
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CelebrationIcon sx={{ fontSize: 60, mb: 2, animation: 'bounce 1s infinite alternate' }} />
          <Typography variant="h5" gutterBottom>
            {winnerDetails?.id === currentUser?.id
              ? '🎉 You won! 🎉'
              : `${winnerDetails?.name} won!`}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Winning ticket:
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
          {winnerDetails?.ticket.map((number, index) => (
            <Chip 
              key={index}
              label={number}
              color="success"
              sx={{ fontWeight: 'bold' }}
            />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Game complete! You can start a new game.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained"
          color="primary"
          onClick={onClose}
          startIcon={<CasinoIcon />}
          sx={{ borderRadius: 2, px: 4 }}
        >
          New Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WinnerDialog;
