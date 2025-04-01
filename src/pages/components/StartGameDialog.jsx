import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

const StartGameDialog = ({
  open,
  onClose,
  drawMode,
  setDrawMode,
  selectedDrawer,
  setSelectedDrawer,
  selectedBingoMode,
  setSelectedBingoMode,
  members,
  onStartGame,
  competitionMode, 
  setCompetitionMode 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Game Mode and Drawing Options</DialogTitle>
      <DialogContent>
        {/* Drawing mode selection */}
        <FormControl component="fieldset" fullWidth margin="normal">
          <RadioGroup value={drawMode} onChange={(e) => setDrawMode(e.target.value)}>
            <FormControlLabel value="auto" control={<Radio />} label="Automatic Drawing" />
            <FormControlLabel value="manual" control={<Radio />} label="Manual Drawing" />
          </RadioGroup>
        </FormControl>

        {/* Player selection for manual mode */}
        {drawMode === 'manual' && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="drawer-select-label">Drawing Player</InputLabel>
            <Select
              labelId="drawer-select-label"
              value={selectedDrawer || ''}
              label="Drawing Player"
              onChange={(e) => setSelectedDrawer(e.target.value)}
            >
              {members.map(member => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Bingo Mode Selection (Classic, Extended, Superfast) */}
        <FormControl component="fieldset" fullWidth margin="normal">
          <RadioGroup
            value={selectedBingoMode}
            onChange={(e) => setSelectedBingoMode(e.target.value)}
          >
            <FormControlLabel
              value="classic"
              control={<Radio />}
              label="Classic Bingo (Standard Mode) 🔹"
            />
            <FormControlLabel
              value="extended"
              control={<Radio />}
              label="Extended Time Mode (Easy Mode) 🕒"
            />
            <FormControlLabel
              value="superfast"
              control={<Radio />}
              label="Super Fast Bingo (Hard Mode) ⚡"
            />
          </RadioGroup>
        </FormControl>

        {/* Competition Mode Selection */}
        <FormControl component="fieldset" fullWidth margin="normal">
          <RadioGroup
            value={competitionMode}
            onChange={(e) => setCompetitionMode(e.target.value)}
          >
            <FormControlLabel
              value="competitive"
              control={<Radio />}
              label="Competitive Mode (Ranked) 🏆"
            />
            <FormControlLabel
              value="non-competitive"
              control={<Radio />}
              label="Non-Competitive Mode (First Bingo Wins!) 🎉"
            />
          </RadioGroup>
        </FormControl>


        {/* Mode descriptions - Keep the Bingo Mode descriptions as is */}
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          <strong>Classic:</strong> One number every 5 seconds, displayed for 5 seconds;
          only the latest number can be marked, no history displayed.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Extended:</strong> One number every 5 seconds, displayed for 10 seconds;
          up to 2 numbers visible, history (previous number) is listed and markable.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Super Fast:</strong> One number every 3 seconds, displayed for 3 seconds;
          quick decisions required, wrong "Bingo!" calls are penalized.
        </Typography>
         {/* Competition Mode descriptions */}
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          <strong>Competitive Mode:</strong> Players are ranked by score and completion time. The game continues until all numbers are drawn or all players have completed Bingo.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Non-Competitive Mode:</strong> The first player to call "Bingo!" wins immediately, and the game ends.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onStartGame}
          variant="contained"
          color="primary"
          disabled={drawMode === 'manual' && !selectedDrawer}
        >
          Start Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartGameDialog;