import React, { useState } from 'react';
import {
  Button,
  Popover,
  MenuItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Chip,
  useTheme,
  Tooltip,
  ListItemIcon,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const getAvatarColorInternal = (userId) => {
  const colors = [
    "#FF5252", "#FF4081", "#E040FB", "#7C4DFF",
    "#536DFE", "#448AFF", "#40C4FF", "#18FFFF",
    "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41",
  ];
  if (!userId) return colors[0];
  const hash = Array.from(String(userId)).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return colors[hash % colors.length];
};

const getInitialsInternal = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const PlayerDropdownMenu = ({ gamePlayers, lobbyInfo, currentUser, t }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverId = open ? 'players-popover-menu' : undefined;

  return (
    <>
      <Button
        aria-controls={popoverId}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<GroupsIcon />}
        variant="outlined"
        size="medium"
        sx={{
          textTransform: 'none',
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.divider,
          minWidth: 'auto',
          px: 1.5,
          height: 40,
          '& .MuiButton-startIcon': {
            marginRight: 0.5,
          },
        }}
      >
        <Typography variant="body2" component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {gamePlayers.length} {gamePlayers.length === 1 ? t('Player') : t('Players')}
        </Typography>
        <Typography variant="body2" component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
          {gamePlayers.length}
        </Typography>
      </Button>
      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 0.5,
            minWidth: 240,
            borderRadius: theme.shape.borderRadius,
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Box
          sx={{
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          {gamePlayers.length > 0 ? (
            gamePlayers.map((player) => {
              const isPlayerCurrentUser = player.id === currentUser?.id;
              const isPlayerHost = player.id === lobbyInfo?.createdBy;

              const namePart = player.name?.trim();
              const userNamePart = player.userName?.trim();

              let primaryTextValue;
              let secondaryTextValue;

              if (namePart) {
                primaryTextValue = namePart;
                if (userNamePart && userNamePart !== namePart) {
                  secondaryTextValue = `@${userNamePart}`;
                }
              } else if (userNamePart) {
                primaryTextValue = userNamePart; 
              } else {
                primaryTextValue = t("Player"); 
              }
              
              const initialsName = namePart || userNamePart;

              return (
                <MenuItem
                  key={player.id}
                  onClick={handleClose}
                  sx={{
                    py: 1,
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 'auto', mr: 1.5 }}>
                    <Avatar
                      src={player.avatar || undefined}
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: !player.avatar ? getAvatarColorInternal(player.id) : undefined,
                        color: theme.palette.getContrastText(!player.avatar ? getAvatarColorInternal(player.id) : theme.palette.primary.main),
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {!player.avatar && getInitialsInternal(initialsName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={primaryTextValue}
                    secondary={secondaryTextValue}
                    primaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                      fontWeight: isPlayerCurrentUser ? 600 : 400,
                    }}
                    secondaryTypographyProps={secondaryTextValue ? {
                      variant: 'subtitle2',
                      noWrap: true,
                      color: 'text.secondary',
                    } : undefined}
                  />
                  {isPlayerHost && (
                    <Tooltip title={t("Lobby Host")} arrow placement="top">
                      <StarIcon sx={{ color: 'gold', fontSize: 18, ml: 1 }} />
                    </Tooltip>
                  )}
                  {isPlayerCurrentUser && (
                    <Chip
                    label={t("You")}
                    size="small"
                    sx={{ ml:1, height: 18, fontSize: "0.65rem", fontWeight: "bold", bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}
                  />
                  )}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem onClick={handleClose} disabled sx={{ justifyContent: 'center', py: 1.5 }}>
              <ListItemIcon sx={{minWidth: 'auto', mr:1}}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{variant: 'body2', color: 'text.secondary'}}>
                {t("No players currently in game")}
              </ListItemText>
            </MenuItem>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default PlayerDropdownMenu;