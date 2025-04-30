import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to handle WebSocket communication for Bingo game
 */
const useBingoSocket = ({
  socket,
  lobbyCode,
  currentUser,
  members,
  soundEnabledRef,
  playSoundCallback,
}) => {
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
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [completedPlayers, setCompletedPlayers] = useState([]);
  const [hasCompletedBingo, setHasCompletedBingo] = useState(false);
  const [showRankingsDialog, setShowRankingsDialog] = useState(false);
  const [showPersonalRankingsDialog, setShowPersonalRankingsDialog] = useState(false);

  /**
   * Sends a message to start the game with specified options
   */
  const startGameWithOptions = useCallback((options) => {
    if (!socket) return;
    
    socket.send(
      JSON.stringify({
        type: "BINGO_START",
        lobbyCode,
        ...options
      })
    );
  }, [socket, lobbyCode]);

  /**
   * Draws a number (for manual draw mode)
   */
  const drawNumber = useCallback(() => {
    if (!socket) return;
    
    socket.send(
      JSON.stringify({
        type: "BINGO_DRAW",
        lobbyCode,
      })
    );
  }, [socket, lobbyCode]);

  /**
   * Sends a Bingo call
   */
  const callBingo = useCallback(() => {
    if (!socket) return;
    
    socket.send(
      JSON.stringify({
        type: "BINGO_CALL",
        lobbyCode,
      })
    );
  }, [socket, lobbyCode]);

  /**
   * Marks a number on the player's ticket
   */
  const handleMarkNumber = useCallback((number) => {
    if (!socket) return;
    
    playSoundCallback('match');
    setMarkedNumbers((prev) => [...prev, number]);
    socket.send(
      JSON.stringify({
        type: "BINGO_MARK_NUMBER",
        lobbyCode,
        number,
      })
    );
  }, [socket, lobbyCode, playSoundCallback]);

  /**
   * Resets the game state
   */
  const onGameReset = useCallback(() => {
    setGameState((prev) => ({
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
    setCompletedPlayers([]);
    setHasCompletedBingo(false);
    setShowRankingsDialog(false);
    setShowPersonalRankingsDialog(false);
  }, []);

  /**
   * Handles WebSocket messages
   */
  useEffect(() => {
    if (!socket) return;

    // Join the Bingo game when the hook initializes
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
          playSoundCallback('gameStart');
          break;
          
        case "BINGO_NUMBER_DRAWN":
          setGameState((prev) => ({
            ...prev,
            currentNumber: data.number,
            drawnNumbers: data.drawnNumbers,
            activeNumbers: data.activeNumbers,
          }));
          playSoundCallback('drawNumber');
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
          playSoundCallback('win');
          break;
          
        case "BINGO_INVALID":
          playSoundCallback('wrongBingo');
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
  }, [socket, lobbyCode, currentUser, members, playSoundCallback]);

  const closeWinnerDialog = useCallback(() => {
    setWinnerDetails(null);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return {
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
    drawNumber,
    callBingo,
    handleMarkNumber,
    onGameReset,
    closeWinnerDialog,
    handleCloseNotification,
    setShowRankingsDialog,
    setShowPersonalRankingsDialog,
  };
};

export default useBingoSocket;