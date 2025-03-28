import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Container } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const DrawnNumbers= ({ drawnNumbers }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const numbersPerPage = 10;

  // Automatically scroll to the last page when drawnNumbers change
  useEffect(() => {
    const totalPages = Math.ceil(drawnNumbers.length / numbersPerPage);
    setCurrentPage(totalPages - 1);
  }, [drawnNumbers]);

  // Calculate total pages
  const totalPages = Math.ceil(drawnNumbers.length / numbersPerPage);

  // Get numbers for current page (showing from the end)
  const currentPageNumbers = drawnNumbers.slice(
    Math.max(0, drawnNumbers.length - (currentPage + 1) * numbersPerPage),
    drawnNumbers.length - currentPage * numbersPerPage
  ).reverse(); // Reverse to maintain drawing order

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
          my: 2 ,
        }}
      >
        <IconButton 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          color="primary"
        >
          <ChevronLeft />
        </IconButton>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1.5, 
            alignItems: 'center' 
          }}
        >
          {currentPageNumbers.map((number) => (
            <Box
              key={number}
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {number}
            </Box>
          ))}
        </Box>

        <IconButton 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages - 1}
          color="primary"
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Page indicator */}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ mt: 1 }}
      >
        Page {totalPages - currentPage} of {totalPages}
      </Typography>
    </Container>
  );
};

export default DrawnNumbers;