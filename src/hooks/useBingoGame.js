import { useState, useCallback, useMemo } from "react";

/**
 * Custom hook to manage the general game state and game configuration
 */
const useBingoGame = (members, currentUser) => {
  // Game configuration state
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [drawMode, setDrawMode] = useState("auto");
  const [selectedDrawer, setSelectedDrawer] = useState(null);
  const [selectedBingoMode, setSelectedBingoMode] = useState("classic");
  const [competitionMode, setCompetitionMode] = useState("competitive");
  const [isDrawButtonDisabled, setIsDrawButtonDisabled] = useState(false);

  /**
   * Check if the current user is the host
   */
  const isCurrentUserHost = useMemo(() => {
    return members.some(
      (member) => member.isHost && String(member.id) === String(currentUser?.id)
    );
  }, [members, currentUser]);

  /**
   * Handle the draw button and enforce cooldown periods
   */
  const handleDrawButton = useCallback((gameState) => {
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
      (gameState.bingoMode === "classic")
    ) {
      setIsDrawButtonDisabled(true);
      setTimeout(() => {
        setIsDrawButtonDisabled(false);
      }, 5000);
    }
    else if (
      gameState.drawMode === "manual" &&
      (gameState.bingoMode === "extended")
    ) {
      setIsDrawButtonDisabled(true);
      setTimeout(() => {
        setIsDrawButtonDisabled(false);
      }, 10000);
    }
    
    return true;
  }, []);

  return {
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
  };
};

export default useBingoGame;