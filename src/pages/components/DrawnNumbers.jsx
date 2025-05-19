import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Container, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const DrawnNumbers = ({ drawnNumbers, t }) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const numbersPerPage = 10;

  useEffect(() => {
    if (drawnNumbers.length > 0) {
      const totalPages = Math.ceil(drawnNumbers.length / numbersPerPage);
      setCurrentPage(totalPages > 0 ? totalPages - 1 : 0);
    } else {
      setCurrentPage(0);
    }
  }, [drawnNumbers, numbersPerPage]); 

  const totalPages = Math.ceil(drawnNumbers.length / numbersPerPage);

  const currentPageNumbers = drawnNumbers.slice(
    currentPage * numbersPerPage,
    (currentPage + 1) * numbersPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          my: 2,
        }}
      >
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          aria-label={t('drawnNumbers.previousPage')}
          sx={{
            color: theme.palette.primary.main,
            '&.Mui-disabled': {
              color: theme.palette.text.disabled
            }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            minHeight: 60, // To prevent layout shift when numbers are few
          }}
        >
          {currentPageNumbers.map((number) => (
            <Box
              key={number}
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: theme.shadows[2],
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[4],
                  bgcolor: theme.palette.primary.dark || theme.palette.primary.main,
                },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: `2px solid ${theme.palette.primary.light}`,
                  top: 0,
                  left: 0,
                  opacity: 0.6,
                  pointerEvents: 'none'
                }
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ userSelect: 'none' }}
              >
                {number}
              </Typography>
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1 || totalPages <= 0} // Changed totalPages <= 1 to totalPages <= 0 for empty case
          aria-label={t('drawnNumbers.nextPage')}
          sx={{
            color: theme.palette.primary.main,
            '&.Mui-disabled': {
              color: theme.palette.text.disabled
            }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          textAlign: 'center',
          color: theme.palette.text.secondary
        }}
      >
        {totalPages > 0
          ? t('drawnNumbers.pageIndicator', { currentPage: currentPage + 1, totalPages: totalPages })
          : t('drawnNumbers.noPages')}
      </Typography>
    </Container>
  );
};

export default DrawnNumbers;