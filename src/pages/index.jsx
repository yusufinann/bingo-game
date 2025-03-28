import React from "react";
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
} from "@mui/material";
import {
  Casino as CasinoIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import Ticket from "./components/Ticket";
import NumberDisplay from "./components/NumberDisplay";
import DrawnNumbers from "./components/DrawnNumbers";
import WinnerDialog from "./components/WinnerDialog";
import NotificationSnackbar from "./components/NotificationSnackbar";
import Countdown from "./components/Countdown";
import ActiveNumbers from "./components/ActiveNumbers";
import RankingsDialog from "./components/RankingsDialog"; // Import RankingsDialog

// İlgili ses dosyaları:
import bingoWinSound from "../assets/bingo-win-sound.wav";
import gameStartAudioSrc from "../assets/game-start.mp3";
import drawNumberSound from "../assets/draw-number.mp3";
import matchSound from "../assets/matchSound.mp3";
import wrongBingoSound from "../assets/wrong-bingo.mp3";
import StartGameDialog from "./components/StartGameDialog";
import { useState, useEffect, useMemo } from "react";

const BingoGame = ({ members, lobbyInfo, lobbyCode, socket, currentUser }) => {
  const theme = useTheme();

  const [gameState, setGameState] = useState({
    gameId: null, // Yeni gameId state'i
    ticket: [],
    drawnNumbers: [],
    activeNumbers: [],
    currentNumber: null,
    gameStarted: false,
    gameEnded: false,
    winner: null,
    players: [], // Oyuncuların listesi ve sıralamaları için
    message: "",
    drawMode: "auto",
    drawer: null,
    bingoMode: "classic",
    rankings: [], // Oyun içi sıralamalar için state
  });
  const [markedNumbers, setMarkedNumbers] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
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


  const [showRankingsDialog, setShowRankingsDialog] = useState(false); // Genel sıralama dialogu kontrolü
  const [showPersonalRankingsDialog, setShowPersonalRankingsDialog] = useState(false); // Bireysel sıralama dialogu kontrolü
  const [completedPlayers, setCompletedPlayers] = useState([]);
  const [hasCompletedBingo, setHasCompletedBingo] = useState(false);


  const playSound = (sound) => {
    if (soundEnabled) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Error playing sound:", e));
    }
  };

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
      console.log(data);
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
            rankings: data.rankings || [], // Sıralamaları al
            gameId: data.gameId, // gameId'yi state'e kaydet
          }));
          setCompletedPlayers(data.completedPlayers || []);
          setHasCompletedBingo(data.completedBingo || false);
            // İşaretlenen numaraları da al
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
          // Sunucudan gelen işaretlenen numara güncellemesi
         // Update marked numbers if it's for current player
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
            gameEnded:false,
            message: data.message,
            drawMode: data.drawMode || "auto",
            drawer: data.drawer || null,
            bingoMode: data.bingoMode || "classic",
            rankings: [], // Oyun başladığında sıralamayı sıfırla
            drawnNumbers: [], // **EKLE veya KONTROL ET: Çekilen numaraları sıfırlıyor muyuz?**
           activeNumbers: [], // **EKLE veya KONTROL ET: Aktif numaraları sıfırlıyor muyuz?**
           gameId: data.gameId, // gameId'yi state'e kaydet
          }));
          setMarkedNumbers([]); // Reset marked numbers on game start
          setCompletedPlayers([]); // Reset completed players on game start
          setHasCompletedBingo(false); // Reset completed bingo status on game start

               // Update ticket from the BINGO_STARTED message
               if (data.players) {
                const myPlayerData = data.players.find(p => p.playerId === currentUser?.id);
                if (myPlayerData && myPlayerData.ticket) {
                  setGameState(prev => ({ ...prev, ticket: myPlayerData.ticket }));
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
        case "BINGO_WIN": // Artık kullanılmıyor, BINGO_CALL_SUCCESS ile değiştirildi.
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
            setNotification({
              open: true,
              message: `${data.playerName} got Bingo! (Rank: ${data.rank})`,
              severity: "success"
            });
            setGameState(prev => ({
              ...prev,
              rankings: data.rankings, // Sıralamaları güncelle
            }));
            if (String(data.playerId) === String(currentUser?.id)) {
              setShowPersonalRankingsDialog(true); // Sadece bingo yapan oyuncuya dialog göster
              setHasCompletedBingo(true);      // Eğer bu oyuncu bingo yaptıysa, tamamlandı olarak işaretle
            }
            setCompletedPlayers(data.completedPlayers || []);
            if (data.gameEnded) {
              setShowRankingsDialog(true); // Genel sıralama dialogunu oyun sonunda göster
            }

            break;
            case "BINGO_GAME_STATUS":
              setCompletedPlayers(data.completedPlayers || []);

              // Oyuncunun durumunu güncelle
              if (data.completedPlayers && data.completedPlayers.includes(currentUser?.id)) {
                setHasCompletedBingo(true);
              }
              break;

          case "BINGO_GAME_OVER":
            setGameState(prev => ({
              ...prev,
              gameEnded: true,
              gameStarted: false, // Oyunu bitir
              rankings: data.finalRankings, // Final sıralamaları al
            }));
            setShowRankingsDialog(true); // Oyun bittiğinde genel sıralama dialogunu göster
            setShowPersonalRankingsDialog(false); // Bireysel sıralama dialogunu kapat
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
      // Sunucuya bildir
      socket.send(
        JSON.stringify({
          type: "BINGO_MARK_NUMBER",
          lobbyCode,
          number
        })
      );
  };

  // Host dialog üzerinden seçim yaptıktan sonra çağrılır:
  const startGameWithOptions = () => {
    socket.send(
      JSON.stringify({
        type: "BINGO_START",
        lobbyCode,
        drawMode, // "auto" veya "manual"
        drawer: drawMode === "manual" ? selectedDrawer : null,
        bingoMode: selectedBingoMode, // "classic", "extended" veya "fast"
      })
    );
    setOpenStartDialog(false);
  };

  // Manuel sayı çekimi için:
  const drawNumber = () => {
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
  const onGameReset = () => { // Ensure this function resets completedPlayers and hasCompletedBingo
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      gameEnded: false,
      drawnNumbers: [],
      activeNumbers: [],
      currentNumber: null,
      winner: null,
      rankings: [],
    }));
    setMarkedNumbers([]);
    setCompletedPlayers([]); // Reset completed players here
    setHasCompletedBingo(false); // Reset hasCompletedBingo here
  };
  return (
    <Container maxWidth="100%" style={{ width: '100%',height:'100%'}}> {/* Container width 80% and removed margin auto */}

        <CardContent sx={{ p: 3 }}>
            {/* <PlayersList
              members={members}
              isHost={members[0]?.id === currentUser?.id}
              soundEnabled={soundEnabled}
              toggleSound={() => setSoundEnabled((prev) => !prev)}
            /> */}

{/*Oyun Butonları*/}
          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            {!gameState.gameStarted && members[0]?.id === currentUser?.id && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CasinoIcon />}
                onClick={() => setOpenStartDialog(true)}
                disabled={members.length < 2}
                sx={{ py: 1.5, px: 4, borderRadius: 2 }}
              >
                Start Game ({members.length}/{lobbyInfo.maxMembers})
              </Button>
            )}
            <Button
              variant="contained"
              color="warning"
              startIcon={<TrophyIcon />}
              onClick={callBingo}
              sx={{ py: 1.5, px: 4, borderRadius: 2 }}
              disabled={gameState.gameEnded ||hasCompletedBingo} // Oyun bittikten sonra veya sıralama dialogu açıkken bingo çağrısı yapılamasın
            >
               {hasCompletedBingo ? "Bingo Tamamlandı" : "Call Bingo!"}
            </Button>
            {gameState.gameStarted &&
             !gameState.gameEnded &&  // Oyun bitmemişse göster
              gameState.drawMode === "manual" &&
              String(gameState.drawer) === String(currentUser?.id) && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={drawNumber}
                  sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                  disabled={gameState.gameEnded} // Oyun bittikten sonra sayı çekilemesin
                >
                  Draw Number
                </Button>
              )}
          </Stack>

          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 4 }}>
            <Box sx={{ flex: '3', width: '60vw'}}> {/* Ticket Box - Increased flex and minWidth */}
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
            <Box sx={{ flex: '1', width: '40vw' }}> {/* Number Display Box */}
              <NumberDisplay
                currentNumber={gameState.currentNumber}
                theme={theme}
                manualMode={gameState.drawMode === "manual"}
              />
              <ActiveNumbers activeNumbers={gameState.activeNumbers} />
            </Box>
          </Box>


          <DrawnNumbers drawnNumbers={gameState.drawnNumbers} />
          <Typography variant="body1" sx={{ mt: 2 }}>Tamamlayan Oyuncular: {completedPlayers.length}</Typography>
          {hasCompletedBingo && (
          <div className="completion-message">
            Tebrikler! Bingo'yu tamamladınız!
          </div>
        )}

          {/* Real-time Rankings Display */}
          {gameState.gameStarted && !gameState.gameEnded && gameState.rankings.length > 0 && (
            <Paper elevation={3} sx={{ p: 2, mt: 4, borderRadius: 2, bgcolor: "background.default" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Current Rankings</Typography>
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

      {/* Start Game Dialog */}
      <StartGameDialog
        open={openStartDialog}
        onClose={() => setOpenStartDialog(false)}
        drawMode={drawMode}
        setDrawMode={setDrawMode}
        selectedDrawer={selectedDrawer}
        setSelectedDrawer={setSelectedDrawer}
        selectedBingoMode={selectedBingoMode}
        setSelectedBingoMode={setSelectedBingoMode}
        members={members}
        onStartGame={startGameWithOptions}
      />


      <RankingsDialog
        open={showRankingsDialog}
        onClose={() => setShowRankingsDialog(false)}
        rankings={gameState.rankings}
        gameState={gameState}
        lobbyCode={lobbyCode}
        onGameReset={onGameReset} // Pass the reset function
        gameId={gameState.gameId} // gameId prop'unu ekleyin
      />
       <RankingsDialog // Personal Rankings Dialog - Only shows for the player who called Bingo
        open={showPersonalRankingsDialog}
        onClose={() => setShowPersonalRankingsDialog(false)}
        rankings={gameState.rankings}
        gameState={gameState}
        lobbyCode={lobbyCode}
        dialogTitle="Your Rank" // Custom title for personal dialog
        showCloseButton={true} // Show close button for personal dialog
        onGameReset={onGameReset}
        gameId={gameState.gameId} // gameId prop'unu ekleyin
      />

      <style>
        {
          `
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
        `
        }
      </style>
    </Container>
  );
};

export default BingoGame;