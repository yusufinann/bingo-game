import React, { useEffect } from "react";
import {
  Box,
  CardContent,
  Typography,
  Container,
  CircularProgress,
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
import WinnerDialog from "./components/WinnerDialog";
import NotificationSnackbar from "./components/NotificationSnackbar";
import CountdownScreen from "./components/CountdownScreen";
import ActiveNumbers from "./components/ActiveNumbers";
import RankingsDialog from "./components/RankingsDialog";
import BingoGameWaiting from "./components/BingoGameWaiting/BingoGameWaiting";
import CurrentRankings from "./components/CurrentRankings";
import CompletedPlayers from "./components/CompletedPlayers";
import GameControls from "./components/GameControls";

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
    setShowPersonalRankingsDialog,
    
  } = useBingoSocket({
    socket,
    lobbyCode,
    currentUser,
    members,
    soundEnabledRef,
    playSoundCallback: playSound,t
  });


  const [showCountdown, setShowCountdown] = React.useState(false);

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

  if (!gameState.gameStarted) {
    return (
      <Container maxWidth="100%" style={{ width: "100%", height: "100%"}}>
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
          t={t}
        />

        <NotificationSnackbar
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={handleCloseNotification}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="100%" style={{ width: "100%", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
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
              {t("Your Ticket")}
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
          {gameState.drawnNumbers.length}/{90} {t("Drawn Numbers")}
        </Typography>
        <CompletedPlayers completedPlayers={completedPlayers} t={t}/>

        {gameState.gameStarted &&
          !gameState.gameEnded &&
          gameState.rankings &&
          gameState.rankings.length > 0 &&
          completedPlayers &&
          completedPlayers.length > 0 && (
            <CurrentRankings
              rankings={gameState.rankings}
              completedPlayers={completedPlayers}
              t={t}
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

      <RankingsDialog
        open={showRankingsDialog}
        onClose={onGameReset}
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
        dialogTitle="Your Rank"
        showCloseButton={true}
        onGameReset={onGameReset}
        gameId={gameState.gameId}
        t={t}
      />
    </Container>
  );
};

export default BingoGame;
