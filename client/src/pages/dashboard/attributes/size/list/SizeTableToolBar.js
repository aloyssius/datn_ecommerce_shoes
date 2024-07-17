import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../../../components/Iconify';
import useDebounce from "../../../../../hooks/useDebounce";
// ----------------------------------------------------------------------

SizeTableToolbar.propTypes = {
  onFilterSearch: PropTypes.func,
};

export default function SizeTableToolbar({
  onFilterSearch,
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
        value={filterSearch}
        onChange={(event) => { setFilterSearch(event.target.value) }}
        placeholder="Tìm kiếm kích cỡ..."
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
