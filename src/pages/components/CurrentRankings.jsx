import React, { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
  Collapse,
  Box,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  EmojiEvents as TrophyIcon,
  Leaderboard as LeaderboardIcon,
} from "@mui/icons-material";

const CurrentRankings = ({ rankings = [], completedPlayers = [],t }) => {
  // State for collapsible rankings in the main UI
  const [expanded, setExpanded] = useState(false);
  // State for dialog display
  const [dialogOpen, setDialogOpen] = useState(false);

  // Toggle the expanded state for the collapsible view
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Open the dialog with full rankings
  const openRankingsDialog = () => {
    setDialogOpen(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // No rankings to display
  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Compact, collapsible rankings for the main UI */}
      <Paper
        elevation={3}
        sx={{
          p: 1,
          mt: 2,
          borderRadius: 2,
          bgcolor: "background.default",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrophyIcon color="primary" fontSize="small" />
            {t("Current Rankings")}
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="View Full Rankings">
              <IconButton 
                size="small" 
                onClick={openRankingsDialog}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={rankings.length} color="primary">
                  <LeaderboardIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconButton size="small" onClick={toggleExpanded}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="none" sx={{ fontWeight: "bold", width: "10%" }}>Rank</TableCell>
                <TableCell padding="none" sx={{ fontWeight: "bold", width: "70%" }}>Player</TableCell>
                <TableCell padding="none" sx={{ fontWeight: "bold", width: "20%" }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.slice(0, 5).map((rank, index) => (
                <TableRow key={rank.playerId}>
                  <TableCell padding="none">{index + 1}</TableCell>
                  <TableCell padding="none">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {completedPlayers.some(p => p.id === rank.playerId) && (
                        <Tooltip title="Completed Bingo">
                          <TrophyIcon 
                            fontSize="small" 
                            color="warning" 
                            sx={{ mr: 0.5, fontSize: "1rem" }}
                          />
                        </Tooltip>
                      )}
                      {rank.userName}
                    </Box>
                  </TableCell>
                  <TableCell padding="none">{rank.score}</TableCell>
                </TableRow>
              ))}
              {rankings.length > 5 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" padding="none">
                    <Button 
                      size="small" 
                      onClick={openRankingsDialog}
                      sx={{ fontSize: "0.75rem", py: 0 }}
                    >
                      {t("View All")} ({rankings.length})
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Collapse>
      </Paper>

      {/* Dialog for full rankings display */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrophyIcon color="primary" />
          {t("Complete Rankings")}
        </DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("Rank")}</TableCell>
                <TableCell>{t("Player")}</TableCell>
                <TableCell>{t("Score")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((rank, index) => (
                <TableRow key={rank.playerId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {completedPlayers.some(p => p.id === rank.playerId) && (
                        <Tooltip title="Completed Bingo">
                          <TrophyIcon 
                            fontSize="small" 
                            color="warning" 
                            sx={{ mr: 1 }}
                          />
                        </Tooltip>
                      )}
                      {rank.userName}
                    </Box>
                  </TableCell>
                  <TableCell>{rank.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CurrentRankings;