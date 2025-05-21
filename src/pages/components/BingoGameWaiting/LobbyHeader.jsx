import {
  Box,
  Typography,
  Chip,
  Zoom,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';

const LobbyHeader = ({ isMobile, isCurrentUserHost, t }) => {
  const theme = useTheme();

  return (
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
          <EmojiEventsIcon
            sx={{
              fontSize: { xs: 50, sm: 60, md: 70 },
              color: "primary.main",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
            }}
          />
        </Box>
      </Zoom>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        color="secondary.main"
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
  );
};

export default LobbyHeader;