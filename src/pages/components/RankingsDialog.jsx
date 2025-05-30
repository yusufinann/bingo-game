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
  useTheme,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import GamesIcon from '@mui/icons-material/Games';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import PersonIcon from '@mui/icons-material/Person';

const StyledTableRow = styled(TableRow)(({ theme, rank }) => ({
  transition: 'all 0.3s ease',
  backgroundColor: rank === 1
    ? 'rgba(255, 215, 0, 0.15)'
    : rank === 2
    ? 'rgba(192, 192, 192, 0.1)'
    : rank === 3
    ? 'rgba(205, 127, 50, 0.1)'
    : 'inherit',
  '&:hover': {
    backgroundColor: rank === 1
      ? 'rgba(255, 215, 0, 0.3)'
      : rank === 2
      ? 'rgba(192, 192, 192, 0.2)'
      : rank === 3
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

const RankBadge = styled(Box)(({ theme, rank, isTied }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  width: 40,
  height: 40,
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  backgroundColor:
    rank === 1 ? '#FFD700' :
    rank === 2 ? '#C0C0C0' :
    rank === 3 ? '#CD7F32' :
    theme.palette.grey[500],
  border: isTied ? '3px solid rgba(255,255,255,0.8)' : 'none',
  boxShadow: isTied ? '0 0 12px rgba(0,0,0,0.3)' : 'none',
}));

const PlayerChip = styled(Chip)(({ theme, rank }) => ({
  margin: '2px',
  fontWeight: rank <= 3 ? 'bold' : 'normal',
  backgroundColor: 
    rank === 1 ? 'rgba(255, 215, 0, 0.2)' :
    rank === 2 ? 'rgba(192, 192, 192, 0.2)' :
    rank === 3 ? 'rgba(205, 127, 50, 0.2)' :
    theme.palette.grey[100],
  '&:hover': {
    backgroundColor: 
      rank === 1 ? 'rgba(255, 215, 0, 0.3)' :
      rank === 2 ? 'rgba(192, 192, 192, 0.3)' :
      rank === 3 ? 'rgba(205, 127, 50, 0.3)' :
      theme.palette.grey[200],
  }
}));

const ScoreBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));

const TiedLabel = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.contrastText,
  fontSize: '0.75rem',
  height: '22px',
  fontWeight: 'bold',
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
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
  t = (text) => text
}) => {
  const [confirmClose, setConfirmClose] = useState(false);
  const theme = useTheme();

  // Aynı rank'e sahip oyuncuları grupla
  const groupedRankings = React.useMemo(() => {
    const rankGroups = {};
    rankings.forEach(player => {
      const rank = player.rank;
      if (!rankGroups[rank]) {
        rankGroups[rank] = [];
      }
      rankGroups[rank].push(player);
    });

    // Her rank için bir satır oluştur
    return Object.keys(rankGroups)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(rank => {
        const players = rankGroups[rank];
        const isTied = players.length > 1;
        
        return {
          rank: parseInt(rank),
          players: players,
          isTied: isTied,
          score: players[0].score, // Aynı score olduğu için ilkini al
          allCompleted: players.every(p => p.completedAt),
          someCompleted: players.some(p => p.completedAt)
        };
      });
  }, [rankings]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <EmojiEventsIcon sx={{ color: '#FFD700' }} />;
      case 2: return <MilitaryTechIcon sx={{ color: '#C0C0C0' }} />;
      case 3: return <MilitaryTechIcon sx={{ color: '#CD7F32' }} />;
      default: return <SportsMartialArtsIcon color="action" />;
    }
  };

  const getStatusForGroup = (group) => {
    if (group.allCompleted) return 'Completed';
    if (group.someCompleted) return 'Mixed';
    return 'In Progress';
  };

  const getStatusChipColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Mixed': return 'warning';
      case 'In Progress': return 'info';
      default: return 'default';
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
            {t(dialogTitle)}
          </Typography>
          {lobbyCode && (
            <Chip
              label={`${t('Lobby')}: ${lobbyCode}`}
              color="default"
              size="small"
              sx={{ ml: 'auto', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
        </StyledDialogTitle>

        <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.dark }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>{t("Rank")}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t("Players")}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>{t("Score")}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>{t("Status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedRankings.map((group, index) => (
                  <Grow in={true} timeout={500 + (index * 150)} key={group.rank}>
                    <StyledTableRow rank={group.rank}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'column' }}>
                          <RankBadge rank={group.rank} isTied={group.isTied}>
                            {group.rank}
                          </RankBadge>
                          {group.isTied && (
                            <TiedLabel 
                              label={`${group.players.length} tied`}
                              size="small"
                            />
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {getRankIcon(group.rank)}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                            {group.players.map((player, playerIndex) => (
                              <PlayerChip
                                key={player.playerId || playerIndex}
                                rank={group.rank}
                                label={player.userName || player.name || `Player ${player.playerId}`}
                                size="small"
                                icon={<PersonIcon />}
                                variant={player.completedAt ? "filled" : "outlined"}
                              />
                            ))}
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <ScoreBox>
                          <SportsScoreIcon color="action" />
                          {group.score}
                        </ScoreBox>
                      </TableCell>
                      
                      <TableCell>
                        <StatusChip
                          label={t(getStatusForGroup(group))}
                          color={getStatusChipColor(getStatusForGroup(group))}
                          size="small"
                          icon={group.allCompleted ? <SportsScoreIcon /> : undefined}
                        />
                        {group.isTied && getStatusForGroup(group) === 'Mixed' && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {group.players.filter(p => p.completedAt).length}/{group.players.length} completed
                          </Typography>
                        )}
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
              bgcolor:'rgba(0, 0, 0, 0.04)',
              borderRadius: 2,
              alignItems: 'center',
              gap: 1,
              mt: 2
            }}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h6" color="text.primary">
                {t('Game Complete! Well played everyone!')}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100] }}>
          {gameState?.gameEnded && onGameReset && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<RestartAltIcon />}
              onClick={onGameReset}
            >
              {t('Play Again')}
            </Button>
          )}

          <Box sx={{ ml: 'auto' }}>
            {showCloseButton && (
              <Button
                onClick={() => {
                  if (gameState && !gameState.gameEnded && rankings.some(r => !r.completedAt)) {
                    setConfirmClose(true);
                  } else {
                    onClose();
                  }
                }}
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
              >
                {t('Close')}
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
        <DialogTitle sx={{ bgcolor: theme.palette.warning.main, color: theme.palette.warning.contrastText }}>
          {t('Confirm Close')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            {t('The game is still in progress. Are you sure you want to close? Your current game state might not be saved if you proceed.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmClose(false)}
            color="inherit"
            variant="outlined"
          >
            {t('Cancel')}
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
            {t('Close Anyway')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RankingsDialog;