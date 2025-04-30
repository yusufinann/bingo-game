import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Casino as CasinoIcon,
  AccessTime as ClockIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import StartGameDialog from "./StartGameDialog";

const BingoGameWaiting = ({
  members,
  lobbyInfo,
  isCurrentUserHost,
  openStartDialog,
  setOpenStartDialog,
  drawMode,
  setDrawMode,
  selectedDrawer,
  setSelectedDrawer,
  selectedBingoMode,
  setSelectedBingoMode,
  startGameWithOptions,
  competitionMode,
  setCompetitionMode,
  currentUser
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



  const [canStartGame, setCanStartGame] = useState(false);

  useEffect(() => {
    setCanStartGame(members.length >= lobbyInfo.minMembers && members.length <= lobbyInfo.maxMembers);
    setCanStartGame(members.length < lobbyInfo.maxMembers);


  }, [members, lobbyInfo.maxMembers, lobbyInfo.minMembers]); 


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        p: { xs: 2, md: 4 },
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            maxWidth: "900px",
            width: "100%",
            background: "transparent",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Zoom in timeout={800}>
              <TrophyIcon
                sx={{
                  fontSize: { xs: 60, md: 80 },
                  color: "primary.main",
                  mb: 2,
                }}
              />
            </Zoom>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              color="primary"
              fontWeight="bold"
              sx={{
                textShadow: "0px 1px 2px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px",
              }}
            >
              Bingo Game Lobby
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              {isCurrentUserHost
                ? "You're the host! Start the game when everyone is ready."
                : "Please wait for the host to start the game."}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "400px",
              mx: "auto",
              gap: 3,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                width: "100%",
                bgcolor: "background.paper",
                textAlign: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                <ClockIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.primary">
                  Game Status
                </Typography>
              </Box>
              <Chip
                label="Waiting for players"
                color="warning"
                sx={{ width: "100%", py: 1, fontWeight: "bold" }}
              />
            </Paper>

            {isCurrentUserHost ? (
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CasinoIcon />}
                onClick={() => setOpenStartDialog(true)}
                disabled={canStartGame}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                  },
                  width: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                Start Game ({members.length}/{lobbyInfo.maxMembers})
              </Button>
            ) : (
              <Box sx={{ textAlign: "center", p: 2 }}>
                <CircularProgress size={isMobile ? 40 : 60} color="primary" />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2, fontStyle: "italic" }}
                >
                  Waiting for host to start...
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Fade>

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
        competitionMode={competitionMode}
        setCompetitionMode={setCompetitionMode}
      />
    </Box>
  );
};

export default BingoGameWaiting;