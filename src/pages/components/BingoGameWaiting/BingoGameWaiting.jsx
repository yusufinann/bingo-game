import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  useMediaQuery,
  useTheme,
  Fade,
  Grid,
  Container,
} from "@mui/material";
import StartGameDialog from "./StartGameDialog";
import LobbyHeader from "./LobbyHeader";
import PlayerListCard from "./PlayerListCard";
import GameActionsCard from "./GameActionsCard";
import ActiveGameErrorAlert from "./ActiveGameErrorAlert"; 

const BingoGameWaiting = ({
  lobbyInfo,
  isCurrentUserHost,
  openStartDialog,
  setOpenStartDialog,
  drawMode,
  setDrawMode,
  selectedDrawer,
  setSelectedDrawer,
  selectedBingoMode,
  setSelectedBingoMode,
  startGameWithOptions,
  competitionMode,
  setCompetitionMode,
  t,
  currentUser,
  gameState,
  activeInOtherGameError,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [canStartGame, setCanStartGame] = useState(false);
    const gamePlayers = useMemo(() => gameState?.players || [], [gameState?.players]);

  useEffect(() => {
    if (activeInOtherGameError) {
      setCanStartGame(false);
    } else {
      setCanStartGame(gamePlayers.length > 1);
    }
  }, [gamePlayers, lobbyInfo?.maxMembers, activeInOtherGameError]); 

  const getAvatarColor = (userId) => {
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
    ];
    if (!userId) return colors[0]; 
    const hash = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Fade in timeout={700}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            width: "100%",
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.primary.light}22 0%, transparent 70%)`,
              zIndex: 0
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.secondary.light}22 0%, transparent 70%)`,
              zIndex: 0
            }}
          />

         
          <ActiveGameErrorAlert errorData={activeInOtherGameError} t={t} />

         
          {!activeInOtherGameError && (
            <>
              <LobbyHeader
                isMobile={isMobile}
                isCurrentUserHost={isCurrentUserHost}
                t={t}
              />
              <Grid container spacing={4} sx={{ mt: 2, zIndex: 1, position: "relative" }}>
                <Grid item xs={12} md={6}>
                  <PlayerListCard
                    gamePlayers={gamePlayers}
                    lobbyInfo={lobbyInfo}
                    currentUser={currentUser}
                    getAvatarColor={getAvatarColor}
                    getInitials={getInitials}
                    t={t}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <GameActionsCard
                    isMobile={isMobile}
                    isCurrentUserHost={isCurrentUserHost}
                    gamePlayers={gamePlayers}
                    lobbyInfo={lobbyInfo}
                    canStartGame={canStartGame}
                    setOpenStartDialog={setOpenStartDialog}
                    t={t}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Fade>

      {!activeInOtherGameError && isCurrentUserHost && (
        <StartGameDialog
          open={openStartDialog}
          onClose={() => setOpenStartDialog(false)}
          drawMode={drawMode}
          setDrawMode={setDrawMode}
          selectedDrawer={selectedDrawer}
          setSelectedDrawer={setSelectedDrawer}
          selectedBingoMode={selectedBingoMode}
          setSelectedBingoMode={setSelectedBingoMode}
          members={gamePlayers}
          onStartGame={startGameWithOptions}
          competitionMode={competitionMode}
          setCompetitionMode={setCompetitionMode}
          t={t}
        />
      )}
    </Container>
  );
};

export default BingoGameWaiting;