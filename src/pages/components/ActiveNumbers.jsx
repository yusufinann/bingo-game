import React, { useState } from 'react';
import { Stack, Chip, Button } from '@mui/material';

const ActiveNumbers = ({ activeNumbers }) => {
  const [page, setPage] = useState(1);
  const numbersPerPage = 3;

  if (!activeNumbers || activeNumbers.length === 0) {
    return null; // veya boş dizi için başka bir şey döndürebilirsiniz
  }

  const totalPages = Math.ceil(activeNumbers.length / numbersPerPage);
  const startIndex = (page - 1) * numbersPerPage;
  const endIndex = startIndex + numbersPerPage;
  const displayedNumbers = activeNumbers.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
        {displayedNumbers.map((num, index) => (
          <Chip key={index} label={num} color="primary" />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button onClick={handlePrevPage} disabled={page === 1}>
            Önceki
          </Button>
          <span>{page} / {totalPages}</span>
          <Button onClick={handleNextPage} disabled={page === totalPages}>
            Sonraki
          </Button>
        </Stack>
      )}
    </div>
  );
};

export default ActiveNumbers;