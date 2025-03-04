import React, { useState } from 'react';
import {
  TableBody,
  TableCell,
  Table,
  TableHead,
  Button,
  Dialog,
  DialogTitle,
  TableRow,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography,
  Box,
  Paper,
  Chip,
  Zoom,
  Grow,
  Avatar,
  IconButton,
  Tooltip,
  useTheme
} from "@mui/material";
import { styled } from '@mui/material/styles';
import GamesIcon from '@mui/icons-material/Games';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';

// Styled components for fun visual elements
const StyledTableRow = styled(TableRow)(({ theme, rank }) => ({
  transition: 'all 0.3s ease',
  backgroundColor: rank === 0 
    ? 'rgba(255, 215, 0, 0.15)' 
    : rank === 1 
      ? 'rgba(192, 192, 192, 0.1)' 
      : rank === 2 
        ? 'rgba(205, 127, 50, 0.1)' 
        : theme.palette.action.hover,
  '&:hover': {
    backgroundColor: rank === 0 
      ? 'rgba(255, 215, 0, 0.3)' 
      : rank === 1 
        ? 'rgba(192, 192, 192, 0.2)' 
        : rank === 2 
          ? 'rgba(205, 127, 50, 0.2)' 
          : theme.palette.action.selected,
    transform: 'scale(1.01)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  backgroundColor: status === 'Completed' 
    ? theme.palette.success.light
    : theme.palette.info.light,
  color: status === 'Completed' 
    ? theme.palette.success.contrastText
    : theme.palette.info.contrastText,
}));

const RankBadge = styled(Box)(({ theme, rank }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  width: 36,
  height: 36,
  color: '#fff',
  fontWeight: 'bold',
  backgroundColor: 
    rank === 0 ? '#FFD700' :  // Gold
    rank === 1 ? '#C0C0C0' :  // Silver
    rank === 2 ? '#CD7F32' :  // Bronze
    theme.palette.grey[500],   // Regular
}));

const ScoreBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontWeight: 'bold',
  fontSize: '1.1rem',
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

const RankingsDialog = ({
  rankings,
  open,
  onClose,
  gameState,
  lobbyCode,
  onGameReset,
  dialogTitle = 'Game Rankings',
  showCloseButton = true,
  gameId
}) => {
  const [confirmClose, setConfirmClose] = useState(false);
  const theme = useTheme();

  // Function to get rank icon based on position
  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <EmojiEventsIcon sx={{ color: '#FFD700' }} />;
      case 1: return <MilitaryTechIcon sx={{ color: '#C0C0C0' }} />;
      case 2: return <MilitaryTechIcon sx={{ color: '#CD7F32' }} />;
      default: return <SportsMartialArtsIcon color="action" />;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        maxWidth="md" 
        fullWidth 
        onClose={onClose}
        TransitionComponent={Zoom}
        transitionDuration={500}
        PaperProps={{
          elevation: 12,
          sx: { 
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <StyledDialogTitle>
          <GamesIcon fontSize="large" />
          <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
            {dialogTitle}
          </Typography>
          {lobbyCode && (
            <Chip 
              label={`Lobby: ${lobbyCode}`} 
              color="secondary" 
              size="small" 
              sx={{ ml: 'auto' }}
            />
          )}
        </StyledDialogTitle>
        
        <DialogContent sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.dark }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Player</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankings.map((rank, index) => (
                  <Grow in={true} timeout={500 + (index * 150)} key={rank.playerId}>
                    <StyledTableRow rank={index}>
                      <TableCell>
                        <RankBadge rank={index}>
                          {index + 1}
                        </RankBadge>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getRankIcon(index)}
                          <Typography variant="body1" sx={{ fontWeight: index < 3 ? 'bold' : 'regular' }}>
                            {rank.userName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <ScoreBox>
                          <SportsScoreIcon color="action" />
                          {rank.score}
                        </ScoreBox>
                      </TableCell>
                      <TableCell>
                        <StatusChip 
                          label={rank.completedAt ? 'Completed' : 'In Progress'} 
                          status={rank.completedAt ? 'Completed' : 'In Progress'}
                          size="small"
                          icon={rank.completedAt ? <SportsScoreIcon /> : null}
                        />
                      </TableCell>
                    </StyledTableRow>
                  </Grow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          
          {gameState?.gameEnded && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 2, 
              bgcolor: 'rgba(0, 0, 0, 0.04)', 
              borderRadius: 2,
              alignItems: 'center',
              gap: 1
            }}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h6" color="primary">
                Game Complete! Well played everyone!
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
          {gameState?.gameEnded && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RestartAltIcon />}
              onClick={() => {
                if (typeof onGameReset === 'function') {
                  onGameReset();
                }
              }}
            >
              Play Again
            </Button>
          )}
          
          <Box sx={{ ml: 'auto' }}>
            {showCloseButton && (
              <Button 
                onClick={() => {
                  if (!gameState?.gameEnded && rankings.some(r => !r.completedAt)) {
                    setConfirmClose(true);
                  } else {
                    onClose();
                  }
                }}
                variant="outlined" 
                color="secondary"
                startIcon={<CancelIcon />}
              >
                Close
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={confirmClose} 
        onClose={() => setConfirmClose(false)}
        PaperProps={{ elevation: 8, sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}>
          Unsaved Progress
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            You haven't saved your game progress. Closing now will mean your statistics won't be recorded. Continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setConfirmClose(false)} 
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmClose(false);
              if (typeof onGameReset === 'function') {
                onGameReset();
              }
              onClose();
            }}
            color="error"
            variant="contained"
            startIcon={<CancelIcon />}
          >
            Close Without Saving
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RankingsDialog;