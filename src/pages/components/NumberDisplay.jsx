import React, { useState, useEffect } from 'react';
import { Paper, Typography, Zoom } from '@mui/material';

const NumberDisplay = ({ currentNumber, theme, manualMode = false }) => {
  // "active" durumu: sayı çekildiğinde aktif (parlak) olarak gösterilir,
  // aktif süresi bitince (örneğin 5 saniye sonra) aktif false olur.
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (currentNumber) {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentNumber]);

  // Eğer sayı yoksa hiçbir şey gösterme.
  if (!currentNumber) return null;
  // Eğer otomatik modda (manualMode false) ve süre dolduysa, sayıyı kaldır.
  if (!manualMode && !active) return null;

  return (
    <Zoom in={true}>
      <Paper 
        elevation={6}
        sx={{
          width: 120,
          height: 120,
          mx: 'auto',
          mb: 4,
          mt:4,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.primary.main,
          color: 'white',
          opacity: manualMode && !active ? 0.5 : 1,
          transition: 'opacity 0.5s ease',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -8,
            right: -8,
            bottom: -8,
            left: -8,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'primary.light',
            // Yalnızca aktifken pulsasyon efekti verilsin.
            animation: active ? 'pulse 1.5s infinite' : 'none'
          }
        }}
      >
        <Typography variant="h2">
          {currentNumber}
        </Typography>
      </Paper>
    </Zoom>
  );
};

export default NumberDisplay;
