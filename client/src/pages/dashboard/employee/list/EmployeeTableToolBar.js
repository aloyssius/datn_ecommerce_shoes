import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// components
import useDebounce from '../../../../hooks/useDebounce';
import Iconify from '../../../../components/Iconify';
// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

EmployeeTableToolBar.propTypes = {
  filterSearch: PropTypes.string,
  filterGender: PropTypes.string,
  onFilterSearch: PropTypes.func,
  onFilterGender: PropTypes.func,
  optionsGender: PropTypes.arrayOf(PropTypes.string),
};

export default function EmployeeTableToolBar({
  filterGender,
  onFilterSearch,
  onFilterGender,
  optionsGender,
}) {

  const [filterSearch, setFilterSearch] = useState('');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onFilterSearch(debounceValue);
  }, [debounceValue]);
  return (

    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 2 }}>
      <TextField
        fullWidth
        select
        label="Giới tính"
        value={filterGender}
        onChange={onFilterGender}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      >
        {optionsGender.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>


      <TextField
        fullWidth
        value={filterSearch}
        onChange={(event) => setFilterSearch(event.target.value)}
        placeholder="Tìm kiếm nhân viên..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
