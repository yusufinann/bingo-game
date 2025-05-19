import React, { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const CompletedPlayers = ({ completedPlayers = [] ,t}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // If no completed players, show a simple message
  if (!completedPlayers || completedPlayers.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
        {t("No players have completed Bingo yet")}.
      </Typography>
    );
  }

  return (
    <>
      {/* Compact display with badge and clickable icon */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
        <Typography variant="body1" sx={{ mr: 1 }}>
          {t("Bingo Completed")}:
        </Typography>
        
        <Tooltip title="View all players who completed Bingo">
          <IconButton
            color="warning"
            size="small"
            onClick={openDialog}
            sx={{ 
              animation: completedPlayers.length > 0 ? "pulse 1.5s infinite" : "none",
            }}
          >
            <Badge badgeContent={completedPlayers.length} color="primary">
              <TrophyIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        {/* Show first 3 names directly in the UI */}
        <Box sx={{ ml: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {completedPlayers.slice(0, 3).map((player, index) => (
            <Chip
              key={player.id}
              label={player.userName}
              size="small"
              color="warning"
              variant="outlined"
              icon={<TrophyIcon fontSize="small" />}
            />
          ))}
          
          {completedPlayers.length > 3 && (
            <Chip
              label={`+${completedPlayers.length - 3} more`}
              size="small"
              variant="outlined"
              onClick={openDialog}
              sx={{ cursor: "pointer" }}
            />
          )}
        </Box>
      </Box>

      {/* Dialog to show all completed players */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrophyIcon color="warning" />
            <Typography variant="h6">
              {t("Players Who Completed Bingo")}
            </Typography>
          </Box>
          <IconButton size="small" onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {completedPlayers.length === 0 ? (
            <Typography align="center">{t("No players have completed Bingo yet")}.</Typography>
          ) : (
            <List dense>
              {completedPlayers.map((player, index) => (
                <ListItem key={player.id}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      #{index + 1}
                    </Typography>
                  </ListItemIcon>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <TrophyIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={player.userName} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeDialog}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
          }
        }
      `}</style>
    </>
  );
};

export default CompletedPlayers;