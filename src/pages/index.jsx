import React from "react";
import {
  Box,
  CardContent,
  Typography,
  Button,
  Stack,
  Container,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from "@mui/icons-material";
import {useTheme } from "@mui/material/styles";

// Custom hooks
import useBingoSocket from "../hooks/useBingoSocket";
import useBingoSound from "../hooks/useBingoSound";
import useBingoGame from "../hooks/useBingoGame";

// Components
import Ticket from "./components/Ticket";
import NumberDisplay from "./components/NumberDisplay";
import DrawnNumbers from "./components/DrawnNumbers";
import WinnerDialog from "./components/WinnerDialog";
import NotificationSnackbar from "./components/NotificationSnackbar";
import Countdown from "./components/Countdown";
import ActiveNumbers from "./components/ActiveNumbers";
import RankingsDialog from "./components/RankingsDialog";
import BingoGameWaiting from "./components/BingoGameWaiting/BingoGameWaiting";
import CurrentRankings from "./components/CurrentRankings";
import CompletedPlayers from "./components/CompletedPlayers";

const BingoGame = ({ members, lobbyInfo, lobbyCode, socket, currentUser, soundEnabled, toggleSound, soundEnabledRef }) => {
  const theme = useTheme();
  
  // Initialize custom hooks
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
    handleDrawButton
  } = useBingoGame(members, currentUser);
  
  const {
    gameState,
    markedNumbers,
    winnerDetails,
    notification,
    countdown,
    completedPlayers,
    hasCompletedBingo,
    showRankingsDialog,
    showPersonalRankingsDialog,
    startGameWithOptions,
    drawNumber: socketDrawNumber,
    callBingo,
    handleMarkNumber,
    onGameReset,
    closeWinnerDialog,
    handleCloseNotification,
    setShowPersonalRankingsDialog
  } = useBingoSocket({
    socket,
    lobbyCode,
    currentUser, 
    members,
    soundEnabledRef,
    playSoundCallback: playSound
  });

  // Wrapper for draw number to handle cooldown
  const drawNumber = () => {
    handleDrawButton(gameState);
    socketDrawNumber();
  };

  // Wrapper for start game to provide proper options
  const handleStartGame = () => {
    startGameWithOptions({
      drawMode,
      drawer: drawMode === "manual" ? selectedDrawer : null,
      bingoMode: selectedBingoMode,
      competitionMode
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
          Waiting for connection...
        </Typography>
      </Box>
    );
  }

  // Render the waiting component if the game hasn't started
  if (!gameState.gameStarted) {
    return (
      <Container maxWidth="100%" style={{ width: "100%", height: "100%" }}>
        <BingoGameWaiting
          members={members}
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
        />

        {/* Show the countdown even in waiting state */}
        <Countdown countdown={countdown} />

        {/* Keep notification system active */}
        <NotificationSnackbar
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={handleCloseNotification}
        />
      </Container>
    );
  }

  // Render the main game interface once the game has started
  return (
    <Container maxWidth="100%" style={{ width: "100%", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<TrophyIcon />}
            onClick={callBingo}
            sx={{ py: 1.5, px: 4, borderRadius: 2}}
            disabled={gameState.gameEnded || hasCompletedBingo}
          >
            {hasCompletedBingo ? "Bingo Tamamlandı" : "Call Bingo!"}
          </Button>
          {gameState.gameStarted &&
            !gameState.gameEnded &&
            gameState.drawMode === "manual" &&
            String(gameState.drawer) === String(currentUser?.id) && (
              <Button
                variant="contained"
                color="info"
                onClick={drawNumber}
                sx={{ py: 1.5, px: 4, borderRadius: 2 ,
                }}
                disabled={gameState.gameEnded || isDrawButtonDisabled}
                
              >
                Draw Number
              </Button>
            )}
          <IconButton
            color="primary"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Sesi kapat" : "Sesi aç"}
          >
            {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            marginBottom: 2,
          }}
        >
          <Box sx={{ flex: "3", width: "60vw" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <TrophyIcon color="primary" />
              Your Ticket
            </Typography>
            <Ticket
              ticket={gameState.ticket}
              markedNumbers={markedNumbers}
              activeNumbers={gameState.activeNumbers}
              onMarkNumber={handleMarkNumber}
            />
          </Box>
          <Box sx={{ flex: "1", width: "40vw" }}>
            <NumberDisplay
              currentNumber={gameState.currentNumber}
              theme={theme}
              manualMode={gameState.drawMode === "manual"}
              bingoMode={gameState.bingoMode}
            />
            <ActiveNumbers
              activeNumbers={gameState.activeNumbers}
              bingoMode={gameState.bingoMode}
            />
          </Box>
        </Box>

        <DrawnNumbers drawnNumbers={gameState.drawnNumbers} />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1, mb: 2 }}
        >
          {gameState.drawnNumbers.length}/{90} Drawn Numbers
        </Typography>
        {hasCompletedBingo && (
          <CompletedPlayers completedPlayers={completedPlayers} />
        )}

        {gameState.gameStarted &&
          !gameState.gameEnded &&
          gameState.rankings.length > 0 && (
            <CurrentRankings 
              rankings={gameState.rankings} 
              completedPlayers={completedPlayers} 
            />
          )}
      </CardContent>

      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />

      <WinnerDialog
        winnerDetails={winnerDetails}
        currentUser={currentUser}
        onClose={closeWinnerDialog}
      />
      <Countdown countdown={countdown} />

      <RankingsDialog
        open={showRankingsDialog}
        onClose={onGameReset} 
        rankings={gameState.rankings}
        gameState={gameState}
        lobbyCode={lobbyCode}
        onGameReset={onGameReset}
        gameId={gameState.gameId}
      />
      <RankingsDialog
        open={showPersonalRankingsDialog}
        onClose={() => setShowPersonalRankingsDialog(false)}
        rankings={gameState.rankings}
        gameState={gameState}
        lobbyCode={lobbyCode}
        dialogTitle="Your Rank"
        showCloseButton={true}
        onGameReset={onGameReset}
        gameId={gameState.gameId}
      />
    </Container>
  );
};

export default BingoGame;