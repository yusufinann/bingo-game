import {
  Box,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Groups as GroupsIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const PlayerListCard = ({
  gamePlayers,
  lobbyInfo,
  currentUser,
  getAvatarColor,
  getInitials,
  t,
}) => {
  const theme = useTheme();

  return (
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
          <Typography variant="h6" color="text.primary">
            {t("Players")} ({gamePlayers.length}/{lobbyInfo.maxMembers})
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
          {gamePlayers.length > 0 ? (
            gamePlayers.map((player) => {
              const isPlayerCurrentUser = player.id === currentUser?.id;
              const isPlayerHost = player.id === lobbyInfo?.createdBy;

              return (
                <ListItem
                  key={player.id}
                  sx={{
                    py: 1,
                    px: 2,
                    background: isPlayerCurrentUser ? `${theme.palette.primary.main}11` : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    transition: "all 0.2s",
                    border: isPlayerCurrentUser ? `1px solid ${theme.palette.primary.main}22` : "none",
                    "&:hover": {
                      background: `${theme.palette.primary.main}08`
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={player.avatar || undefined}
                      sx={{
                        bgcolor: !player.avatar ? getAvatarColor(player.id) : undefined,
                        color: "#fff",
                        fontWeight: "bold",
                        boxShadow: isPlayerHost ? "0 0 0 2px gold" : "none",
                      }}
                    >
                      {!player.avatar && getInitials(player.name || player.userName)}
                      {isPlayerHost && (
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
                        <Typography variant="body1" fontWeight={isPlayerCurrentUser ? 600 : 500}>
                          {player.name || player.userName || t("player")}
                        </Typography>

                        {isPlayerCurrentUser && (
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

                        {isPlayerHost && (
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
  );
};

export default PlayerListCard;