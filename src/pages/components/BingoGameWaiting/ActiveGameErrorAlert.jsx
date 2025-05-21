import React from "react";
import { Alert, AlertTitle, Typography } from "@mui/material";

const ActiveGameErrorAlert = ({ errorData, t }) => {
  if (!errorData) {
    return null; 
  }

  return (
    <Alert severity="warning" sx={{ mb: 3, zIndex: 1, position: "relative" }}>
      <AlertTitle>
        {t("activeGameErrorAlert.title", "Başka Bir Oyunda Aktifsiniz")}
      </AlertTitle>
      <Typography variant="body2">{errorData.message}</Typography>
      {errorData.activeGameInfo && (
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          {t(
            "activeGameErrorAlert.details",
            "Aktif Oyun: {{gameType}} - Lobi: {{lobbyCode}}",
            {
              gameType: errorData.activeGameInfo.gameType,
              lobbyCode: errorData.activeGameInfo.lobbyCode,
            }
          )}
        </Typography>
      )}
    </Alert>
  );
};

export default ActiveGameErrorAlert;