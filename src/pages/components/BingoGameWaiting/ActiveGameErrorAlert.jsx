import React from "react";
import {
  Alert,
  AlertTitle,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import LinkIcon from "@mui/icons-material/Link";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ActiveGameErrorAlert = ({ errorData, t }) => {
  if (!errorData) {
    return null;
  }

  const { message, messageKey, activeGameInfo } = errorData;

  const appBaseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;

  const lobbyUrl = activeGameInfo?.lobbyCode
    ? `${appBaseUrl}/lobby/${activeGameInfo.lobbyCode}`
    : null;

  const gameTypeDisplay = (gameType) => {
    const types = {
      Bingo: t("gameTypes.bingo"),
      Hangman: t("gameTypes.hangman"),
    };
    return types[gameType] || gameType;
  };

  let displayMessage;
  if (messageKey && activeGameInfo) {
    displayMessage = t(messageKey, {
      gameType: gameTypeDisplay(activeGameInfo.gameType), 
      lobbyCode: activeGameInfo.lobbyCode,
    });
  } else if (message) {
    displayMessage = message;
  } else {

    displayMessage = t("error.unknown", "An unknown error occurred."); 
  }


  return (
    <Alert
      severity="warning"
      sx={{
        mb: 3,
        zIndex: 1,
        position: "relative",
        borderLeft: "5px solid",
        borderColor: "warning.main",
        boxShadow: 3,
      }}
      iconMapping={{
        warning: <WarningAmberIcon fontSize="inherit" sx={{ mr: 1, mt: 0.5 }} />,
      }}
    >
      <AlertTitle sx={{ fontWeight: "bold", mb: 0.5 }}>
        {t("activeGameErrorAlert.title")}
      </AlertTitle>
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {displayMessage}
      </Typography>

      {activeGameInfo && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="overline"
            display="block"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            {t("activeGameErrorAlert.activeGameDetails")}
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <VideogameAssetIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {t("activeGameErrorAlert.gameTypeLabel")}{" "}
                <Chip
                  label={gameTypeDisplay(activeGameInfo.gameType)}
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: "medium" }}
                />
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">
                {t("activeGameErrorAlert.lobbyCodeLabel")}{" "}
                <Chip
                  label={activeGameInfo.lobbyCode}
                  size="small"
                  variant="outlined"
                />
              </Typography>
            </Stack>

            {lobbyUrl && (
              <Button
                variant="contained"
                color="warning"
                size="small"
                href={lobbyUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LinkIcon />}
                sx={{
                  mt: 1,
                  alignSelf: "flex-start",
                  textTransform: "none",
                }}
              >
                {t(
                  "activeGameErrorAlert.goToLobby",
                  { lobbyCode: activeGameInfo.lobbyCode }
                )}
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Alert>
  );
};

export default ActiveGameErrorAlert;