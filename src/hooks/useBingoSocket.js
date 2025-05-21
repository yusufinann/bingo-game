import { useState, useEffect, useCallback } from "react";

const useBingoSocket = ({
  socket,
  lobbyCode,
  currentUser,
  members,
  playSoundCallback,
  t,
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
  const [completedPlayers, setCompletedPlayers] = useState([]);
  const [hasCompletedBingo, setHasCompletedBingo] = useState(false);
  const [showRankingsDialog, setShowRankingsDialog] = useState(false);
  const [showPersonalRankingsDialog, setShowPersonalRankingsDialog] =
    useState(false);
  const [initialJoinNotificationShown, setInitialJoinNotificationShown] =
    useState(false);
  const [activeInOtherGameError, setActiveInOtherGameError] = useState(null);

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
      setMarkedNumbers((prev) => {
        if (prev.includes(number)) return prev;
        return [...prev, number];
      });
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

  const onGameReset = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameId: null,
      ticket: [],
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
    setActiveInOtherGameError(null);
    setInitialJoinNotificationShown(false);
  }, []);

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

      if (data.type === "BINGO_ERROR" && data.activeGameInfo) {
        setActiveInOtherGameError({
          message: data.message,
          activeGameInfo: data.activeGameInfo,
        });
      } else if (messageOriginLobbyCode && messageOriginLobbyCode !== lobbyCode) {
        console.warn(
          `[Bingo WS Handler] Mesaj (${data.type}) lobi ${messageOriginLobbyCode} için geldi, ancak şu an lobi ${lobbyCode} görüntüleniyor. Mesaj yoksayıldı.`
        );
        return;
      }

      const getNotificationMessage = (notificationData) => {
        if (!notificationData || !notificationData.key) return "";
        return t(notificationData.key, notificationData.params);
      };

      switch (data.type) {
        case "BINGO_JOIN":
          setActiveInOtherGameError(null);
          setGameState((prev) => ({
            ...prev,
            gameId: data.gameId,
            ticket: Array.isArray(data.ticket) ? data.ticket : [],
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

          if (data.markedNumbers) {
            setMarkedNumbers(data.markedNumbers);
          }
          setCompletedPlayers(data.completedPlayers || []);

          if (data.completedBingo !== undefined) {
            setHasCompletedBingo(data.completedBingo);
          } else if (currentUser?.id && Array.isArray(data.completedPlayers)) {
            const amICompleted = data.completedPlayers.some(
              (p) => String(p.userId || p.id) === String(currentUser.id)
            );
            setHasCompletedBingo(amICompleted);
          } else {
            setHasCompletedBingo(false);
          }

          if (!initialJoinNotificationShown && !data.isRejoin) {
            setNotification({
              open: true,
              message: "Successfully joined the Bingo game!",
              severity: "success",
            });
            setInitialJoinNotificationShown(true);
          }
          break;

        case "BINGO_NUMBER_MARKED":
          if (data.playerId === currentUser?.id) {
            setMarkedNumbers(data.markedNumbers);
          }
          break;

        case "BINGO_PLAYER_JOINED":
          setGameState((prev) => ({
            ...prev,
            players: prev.players.some((p) => String(p.id || p.userId) === String(data.player.id || data.player.userId))
              ? prev.players.map(p => String(p.id || p.userId) === String(data.player.id || data.player.userId) ? data.player : p)
              : [...prev.players, data.player],
          }));
          setNotification({
            open: true,
            message: getNotificationMessage(data.notification),
            severity: "info",
          });
          break;

        case "BINGO_COUNTDOWN":
          setCountdown(data.countdown);
          playSoundCallback("countdown");
          break;

        case "BINGO_STARTED":
          setActiveInOtherGameError(null);
          onGameReset();
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
            players: data.playersList || prev.players,
          }));

          if (data.playerTickets && data.playerTickets[currentUser?.id]) {
             setGameState(prev => ({...prev, ticket: data.playerTickets[currentUser.id]}));
          } else if (data.playersStates) {
            const myPlayerData = data.playersStates[currentUser?.id];
            if (myPlayerData && myPlayerData.ticket) {
              setGameState((prev) => ({ ...prev, ticket: myPlayerData.ticket }));
            }
          }

          setNotification({
            open: true,
            message: "Game has started!",
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
            rankings: data.rankings || prev.rankings,
          }));
          const winningMember = members.find(
            (m) => String(m.id) === String(data.winner)
          );
          setWinnerDetails({
            id: data.winner,
            name: winningMember ? winningMember.name : "Unknown Player",
            ticket: data.ticket,
          });
          playSoundCallback("win");
          if (data.finalRankings) setShowRankingsDialog(true);
          break;

        case "BINGO_INVALID":
          playSoundCallback("wrongBingo");
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
            message: `${data.playerName || 'A player'} got Bingo! (Rank: ${data.rank || 'N/A'})`,
            severity: "success",
          });
          setGameState((prev) => ({
            ...prev,
            rankings: data.rankings || prev.rankings,
          }));
          if (String(data.playerId) === String(currentUser?.id)) {
            setShowPersonalRankingsDialog(true);
            setHasCompletedBingo(true);
          }
          if (data.gameEnded) {
            setGameState(prev => ({...prev, gameEnded: true}));
            setShowRankingsDialog(true);
          }
          break;

        case "BINGO_GAME_STATUS":
          setGameState(prev => ({
            ...prev,
            drawnNumbers: data.drawnNumbers || prev.drawnNumbers,
            activeNumbers: data.activeNumbers || prev.activeNumbers,
            currentNumber: data.currentNumber !== undefined ? data.currentNumber : prev.currentNumber,
            players: data.players || prev.players,
            rankings: data.rankings || prev.rankings,
            gameStarted: data.gameStarted !== undefined ? data.gameStarted : prev.gameStarted,
            gameEnded: data.gameEnded !== undefined ? data.gameEnded : prev.gameEnded,
          }));
          setCompletedPlayers(data.completedPlayers || []);
          if (data.completedPlayers && currentUser?.id) {
            const amICompleted = data.completedPlayers.some(
              (p) => String(p.userId || p.id) === String(currentUser.id)
            );
            setHasCompletedBingo(amICompleted);
          }
          if (data.gameEnded && data.finalRankings) {
            setShowRankingsDialog(true);
          }
          break;

        case "BINGO_GAME_OVER":
          setGameState((prev) => ({
            ...prev,
            gameEnded: true,
            gameStarted: false,
            rankings: data.finalRankings,
          }));
          setCompletedPlayers(data.completedPlayers || []);
          setShowRankingsDialog(true);
          setShowPersonalRankingsDialog(false);
          playSoundCallback("gameOver");
          break;

        case "BINGO_ERROR":
          if (!data.activeGameInfo) {
            setNotification({
              open: true,
              message: data.message,
              severity: "error",
            });
            setActiveInOtherGameError(null);
          }
          break;
        
        case "BINGO_PLAYER_LEFT":
          setGameState(prev => ({
            ...prev,
            players: prev.players.filter(p => String(p.id || p.userId) !== String(data.playerId))
          }));
          setNotification({
            open: true,
            message: `${data.playerName || 'A player'} left the game.`,
            severity: "warning",
          });
          break;

        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
        socket.removeEventListener("message", handleMessage);
        // İsteğe bağlı: Kullanıcı bu hook'un kullanıldığı sayfadan ayrıldığında
        // backend'e bir "BINGO_LEAVE" mesajı gönderebilirsiniz.
        // if (socket && socket.readyState === WebSocket.OPEN) {
        //   socket.send(JSON.stringify({ type: "BINGO_LEAVE", lobbyCode, playerId: currentUser?.id }));
        // }
    };
  }, [
    socket,
    lobbyCode,
    currentUser,
    members,
    playSoundCallback,
    initialJoinNotificationShown,
    t,
    onGameReset,
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
    activeInOtherGameError,
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