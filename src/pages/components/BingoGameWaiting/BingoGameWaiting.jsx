import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
  Fade,
  Zoom,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
  Stack,
  Container,
  Tooltip,
} from "@mui/material";
import {
  Casino as CasinoIcon,
  AccessTime as ClockIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Groups as GroupsIcon
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
  t,
  user
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [canStartGame, setCanStartGame] = useState(false);


  useEffect(() => {
    setCanStartGame(members.length >= 2);
  }, [members, lobbyInfo.maxMembers]);

  const getAvatarColor = (userId) => {
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
    ];
    

    const hash = Array.from(userId || '').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Fade in timeout={700}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            width: "100%",
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {/* Background decoration */}
          <Box 
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.primary.light}22 0%, transparent 70%)`,
              zIndex: 0
            }}
          />
          <Box 
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.secondary.light}22 0%, transparent 70%)`,
              zIndex: 0
            }}
          />
          
          {/* Header */}
          <Box 
            sx={{ 
              textAlign: "center", 
              mb: 4, 
              position: "relative", 
              zIndex: 1 
            }}
          >
            <Zoom in timeout={1000}>
              <Box sx={{ 
                display: "inline-flex", 
                p: 2,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${theme.palette.primary.light}33 0%, transparent 70%)`,
                mb: 1
              }}>
                <TrophyIcon
                  sx={{
                    fontSize: { xs: 50, sm: 60, md: 70 },
                    color: "primary",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                  }}
                />
              </Box>
            </Zoom>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              color="secondary"
              fontWeight="bold"
              sx={{
                textShadow: "0px 1px 2px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px",
                mb: 1
              }}
            >
              {t("bingoGameWaiting.lobbyTitle")}
            </Typography>
            <Chip
              icon={<InfoIcon />}
              label={isCurrentUserHost
                ? t("bingoGameWaiting.hostMessage")
                : t("bingoGameWaiting.guestMessage")}
              variant="outlined"
              color="secondary"
              sx={{ 
                py: 0.5, 
                px: 1,
                "& .MuiChip-label": {
                  fontWeight: 500,
                  fontSize: "0.9rem"
                }
              }}
            />
          </Box>

          <Grid container spacing={4}>
            {/* Left side - Player list */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}>
                    <GroupsIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h3" color="text.primary">
                      {t("Players")} ({members.length}/{lobbyInfo.maxMembers})
                    </Typography>
                  </Box>
                  
                  <List sx={{ 
                    py: 0,
                    maxHeight: 300,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px"
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: theme.palette.divider,
                      borderRadius: "6px"
                    }
                  }}>
                    {members.length > 0 ? (
                      members.map((member, index) => {
                        const isCurrentUser = member.id === user?.id;
                        const isHost = member.id === lobbyInfo?.createdBy;
                        
                        return (
                          <ListItem
                            key={member.id}
                            sx={{
                              py: 1,
                              px: 2,
                              background: isCurrentUser ? `${theme.palette.primary.main}11` : "transparent",
                              borderRadius: 1,
                              mb: 1,
                              transition: "all 0.2s",
                              border: isCurrentUser ? `1px solid ${theme.palette.primary.main}22` : "none",
                              "&:hover": {
                                background: `${theme.palette.primary.main}08`
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  bgcolor: getAvatarColor(member.id),
                                  color: "#fff",
                                  fontWeight: "bold",
                                  boxShadow: isHost ? "0 0 0 2px gold" : "none",
                                }}
                              >
                                {getInitials(member.name || member.username)}
                                {isHost && (
                                  <StarIcon 
                                    sx={{ 
                                      position: "absolute",
                                      bottom: -2,
                                      right: -2,
                                      fontSize: 14,
                                      color: "gold",
                                      bgcolor: "background.paper",
                                      borderRadius: "50%",
                                      p: 0.2
                                    }} 
                                  />
                                )}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Typography variant="body1" fontWeight={isCurrentUser ? 600 : 500}>
                                    {member.name || member.username || t("player")}
                                  </Typography>
                                  
                                  {isCurrentUser && (
                                    <Chip
                                      label={t("You")}
                                      size="small"
                                      sx={{ 
                                        ml: 1, 
                                        height: 20, 
                                        fontSize: "0.7rem",
                                        fontWeight: "bold" 
                                      }}
                                    />
                                  )}
                                  
                                  {isHost && (
                                    <Tooltip title={t("Lobby Host")} arrow>
                                      <Chip
                                        label={t("Host")}
                                        color="warning"
                                        size="small"
                                        sx={{ 
                                          ml: 1, 
                                          height: 20, 
                                          fontSize: "0.7rem",
                                          fontWeight: "bold" 
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })
                    ) : (
                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        height: 100,
                        flexDirection: "column" 
                      }}>
                        <PersonIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {t("No players have joined yet")}
                        </Typography>
                      </Box>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Right side - Game status and controls */}
            <Grid item xs={12} md={6}>
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
                        elevation={2}
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
                            members.length < 2
                              ? t("bingoGameWaiting.status.waitingForMinPlayers")
                              : t("bingoGameWaiting.status.waitingForPlayers", { 
                                  currentPlayers: members.length, 
                                  maxPlayers: lobbyInfo.maxMembers 
                                })
                          }
                          color={members.length < 2 ? "error" : "warning"}
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
                          {members.length < 2 
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
                            currentPlayers: members.length, 
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
            </Grid>
          </Grid>
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
        t={t}
      />
    </Container>
  );
};

export default BingoGameWaiting;