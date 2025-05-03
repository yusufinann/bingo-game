import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Container, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const DrawnNumbers = ({ drawnNumbers }) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const numbersPerPage = 10;

  // Automatically scroll to the last page when drawnNumbers change
  useEffect(() => {
    if (drawnNumbers.length > 0) { // Ensure there are drawn numbers before calculating pages
      const totalPages = Math.ceil(drawnNumbers.length / numbersPerPage);
      setCurrentPage(totalPages > 0 ? totalPages - 1 : 0); // Go to last page, or page 0 if no pages
    } else {
      setCurrentPage(0); // Reset to page 0 if drawnNumbers is empty
    }
  }, [drawnNumbers]);

  // Calculate total pages
  const totalPages = Math.ceil(drawnNumbers.length / numbersPerPage);

  // Get numbers for current page (showing in drawing order)
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
            justifyContent: 'center'
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
          disabled={currentPage === totalPages - 1 || totalPages <= 1}
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

      {/* Page indicator */}
      <Typography
        variant="body2"
        sx={{ 
          mt: 1, 
          textAlign: 'center',
          color: theme.palette.text.secondary
        }}
      >
        {totalPages > 0 ? `Page ${currentPage + 1} of ${totalPages}` : 'Page 1 of 1'}
      </Typography>
    </Container>
  );
};

export default DrawnNumbers;