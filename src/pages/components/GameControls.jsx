import React from "react";
import {
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from "@mui/icons-material";
const GameControls = ({
  secondaryColors,
  callBingo,
  primaryColors,
  gameState,
  hasCompletedBingo,
  currentUser,
  drawNumber,
  isDrawButtonDisabled,
  textColors,
  toggleSound,
  soundEnabled,
}) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
      <Button
        variant="contained"
        color="warning"
        startIcon={<TrophyIcon sx={{ color: secondaryColors.gold }} />}
        onClick={callBingo}
        sx={{
          py: 1.5,
          px: 4,
          borderRadius: 2,
          bgcolor: primaryColors.main,
          "&:hover": {
            bgcolor: primaryColors.dark,
          },
        }}
        disabled={gameState.gameEnded || hasCompletedBingo}
      >
        {hasCompletedBingo ? "Bingo Completed!" : "Call Bingo!"}
      </Button>

      {gameState.gameStarted &&
        !gameState.gameEnded &&
        gameState.drawMode === "manual" &&
        String(gameState.drawer) === String(currentUser?.id) && (
          <Button
            variant="contained"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              bgcolor: secondaryColors.main,
              "&:hover": {
                bgcolor: secondaryColors.dark,
              },
            }}
            onClick={drawNumber}
            disabled={gameState.gameEnded || isDrawButtonDisabled}
          >
            Draw Number
          </Button>
        )}

      <IconButton
        sx={{ color: textColors.primary }}
        onClick={toggleSound}
        aria-label={soundEnabled ? "Sesi kapat" : "Sesi aç"}
      >
        {soundEnabled ? (
          <VolumeUpIcon sx={{ color: secondaryColors.main }} />
        ) : (
          <VolumeOffIcon sx={{ color: textColors.disabled }} />
        )}
      </IconButton>
    </Stack>
  );
};

export default GameControls;
