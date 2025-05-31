import React, { useEffect, useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useBingoSocket from "../hooks/useBingoSocket";
import useBingoSound from "../hooks/useBingoSound";
import useBingoGame from "../hooks/useBingoGame";
import Ticket from "./components/Ticket";
import NumberDisplay from "./components/NumberDisplay";
import DrawnNumbers from "./components/DrawnNumbers";
import NotificationSnackbar from "./components/NotificationSnackbar";
import CountdownScreen from "./components/CountdownScreen";
import ActiveNumbers from "./components/ActiveNumbers";
import RankingsDialog from "./components/RankingsDialog";
import BingoGameWaiting from "./components/BingoGameWaiting/BingoGameWaiting";
import CompletedPlayers from "./components/CompletedPlayers";
import GameControls from "./components/GameControls";
import PlayerDropdownMenu from "./components/PlayerDropdownMenu";

const BingoGame = ({
  members,
  lobbyInfo,
  lobbyCode,
  socket,
  currentUser,
  soundEnabled,
  toggleSound,
  soundEnabledRef,
  t
}) => {
  const theme = useTheme();
  const palette = theme.palette;
  const textColors = palette.text;
  const primaryColors = palette.primary;
  const secondaryColors = palette.secondary;

  const { playSound } = useBingoSound(soundEnabledRef);

  const {
    openStartDialog,
    setOpenStartDialog,
    drawMode,
    setDrawMode,
    selectedDrawer,
    setSelectedDrawer,
    selectedBingoMode,
    setSelectedBingoMode,
    competitionMode,
    setCompetitionMode,
    isDrawButtonDisabled,
    isCurrentUserHost,
    handleDrawButton,
  } = useBingoGame(members, currentUser);

  const {
    gameState,
    markedNumbers,
    notification,
    countdown,
    completedPlayers,
    hasCompletedBingo,
    showRankingsDialog,
    showPersonalRankingsDialog,
    currentPlayerColor,
    startGameWithOptions,
    drawNumber: socketDrawNumber,
    callBingo,
    handleMarkNumber,
    onGameReset,
    handleCloseNotification,
    setShowPersonalRankingsDialog,
    handleCloseRankingsDialog
  } = useBingoSocket({
    socket,
    lobbyCode,
    currentUser,
    members,
    soundEnabledRef,
    playSoundCallback: playSound,
    t
  });

  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      setShowCountdown(true);
    } else {
      setShowCountdown(false);
    }
  }, [countdown]);

  const drawNumber = () => {
    handleDrawButton(gameState);
    socketDrawNumber();
  };

  const handleStartGame = () => {
    startGameWithOptions({
      drawMode,
      drawer: drawMode === "manual" ? selectedDrawer : null,
      bingoMode: selectedBingoMode,
      competitionMode,
    });
    setOpenStartDialog(false);
  };

  if (!socket) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          {t("Waiting for connection...")}
        </Typography>
      </Box>
    );
  }

  if (showCountdown && countdown > 0) {
    return <CountdownScreen countdown={countdown} t={t}/>;
  }

  const gamePlayers = gameState?.players || [];
  return (
    <Container  sx={{ width: "100%", height: "100%",py: 2,overflow: 'auto' }}>
      {(!gameState.gameStarted && !showRankingsDialog && !showPersonalRankingsDialog) ? (
        <BingoGameWaiting
          gameState={gameState}
          lobbyInfo={lobbyInfo}
          isCurrentUserHost={isCurrentUserHost}
          openStartDialog={openStartDialog}
          setOpenStartDialog={setOpenStartDialog}
          drawMode={drawMode}
          setDrawMode={setDrawMode}
          selectedDrawer={selectedDrawer}
          setSelectedDrawer={setSelectedDrawer}
          selectedBingoMode={selectedBingoMode}
          setSelectedBingoMode={setSelectedBingoMode}
          startGameWithOptions={handleStartGame}
          competitionMode={competitionMode}
          setCompetitionMode={setCompetitionMode}
          currentUser={currentUser}
          t={t}
        />
      ) : (
        <CardContent sx={{ p: {xs: 1, sm: 2, md: 3} } }>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            mb={3}
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <GameControls
              secondaryColors={secondaryColors}
              primaryColors={primaryColors}
              textColors={textColors}
              gameState={gameState}
              hasCompletedBingo={hasCompletedBingo}
              currentUser={currentUser}
              drawNumber={drawNumber}
              isDrawButtonDisabled={isDrawButtonDisabled}
              callBingo={callBingo}
              toggleSound={toggleSound}
              soundEnabled={soundEnabled}
              t={t}
            />
            
            <PlayerDropdownMenu
              gamePlayers={gamePlayers}
              lobbyInfo={lobbyInfo}
              currentUser={currentUser}
              t={t}
            />
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "wrap",
              gap: 3,
              marginBottom: 2,
            }}
          >
            <Box sx={{ flex: {md: "3"}, width: '100%', minWidth: { xs: '100%', md: '300px'} }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <TrophyIcon color="primary" />
                {t("Your Ticket")}
              </Typography>
              <Ticket
                ticket={gameState.ticket}
                markedNumbers={markedNumbers}
                activeNumbers={gameState.activeNumbers}
                onMarkNumber={handleMarkNumber}
                playerColor={currentPlayerColor}
                t={t}
              />
            </Box>
            <Box sx={{ flex: {md: "1"}, width: '100%', minWidth: { xs: '100%', md: '200px'} }}>
              <NumberDisplay
                currentNumber={gameState.currentNumber}
                theme={theme}
                manualMode={gameState.drawMode === "manual"}
                bingoMode={gameState.bingoMode}
              />
              <ActiveNumbers
                activeNumbers={gameState.activeNumbers}
                bingoMode={gameState.bingoMode}
                t={t}
              />
            </Box>
          </Box>

          <DrawnNumbers drawnNumbers={gameState.drawnNumbers} t={t}/>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1, mb: 2 }}
          >
            {gameState.drawnNumbers.length}/{gameState.bingoMode === 'classic' || gameState.bingoMode === 'customClassic' ? 90 : 90} {t("Drawn Numbers")}
          </Typography>
          <CompletedPlayers completedPlayers={completedPlayers} t={t}/>
        </CardContent>
      )}

      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
      <RankingsDialog
        open={showRankingsDialog}
        onClose={handleCloseRankingsDialog}
        rankings={gameState.rankings}
        gameState={gameState}
        lobbyCode={lobbyCode}
        onGameReset={onGameReset}
        gameId={gameState.gameId}
        t={t}
      />
      <RankingsDialog
        open={showPersonalRankingsDialog}
        onClose={() => setShowPersonalRankingsDialog(false)}
        rankings={gameState.rankings}
        gameState={gameState}
        lobbyCode={lobbyCode}
        dialogTitle={t("Your Rank")}
        showCloseButton={true}
        onGameReset={onGameReset}
        gameId={gameState.gameId}
        t={t}
      />
    </Container>
  );
};

export default BingoGame;