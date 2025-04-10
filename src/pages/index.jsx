import React, {
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  Box,
  CardContent,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import Ticket from "./components/Ticket";
import NumberDisplay from "./components/NumberDisplay";
import DrawnNumbers from "./components/DrawnNumbers";
import WinnerDialog from "./components/WinnerDialog";
import NotificationSnackbar from "./components/NotificationSnackbar";
import Countdown from "./components/Countdown";
import ActiveNumbers from "./components/ActiveNumbers";
import RankingsDialog from "./components/RankingsDialog";
import BingoGameWaiting from "./components/BingoGameWaiting";

// İlgili ses dosyaları:
import bingoWinSound from "../assets/bingo-win-sound.wav";
import gameStartAudioSrc from "../assets/game-start.mp3";
import drawNumberSound from "../assets/draw-number.mp3";
import matchSound from "../assets/matchSound.mp3";
import wrongBingoSound from "../assets/wrong-bingo.mp3";

const BingoGame = ({ members, lobbyInfo, lobbyCode, socket, currentUser, soundEnabled, toggleSound, soundEnabledRef }) => {
  const theme = useTheme();
  const [gameState, setGameState] = useState({
    gameId: null,
    ticket: [],
    drawnNumbers: [],
    activeNumbers: [],
    currentNumber: null,
    gameStarted: false,
    gameEnded: false,
    winner: null,
    players: [],
    message: "",
    drawMode: "auto",
    drawer: null,
    bingoMode: "classic",
    rankings: [],
  });
  const [markedNumbers, setMarkedNumbers] = useState([]);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Dialog state'leri
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [drawMode, setDrawMode] = useState("auto");
  const [selectedDrawer, setSelectedDrawer] = useState(null);
  const [selectedBingoMode, setSelectedBingoMode] = useState("classic");

  // Ses elementleri
  const drawNumberSoundAudio = useMemo(() => new Audio(drawNumberSound), []);
  const winSoundAudio = useMemo(() => new Audio(bingoWinSound), []);
  const matchSoundAudio = useMemo(() => new Audio(matchSound), []);
  const wrongBingoSoundAudio = useMemo(() => new Audio(wrongBingoSound), []);
  const gameStartAudio = useMemo(() => new Audio(gameStartAudioSrc), []);
  const [isDrawButtonDisabled, setIsDrawButtonDisabled] = useState(false);

  const [showRankingsDialog, setShowRankingsDialog] = useState(false); // Genel sıralama dialogu kontrolü
  const [showPersonalRankingsDialog, setShowPersonalRankingsDialog] =
    useState(false); // Bireysel sıralama dialogu kontrolü
  const [completedPlayers, setCompletedPlayers] = useState([]);
  const [hasCompletedBingo, setHasCompletedBingo] = useState(false);
  const [competitionMode, setCompetitionMode] = useState("competitive");

  const playSound = (sound) => {
    if (soundEnabledRef.current) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Error playing sound:", e));
    }
  };

  const isCurrentUserHost = useMemo(() => {
    return members.some(
      (member) => member.isHost && String(member.id) === String(currentUser?.id)
    );
  }, [members, currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "BINGO_JOIN",
        lobbyCode,
        playerId: currentUser?.id,
      })
    );

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "BINGO_JOIN":
          setGameState((prev) => ({
            ...prev,
            ticket: Array.isArray(data.ticket) ? data.ticket : [],
            players: data.players || [],
            message: data.message,
            gameStarted: data.gameStarted,
            drawnNumbers: data.drawnNumbers || [],
            activeNumbers: data.activeNumbers || [],
            drawMode: data.drawMode || "auto",
            drawer: data.drawer || null,
            rankings: data.rankings || [],
            gameId: data.gameId,
          }));
          setCompletedPlayers(data.completedPlayers || []);
          setHasCompletedBingo(data.completedBingo || false);
          if (data.markedNumbers) {
            setMarkedNumbers(data.markedNumbers);
          }
          setNotification({
            open: true,
            message: "Successfully joined the Bingo game!",
            severity: "success",
          });
          break;
        case "BINGO_NUMBER_MARKED":
          if (data.playerId === currentUser?.id) {
            setMarkedNumbers(data.markedNumbers);
          }
          break;
        case "BINGO_PLAYER_JOINED":
          setGameState((prev) => ({
            ...prev,
            players: [...prev.players, data.player],
          }));
          setNotification({
            open: true,
            message: `${data.player.name || "A new player"} joined the game!`,
            severity: "info",
          });
          break;
        case "BINGO_COUNTDOWN":
          setCountdown(data.countdown);
          break;
        case "BINGO_STARTED":
          setCountdown(null);
          setGameState((prev) => ({
            ...prev,
            gameStarted: true,
            gameEnded: false,
            message: data.message,
            drawMode: data.drawMode || "auto",
            drawer: data.drawer || null,
            bingoMode: data.bingoMode || "classic",
            rankings: [],
            drawnNumbers: [],
            activeNumbers: [],
            gameId: data.gameId,
            competitionMode: data.competitionMode || "competitive",
          }));
          setMarkedNumbers([]);
          setCompletedPlayers([]);
          setHasCompletedBingo(false);
          if (data.players) {
            const myPlayerData = data.players.find(
              (p) => p.playerId === currentUser?.id
            );
            if (myPlayerData && myPlayerData.ticket) {
              setGameState((prev) => ({
                ...prev,
                ticket: myPlayerData.ticket,
              }));
            }
          }
          setNotification({
            open: true,
            message: "Game has started!",
            severity: "success",
          });
          playSound(gameStartAudio);
          break;
        case "BINGO_NUMBER_DRAWN":
          setGameState((prev) => ({
            ...prev,
            currentNumber: data.number,
            drawnNumbers: data.drawnNumbers,
            activeNumbers: data.activeNumbers,
          }));
          playSound(drawNumberSoundAudio);
          break;
        case "BINGO_NUMBER_CLEAR":
          setGameState((prev) => ({
            ...prev,
            activeNumbers: data.activeNumbers,
          }));
          break;
        case "BINGO_WIN":
          setGameState((prev) => ({
            ...prev,
            gameEnded: true,
            winner: data.winner,
            message: data.message,
          }));
          const winningMember = members.find(
            (m) => String(m.id) === String(data.winner)
          );
          setWinnerDetails({
            id: data.winner,
            name: winningMember ? winningMember.name : "Unknown Player",
            ticket: data.ticket,
          });
          playSound(winSoundAudio);
          break;
        case "BINGO_INVALID":
          playSound(wrongBingoSoundAudio);
          setNotification({
            open: true,
            message: data.message,
            severity: "error",
          });
          break;
        case "BINGO_CALL_SUCCESS":
          setCompletedPlayers(data.completedPlayers || []);
          setNotification({
            open: true,
            message: `${data.playerName} got Bingo! (Rank: ${data.rank})`,
            severity: "success",
          });
          setGameState((prev) => ({
            ...prev,
            rankings: data.rankings,
          }));
          if (String(data.playerId) === String(currentUser?.id)) {
            setShowPersonalRankingsDialog(true);
            setHasCompletedBingo(true);
          }
          setCompletedPlayers(data.completedPlayers || []);
          if (data.gameEnded) {
            setShowRankingsDialog(true);
          }
          break;
        case "BINGO_GAME_STATUS":
          setCompletedPlayers(data.completedPlayers || []);
          if (
            data.completedPlayers &&
            data.completedPlayers.includes(currentUser?.id)
          ) {
            setHasCompletedBingo(true);
          }
          break;
        case "BINGO_GAME_OVER":
          setGameState((prev) => ({
            ...prev,
            gameEnded: true,
            rankings: data.finalRankings,
          }));
          setShowRankingsDialog(true);
          setShowPersonalRankingsDialog(false);
          break;
        case "BINGO_ERROR":
          setNotification({
            open: true,
            message: data.message,
            severity: "error",
          });
          break;
        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, lobbyCode, currentUser, members]);

  const handleMarkNumber = (number) => {
    playSound(matchSoundAudio);
    setMarkedNumbers((prev) => [...prev, number]);
    socket.send(
      JSON.stringify({
        type: "BINGO_MARK_NUMBER",
        lobbyCode,
        number,
      })
    );
  };

  const startGameWithOptions = () => {
    socket.send(
      JSON.stringify({
        type: "BINGO_START",
        lobbyCode,
        drawMode,
        drawer: drawMode === "manual" ? selectedDrawer : null,
        bingoMode: selectedBingoMode,
        competitionMode: competitionMode,
      })
    );
    setOpenStartDialog(false);
  };

  const drawNumber = () => {
    if (
      gameState.drawMode === "manual" &&
      gameState.bingoMode === "superfast"
    ) {
      setIsDrawButtonDisabled(true);
      setTimeout(() => {
        setIsDrawButtonDisabled(false);
      }, 3000);
    } else if (
      gameState.drawMode === "manual" &&
      (gameState.bingoMode === "extended" || gameState.bingoMode === "classic")
    ) {
      setIsDrawButtonDisabled(true);
      setTimeout(() => {
        setIsDrawButtonDisabled(false);
      }, 5000);
    }

    socket.send(
      JSON.stringify({
        type: "BINGO_DRAW",
        lobbyCode,
      })
    );
  };

  const callBingo = () => {
    socket.send(
      JSON.stringify({
        type: "BINGO_CALL",
        lobbyCode,
      })
    );
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const closeWinnerDialog = () => {
    setWinnerDetails(null);
  };

  const onGameReset = () => {
    setGameState((prev) => ({
      ...prev,
      gameStarted: false, // Set gameStarted to false here to go back to waiting screen
      gameEnded: false,
      drawnNumbers: [],
      activeNumbers: [],
      currentNumber: null,
      winner: null,
      rankings: [],
    }));
    setMarkedNumbers([]);
    setCompletedPlayers([]);
    setHasCompletedBingo(false);
    setShowRankingsDialog(false); // Also close the ranking dialog when resetting.
    setShowPersonalRankingsDialog(false); // Close personal ranking dialog as well.
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
          startGameWithOptions={startGameWithOptions}
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
            sx={{ py: 1.5, px: 4, borderRadius: 2 }}
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
                sx={{ py: 1.5, px: 4, borderRadius: 2 }}
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
            marginBottom: 4,
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
        <Typography variant="body1" sx={{ mt: 2 }}>
          Tamamlayan Oyuncular ({completedPlayers.length}):{" "}
          {completedPlayers.map((player, index) => (
            <span key={player.id}>
              {player.userName}
              {index < completedPlayers.length - 1 ? ", " : ""}
            </span>
          ))}
        </Typography>
        {hasCompletedBingo && (
          <div className="completion-message">
            Tebrikler! Bingo'yu tamamladınız!
          </div>
        )}

        {gameState.gameStarted &&
          !gameState.gameEnded &&
          gameState.rankings.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mt: 4,
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Current Rankings
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Player</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gameState.rankings.map((rank, index) => (
                    <TableRow key={rank.playerId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{rank.userName}</TableCell>
                      <TableCell>{rank.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
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
        onClose={onGameReset} // Use onGameReset to reset game and go to waiting screen
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

      <style>
        {`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }

        @keyframes bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}
      </style>
    </Container>
  );
};

export default BingoGame;