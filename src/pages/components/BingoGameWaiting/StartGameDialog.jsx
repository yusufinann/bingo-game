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
  setCompetitionMode,
  t
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("startGameDialog.title")}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" fullWidth margin="normal">
          <RadioGroup value={drawMode} onChange={(e) => setDrawMode(e.target.value)}>
            <FormControlLabel value="auto" control={<Radio />} label={t("startGameDialog.drawingMode.auto")} />
            <FormControlLabel value="manual" control={<Radio />} label={t("startGameDialog.drawingMode.manual")} />
          </RadioGroup>
        </FormControl>

        {drawMode === 'manual' && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="drawer-select-label">{t("startGameDialog.drawingPlayerLabel")}</InputLabel>
            <Select
              labelId="drawer-select-label"
              value={selectedDrawer || ''}
              label={t("startGameDialog.drawingPlayerLabel")}
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

        <FormControl component="fieldset" fullWidth margin="normal">
          <RadioGroup
            value={selectedBingoMode}
            onChange={(e) => setSelectedBingoMode(e.target.value)}
          >
            <FormControlLabel
              value="classic"
              control={<Radio />}
              label={t("startGameDialog.bingoMode.classicLabel")}
            />
            <FormControlLabel
              value="extended"
              control={<Radio />}
              label={t("startGameDialog.bingoMode.extendedLabel")}
            />
            <FormControlLabel
              value="superfast"
              control={<Radio />}
              label={t("startGameDialog.bingoMode.superfastLabel")}
            />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" fullWidth margin="normal">
          <RadioGroup
            value={competitionMode}
            onChange={(e) => setCompetitionMode(e.target.value)}
          >
            <FormControlLabel
              value="competitive"
              control={<Radio />}
              label={t("startGameDialog.competitionMode.competitiveLabel")}
            />
            <FormControlLabel
              value="non-competitive"
              control={<Radio />}
              label={t("startGameDialog.competitionMode.nonCompetitiveLabel")}
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: t("startGameDialog.description.classicText") }} />
        <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: t("startGameDialog.description.extendedText") }} />
        <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: t("startGameDialog.description.superfastText") }} />

        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: t("startGameDialog.description.competitiveText") }} />
        <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: t("startGameDialog.description.nonCompetitiveText") }} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t("startGameDialog.cancelButtonText")}</Button>
        <Button
          onClick={onStartGame}
          variant="contained"
          color="primary"
          disabled={drawMode === 'manual' && !selectedDrawer}
        >
          {t("startGameDialog.startButtonText")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StartGameDialog;