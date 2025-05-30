import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Paper,
  Chip,
  Zoom,
  useTheme,
  Avatar,
  Stack,
  Divider,
  Card,
  CardContent,
  Fade,
  Slide,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import GamesIcon from '@mui/icons-material/Games';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const RankingCard = styled(Card)(({ theme, rank }) => ({
  marginBottom: theme.spacing(1.5),
  background: rank === 1
    ? `linear-gradient(135deg, ${alpha('#FFD700', 0.1)} 0%, ${alpha('#FFA500', 0.05)} 100%)`
    : rank === 2
    ? `linear-gradient(135deg, ${alpha('#C0C0C0', 0.1)} 0%, ${alpha('#808080', 0.05)} 100%)`
    : rank === 3
    ? `linear-gradient(135deg, ${alpha('#CD7F32', 0.1)} 0%, ${alpha('#8B4513', 0.05)} 100%)`
    : theme.palette.background.paper,
  border: rank <= 3 ? `2px solid ${
    rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'
  }` : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: rank <= 3
      ? `0 10px 20px ${alpha(rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32', 0.25)}`
      : theme.shadows[6],
  }
}));

const RankBadge = styled(Avatar)(({ theme, rank }) => ({
  width: 52,
  height: 52,
  fontSize: '1.3rem',
  fontWeight: 'bold',
  background: rank === 1
    ? 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)'
    : rank === 2
    ? 'linear-gradient(45deg, #C0C0C0 30%, #808080 90%)'
    : rank === 3
    ? 'linear-gradient(45deg, #CD7F32 30%, #8B4513 90%)'
    : `linear-gradient(45deg, ${theme.palette.grey[400]} 30%, ${theme.palette.grey[600]} 90%)`,
  color: '#fff',
  boxShadow: rank <= 3 ? `0 3px 10px ${alpha('#000', 0.25)}` : theme.shadows[1],
  border: rank === 1 ? '2px solid rgba(255, 255, 255, 0.5)' : 'none'
}));

const PlayerChip = styled(Chip)(({ theme, rank, completed }) => ({
  margin: theme.spacing(0.25),
  padding: theme.spacing(0.25),
  height: 'auto',
  '& .MuiChip-label': {
    padding: theme.spacing(1),
    fontWeight: rank <= 3 ? 'bold' : 'medium',
    fontSize: '0.8rem'
  },
  background: completed
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.grey[500], 0.1),
  border: completed
    ? `1px solid ${alpha(theme.palette.success.main, 0.3)}`
    : `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
  '&:hover': {
    transform: 'scale(1.03)',
    background: completed
      ? alpha(theme.palette.success.main, 0.2)
      : alpha(theme.palette.grey[500], 0.2),
  }
}));

const StatusIndicator = styled(Box)(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(2.5),
  fontSize: '0.8rem',
  fontWeight: 'medium',
  background: status === 'Completed'
    ? alpha(theme.palette.success.main, 0.1)
    : status === 'Mixed'
    ? alpha(theme.palette.warning.main, 0.1)
    : alpha(theme.palette.info.main, 0.1),
  color: status === 'Completed'
    ? theme.palette.success.main
    : status === 'Mixed'
    ? theme.palette.warning.main
    : theme.palette.info.main,
  border: `1px solid ${status === 'Completed'
    ? alpha(theme.palette.success.main, 0.3)
    : status === 'Mixed'
    ? alpha(theme.palette.warning.main, 0.3)
    : alpha(theme.palette.info.main, 0.3)}`
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  }
}));

const ScoreDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  fontWeight: 'bold',
  fontSize: '1rem',
  color: theme.palette.primary.main
}));

const RankingsDialog = ({
  rankings,
  open,
  onClose,
  gameState,
  lobbyCode,
  onGameReset,
  dialogTitleKey = 'rankingsDialog.title',
  showCloseButton = true,
  t = (key, options) => key
}) => {
  const [confirmClose, setConfirmClose] = useState(false);
  const theme = useTheme();

  const groupedRankings = React.useMemo(() => {
    const rankGroups = {};
    rankings.forEach(player => {
      const rank = player.rank;
      if (!rankGroups[rank]) {
        rankGroups[rank] = [];
      }
      rankGroups[rank].push(player);
    });

    return Object.keys(rankGroups)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(rank => {
        const players = rankGroups[rank];
        const isTied = players.length > 1;
        const completedCount = players.filter(p => p.completedAt).length;
        const totalCountInGroup = players.length;

        return {
          rank: parseInt(rank),
          players: players,
          isTied: isTied,
          score: players[0].score,
          allCompleted: players.every(p => p.completedAt),
          someCompleted: players.some(p => p.completedAt),
          completedCount,
          totalCount: totalCountInGroup,
          completionPercentage: totalCountInGroup > 0 ? (completedCount / totalCountInGroup) * 100 : 0
        };
      });
  }, [rankings]);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: '1.75rem' }} />;
      case 2: return <MilitaryTechIcon sx={{ color: '#C0C0C0', fontSize: '1.25rem' }} />;
      case 3: return <MilitaryTechIcon sx={{ color: '#CD7F32', fontSize: '1.25rem' }} />;
      default: return <SportsMartialArtsIcon color="action" sx={{ fontSize: '1.25rem' }} />;
    }
  };

  const getStatusInfo = (group) => {
    if (group.allCompleted) {
      return {
        status: 'Completed',
        icon: <CheckCircleIcon fontSize="small" />,
        text: t('rankingsDialog.statusCompleted')
      };
    }
    if (group.someCompleted) {
      return {
        status: 'Mixed',
        icon: <TimerIcon fontSize="small" />,
        text: t('rankingsDialog.statusMixed')
      };
    }
    return {
      status: 'In Progress',
      icon: <PendingIcon fontSize="small" />,
      text: t('rankingsDialog.statusInProgress')
    };
  };

  const getTotalPlayers = () => rankings.length;
  const getCompletedPlayers = () => rankings.filter(r => r.completedAt).length;


  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={onClose}
        TransitionComponent={Zoom}
        transitionDuration={600}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            maxHeight: '90vh'
          }
        }}
      >
        <StyledDialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <GamesIcon sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 0.25 }}>
                  {t(dialogTitleKey)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {getCompletedPlayers()}/{getTotalPlayers()} {t("Player Completed")}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              {lobbyCode && (
                <Chip
                  label={`Lobby: ${lobbyCode}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'medium'
                  }}
                />
              )}
              <Tooltip title="Kapat">
                <IconButton
                  onClick={onClose}
                  sx={{ color: 'white' }}
                  size="medium"
                >
                  <CloseIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </StyledDialogTitle>

        <DialogContent sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 1.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
            }}
          >
          </Paper>

          <Stack spacing={1.5}>
            {groupedRankings.map((group, index) => {
              const statusInfo = getStatusInfo(group);

              return (
                <Fade
                  in={true}
                  timeout={600 + (index * 150)}
                  key={group.rank}
                >
                  <RankingCard rank={group.rank} elevation={group.rank <= 3 ? 4 : 1}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ position: 'relative', minWidth: 52 }}>
                          <RankBadge rank={group.rank}>
                            #{group.rank}
                          </RankBadge>
                          {group.rank === 1 && (
                            <StarIcon
                              sx={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                color: '#FFD700',
                                fontSize: '1.2rem',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                              }}
                            />
                          )}
                          {group.isTied && (
                            <Badge
                              badgeContent="TIE"
                              color="warning"
                              sx={{
                                position: 'absolute',
                                bottom: -8,
                                right: -8,
                                '& .MuiBadge-badge': {
                                  fontSize: '0.5rem',
                                  minWidth: '28px',
                                  height: '14px',
                                  padding: '0 4px'
                                }
                              }}
                            />
                          )}
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            {getRankIcon(group.rank)}
                            <Typography variant="subtitle1" fontWeight="bold">
                              {group.isTied ? `${group.players.length} Oyuncu Beraberlikte` : 'Oyuncu'}
                            </Typography>
                          </Stack>

                          <Stack direction="row" flexWrap="wrap" gap={0.5} mb={1}>
                            {group.players.map((player, playerIndex) => (
                              <PlayerChip
                                key={player.playerId || playerIndex}
                                rank={group.rank}
                                completed={Boolean(player.completedAt)}
                                icon={<PersonIcon sx={{ fontSize: '0.9rem' }} />}
                                label={
                                  <Typography  variant="h2" fontWeight="inherit" sx={{ display: 'flex',fontSize:'0.9rem', alignItems: 'center' }}>
                                    {player.userName || player.name || `Oyuncu ${player.playerId}`}
                                    {player.completedAt && (
                                      <CheckCircleIcon
                                        sx={{ fontSize: '0.9rem', color: theme.palette.success.main, ml: 0.5 }}
                                      />
                                    )}
                                  </Typography>
                                }
                                variant={player.completedAt ? "filled" : "outlined"}
                                size="small"
                              />
                            ))}
                          </Stack>

                          {group.someCompleted && !group.allCompleted && (
                            <Box sx={{ mb: 0.5 }}>
                              <Stack direction="row" justifyContent="space-between" mb={0.25}>
                                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                                  {t("Completed")}: {group.completedCount}/{group.totalCount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                                  {Math.round(group.completionPercentage)}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={group.completionPercentage}
                                sx={{
                                  height: 3,
                                  borderRadius: 1.5,
                                  backgroundColor: alpha(theme.palette.grey[500], 0.2)
                                }}
                              />
                            </Box>
                          )}
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        <Stack alignItems="center" spacing={1} sx={{ minWidth: 120 }}>
                          <ScoreDisplay>
                            <SportsScoreIcon fontSize="medium" />
                            <Typography variant="h3">
                              {group.score}
                            </Typography>
                          </ScoreDisplay>

                          <StatusIndicator status={statusInfo.status}>
                            {React.cloneElement(statusInfo.icon, { sx: { fontSize: '1rem' }})}
                            <Typography variant="subtitle1" fontWeight="medium">
                              {statusInfo.text}
                            </Typography>
                          </StatusIndicator>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </RankingCard>
                </Fade>
              );
            })}
          </Stack>

          {gameState?.gameEnded && (
            <Slide direction="up" in={true} timeout={800}>
              <Paper
                elevation={6}
                sx={{
                  mt: 2,
                  p: 1,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  borderRadius: 2
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h3" fontWeight="bold" color="success.main">
                    🎉 {t('rankingsDialog.gameCompleteMessage')} 🎉
                  </Typography>
                </Stack>
              </Paper>
            </Slide>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 1.5,
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`
          }}
        >
          <Stack direction="row" justifyContent="space-between" width="100%">
            {gameState?.gameEnded && onGameReset && (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<RestartAltIcon />}
                onClick={onGameReset}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 2.5
                }}
              >
                {t('rankingsDialog.playAgainButton')}
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
                  size="medium"
                  startIcon={<CancelIcon />}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 2.5
                  }}
                >
                  {t('rankingsDialog.closeButton')}
                </Button>
              )}
            </Box>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        PaperProps={{
          elevation: 10,
          sx: {
            borderRadius: 2,
            minWidth: 360
          }
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            textAlign: 'center',
            p: 1.5
          }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <CancelIcon sx={{ fontSize: '1.75rem' }} />
            <Typography variant="h6" fontWeight="bold">
              {t('rankingsDialog.confirmCloseDialog.title')}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('rankingsDialog.confirmCloseDialog.message')}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 1.5, justifyContent: 'center', gap: 1.5 }}>
          <Button
            onClick={() => setConfirmClose(false)}
            variant="outlined"
            color="inherit"
            size="medium"
            sx={{ borderRadius: 1.5, textTransform: 'none', minWidth: 100 }}
          >
            {t('rankingsDialog.cancelButton')}
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
            size="medium"
            startIcon={<CancelIcon />}
            sx={{ borderRadius: 1.5, textTransform: 'none', minWidth: 100 }}
          >
            {t('rankingsDialog.closeAnywayButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RankingsDialog;