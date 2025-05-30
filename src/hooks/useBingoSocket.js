import { useState, useEffect, useCallback } from "react";

const useBingoSocket = ({
  socket,
  lobbyCode,
  currentUser,

  playSoundCallback,
  t,
}) => {
  const [gameState, setGameState] = useState({
    gameId: null,
    ticket: null,
    drawnNumbers: [],
    activeNumbers: [],
    currentNumber: null,
    gameStarted: false,
    gameEnded: false,
    winner: null,
    players: [], // Artık { id, name, userName, avatar, ... } formatında olacak
    message: "",
    drawMode: "auto",
    drawer: null,
    bingoMode: "classic",
    rankings: [],
    competitionMode: "competitive",
  });
  const [markedNumbers, setMarkedNumbers] = useState([]);
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [completedPlayers, setCompletedPlayers] = useState([]); // { id, name, avatar, completedAt }
  const [hasCompletedBingo, setHasCompletedBingo] = useState(false);
  const [showRankingsDialog, setShowRankingsDialog] = useState(false);
  const [showPersonalRankingsDialog, setShowPersonalRankingsDialog] =
    useState(false);
  const [initialJoinNotificationShown, setInitialJoinNotificationShown] =
    useState(false);
  const [currentPlayerColor, setCurrentPlayerColor] = useState(null);

  const onGameReset = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameId: null,
      ticket: null,
      drawnNumbers: [],
      activeNumbers: [],
      currentNumber: null,
      gameStarted: false,
      gameEnded: false,
      winner: null,
      message: "",
      rankings: [],
    }));
    setMarkedNumbers([]);
    setCompletedPlayers([]);
    setHasCompletedBingo(false);
    setShowRankingsDialog(false);
    setShowPersonalRankingsDialog(false);
    setWinnerDetails(null);
    setCountdown(null);
    setInitialJoinNotificationShown(false);
    setCurrentPlayerColor(null);
  }, []);

  const handleCloseRankingsDialog = useCallback(() => {
    onGameReset();
  }, [onGameReset]);

  const startGameWithOptions = useCallback(
    (options) => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: "BINGO_START",
          lobbyCode,
          ...options,
        })
      );
    },
    [socket, lobbyCode]
  );

  const drawNumber = useCallback(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "BINGO_DRAW",
        lobbyCode,
      })
    );
  }, [socket, lobbyCode]);

  const callBingo = useCallback(() => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: "BINGO_CALL",
        lobbyCode,
      })
    );
  }, [socket, lobbyCode]);

  const handleMarkNumber = useCallback(
    (number) => {
      if (!socket) return;
      playSoundCallback("match");
      socket.send(
        JSON.stringify({
          type: "BINGO_MARK_NUMBER",
          lobbyCode,
          number,
        })
      );
    },
    [socket, lobbyCode, playSoundCallback]
  );

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
      const messageOriginLobbyCode = data.lobbyCode;

      if (messageOriginLobbyCode && messageOriginLobbyCode !== lobbyCode) {
        return;
      }

      const getNotificationMessage = (notificationData) => {
        if (!notificationData || !notificationData.key) return "";
        return t(notificationData.key, notificationData.params);
      };

      switch (data.type) {
        case "BINGO_JOIN":
          setGameState((prev) => ({
            ...prev,
            gameId: data.gameId,
            ticket: data.ticket || null,
            players: data.players || [], 
            message: data.message,
            gameStarted: data.gameStarted,
            drawnNumbers: data.drawnNumbers || [],
            activeNumbers: data.activeNumbers || [],
            currentNumber: data.currentNumber || null,
            drawMode: data.drawMode || "auto",
            drawer: data.drawer || null,
            rankings: data.rankings || [],
            competitionMode: data.competitionMode || "competitive",
            bingoMode: data.bingoMode || "classic",
          }));
          setCurrentPlayerColor(data.playerColor || null);

          if (data.markedNumbers) {
            setMarkedNumbers(data.markedNumbers);
          }
          setCompletedPlayers(data.completedPlayers || []); 

          if (data.completedBingo !== undefined) {
            setHasCompletedBingo(data.completedBingo);
          } else if (currentUser?.id && Array.isArray(data.completedPlayers)) {
            const amICompleted = data.completedPlayers.some(
              (p) => String(p.id) === String(currentUser.id) 
            );
            setHasCompletedBingo(amICompleted);
          } else {
            setHasCompletedBingo(false);
          }

          if (!initialJoinNotificationShown && !data.isRejoin) {
            setNotification({
              open: true,
              message: t("notifications.joinedSuccess"),
              severity: "success",
            });
            setInitialJoinNotificationShown(true);
          }
          break;

        case "BINGO_NUMBER_MARKED_CONFIRMED":
          if (String(data.playerId) === String(currentUser?.id)) {
            setMarkedNumbers(data.markedNumbers);
            if (data.completedBingo !== undefined) {
                 setHasCompletedBingo(data.completedBingo);
            }
          }
          break;

        case "BINGO_PLAYER_COMPLETED":
            setCompletedPlayers(prev => {
                const playerExists = prev.some(p => String(p.id) === String(data.playerId)); 
                if (playerExists) {
                    return prev.map(p => String(p.id) === String(data.playerId) ? { ...p, id: data.playerId, name: data.playerName, avatar: data.avatar, completedAt: data.completedAt || p.completedAt } : p);
                }
                return [...prev, { id: data.playerId, name: data.playerName, avatar: data.avatar, completedAt: data.completedAt }];
            });
            if (data.notification) {
              setNotification({
                  open: true,
                  message: getNotificationMessage(data.notification) || `${data.playerName || 'A player'} got Bingo!`,
                  severity: "success",
              });
            }
             if (String(data.playerId) === String(currentUser?.id)) { 
                setHasCompletedBingo(true);
            }
            break;

        case "BINGO_PLAYER_JOINED": 
          setGameState((prev) => ({
            ...prev,
            players: prev.players.some((p) => String(p.id) === String(data.player.id))
              ? prev.players.map(p => String(p.id) === String(data.player.id) ? data.player : p)
              : [...prev.players, data.player],
          }));
          if (data.notification) {
            setNotification({
              open: true,
              message: getNotificationMessage(data.notification),
              severity: "info",
            });
          }
          break;

        case "BINGO_COUNTDOWN":
          setCountdown(data.countdown);
          playSoundCallback("countdown");
          break;

        case "BINGO_STARTED":
           setMarkedNumbers([]);
           setCompletedPlayers([]);
           setHasCompletedBingo(false);
           setShowRankingsDialog(false);
           setShowPersonalRankingsDialog(false);
           setWinnerDetails(null);

          setCountdown(null);
          setGameState((prev) => ({
            ...prev,
            gameStarted: true,
            gameEnded: false,
            message: data.message,
            drawMode: data.drawMode || "auto",
            drawer: data.drawer || null,
            bingoMode: data.bingoMode || "classic",
            gameId: data.gameId,
            competitionMode: data.competitionMode || "competitive",
            players: data.players || prev.players, 
            drawnNumbers: [],
            activeNumbers: [],
            currentNumber: null,
            rankings: [],
          }));

          if (data.players && currentUser?.id) {
            const myPlayerData = data.players.find(p => String(p.id) === String(currentUser.id)); 
            if (myPlayerData) {
              setGameState(prev => ({ ...prev, ticket: myPlayerData.ticket || null }));
              setCurrentPlayerColor(myPlayerData.color || null);
            } else {
              console.warn("Current user's data not found in BINGO_STARTED players list. Ticket/color might be stale.");
            }
          }

          setNotification({
            open: true,
            message: t("notifications.gameStarted") || "Game has started!",
            severity: "success",
          });
          playSoundCallback("gameStart");
          break;

        case "BINGO_NUMBER_DRAWN":
          setGameState((prev) => ({
            ...prev,
            currentNumber: data.number,
            drawnNumbers: data.drawnNumbers,
            activeNumbers: data.activeNumbers,
          }));
          playSoundCallback("drawNumber");
          break;

        case "BINGO_NUMBER_DISPLAY_END":
             setGameState((prev) => ({
                ...prev,
                activeNumbers: data.activeNumbers !== undefined ? data.activeNumbers : prev.activeNumbers,
             }));
            break;

        case "BINGO_NUMBER_CLEAR":
          setGameState((prev) => ({
            ...prev,
            activeNumbers: data.activeNumbers,
          }));
          break;

        case "BINGO_INVALID":
          playSoundCallback("wrongBingo");
          setNotification({
            open: true,
            message: data.message,
            severity: "error",
          });
          break;

        case "BINGO_GAME_STATUS":
          setGameState(prev => ({
            ...prev,
            drawnNumbers: data.drawnNumbers !== undefined ? data.drawnNumbers : prev.drawnNumbers,
            activeNumbers: data.activeNumbers !== undefined ? data.activeNumbers : prev.activeNumbers,
            currentNumber: data.currentNumber !== undefined ? data.currentNumber : prev.currentNumber,
            players: data.players !== undefined ? data.players : prev.players, 
            rankings: data.rankings !== undefined ? data.rankings : prev.rankings,
            gameStarted: data.gameStarted !== undefined ? data.gameStarted : prev.gameStarted,
            gameEnded: data.gameEnded !== undefined ? data.gameEnded : prev.gameEnded,
          }));
          setCompletedPlayers(data.completedPlayers || []); 
          if (data.completedPlayers && currentUser?.id) {
            const amICompleted = data.completedPlayers.some(
              (p) => String(p.id) === String(currentUser.id) 
            );
            setHasCompletedBingo(amICompleted);
          }
          if (data.gameEnded && (data.finalRankings || data.rankings)) {
             setGameState(prev => ({...prev, rankings: data.finalRankings || data.rankings || prev.rankings}));
             setShowRankingsDialog(true);
          }
          break;

    case "BINGO_GAME_OVER":
          setGameState((prev) => ({
            ...prev,
            gameEnded: true,
            gameStarted: false,
            rankings: data.finalRankings || [], 
          }));

          const allPlayersFromRankings = data.finalRankings ? data.finalRankings.map(p => ({
              id: p.playerId, 
              name: p.name || p.userName, 
              userName: p.userName,
              avatar: p.avatar,
              completedAt: p.completedAt
            })) : [];
          setCompletedPlayers(allPlayersFromRankings.filter(p => !!p.completedAt));

          if (data.finalRankings && data.finalRankings.length > 0) {
            const winnerData = data.finalRankings[0];
            setWinnerDetails({
              id: winnerData.playerId, 
              name: winnerData.userName || "Unknown Player",
              avatar: winnerData.avatar
            });
          } else {
            setWinnerDetails(null);
          }

          setShowRankingsDialog(true);
          setShowPersonalRankingsDialog(false);
          playSoundCallback("gameOver");
          break;

        case "BINGO_ERROR":
          setNotification({
            open: true,
            message: data.message || (data.error ? (typeof data.error === 'string' ? data.error : data.error.message) : "An error occurred."),
            severity: "error",
          });
          break;

        case "BINGO_PLAYER_LEFT": 
          setGameState(prev => ({
            ...prev,
            players: prev.players.filter(p => String(p.id) !== String(data.playerId))
          }));
          if (data.notification) {
            setNotification({
              open: true,
              message: getNotificationMessage(data.notification) || `${data.playerName || 'A player'} left the game.`,
              severity: "warning",
            });
          }
          break;

        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
        socket.removeEventListener("message", handleMessage);
    };
  }, [
    socket,
    lobbyCode,
    currentUser,
    playSoundCallback,
    t,
    initialJoinNotificationShown,
  ]);

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
    currentPlayerColor,
    startGameWithOptions,
    drawNumber,
    callBingo,
    handleMarkNumber,
    onGameReset,
    closeWinnerDialog,
    handleCloseNotification,
    setShowRankingsDialog,
    setShowPersonalRankingsDialog,
    handleCloseRankingsDialog
  };
};

export default useBingoSocket;