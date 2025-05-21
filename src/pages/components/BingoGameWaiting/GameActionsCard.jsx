import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  Casino as CasinoIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";

const GameActionsCard = ({
  isMobile,
  isCurrentUserHost,
  gamePlayers,
  lobbyInfo,
  canStartGame,
  setOpenStartDialog,
  t,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <ClockIcon color="secondary" sx={{ fontSize: 30, mb: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("Status")}
              </Typography>
              <Chip
                label={
                  gamePlayers.length < 1
                    ? t("bingoGameWaiting.status.waitingForMinPlayers")
                    : t("bingoGameWaiting.status.waitingForPlayers", {
                        currentPlayers: gamePlayers.length,
                        maxPlayers: lobbyInfo.maxMembers
                      })
                }
                color={gamePlayers.length < 1 ? "error" : "warning"}
                size="small"
                sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
              />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {isCurrentUserHost ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
              >
                {gamePlayers.length < 1
                  ? t("needMorePlayers")
                  : t("readyToStart")}
              </Typography>

              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CasinoIcon />}
                onClick={() => setOpenStartDialog(true)}
                disabled={!canStartGame}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  "&:hover": {
                    transform: canStartGame ? "translateY(-2px)" : "none",
                    boxShadow: canStartGame ? "0 6px 12px rgba(0,0,0,0.2)" : "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  "&:disabled": {
                    bgcolor: theme.palette.action.disabledBackground,
                    opacity: 0.7
                  },
                  width: "100%",
                  maxWidth: 300,
                  transition: "all 0.2s ease"
                }}
              >
                {t("bingoGameWaiting.startGameButton", {
                  currentPlayers: gamePlayers.length,
                  maxPlayers: lobbyInfo.maxMembers
                })}
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center"
              }}
            >
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ mb: 1, fontWeight: "medium" }}
              >
                {t("bingoGameWaiting.waitingForHost")}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameActionsCard;