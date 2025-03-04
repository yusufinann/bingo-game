import React from 'react';
import { Box, Chip, Stack, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import { 
  Groups as PlayersIcon, 
  VolumeUp as VolumeUpIcon, 
  VolumeOff as VolumeOffIcon, 
  EmojiEvents as HostIcon 
} from '@mui/icons-material';

const PlayersList = ({ members, currentTurn, isHost, soundEnabled, toggleSound }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayersIcon color="primary" />
          {isHost && <Chip size="small" label="You are Host" color="primary" sx={{ ml: 2 }} />}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip 
            icon={<PlayersIcon />} 
            label={`${members.length} Players`}
            color="primary"
            variant="filled"
            sx={{ bgcolor: 'primary.light' }}
          />
          <Tooltip title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}>
            <IconButton onClick={toggleSound} color="inherit">
              {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {members.map((member, index) => {
          const isHostMember = member.isHost; // Üye nesnesinde isHost property'si olmalı
          return (
            <Chip
              key={member.id}
              avatar={
                <Avatar sx={{ 
                  bgcolor: currentTurn === member.id 
                    ? 'success.main' 
                    : (isHostMember ? 'warning.main' : 'grey.500') 
                }}>
                  {member.name?.[0] || `P${index + 1}`}
                </Avatar>
              }
              label={
                <Box display="flex" alignItems="center">
                  <span>{member.name || `Player ${index + 1}`}</span>
                  {isHostMember && (
                    <Tooltip title="Host">
                      <HostIcon sx={{ ml: 0.5, fontSize: 18, color: 'warning.main' }} />
                    </Tooltip>
                  )}
                </Box>
              }
              color={currentTurn === member.id ? "success" : (isHostMember ? "warning" : "default")}
              variant={currentTurn === member.id ? "filled" : "outlined"}
              sx={{
                mb: 1,
                position: 'relative',
                '&::after': currentTurn === member.id
                  ? {
                      content: '""',
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      animation: 'pulse 1.5s infinite'
                    }
                  : {}
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default PlayersList;
