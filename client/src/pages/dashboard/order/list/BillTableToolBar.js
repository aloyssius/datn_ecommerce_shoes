import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// components
import Iconify from '../../../../components/Iconify';
import useDebounce from "../../../../hooks/useDebounce";
// ----------------------------------------------------------------------

const INPUT_WIDTH = 200;

BillTableToolbar.propTypes = {
  filterStartDate: PropTypes.instanceOf(Date),
  filterEndDate: PropTypes.instanceOf(Date),
  onFilterSearch: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  onFilterEndDate: PropTypes.func,
};

export default function BillTableToolbar({
  filterStartDate,
  filterEndDate,
  onFilterSearch,
  onFilterStartDate,
  onFilterEndDate,
}) {

  const [filterSearch, setFilterSearch] = useState('');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onFilterSearch(debounceValue);
  }, [debounceValue]);

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 2 }}>

      <DatePicker
        label="Từ ngày"
        inputFormat='dd/MM/yyyy'
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="Đến ngày"
        inputFormat='dd/MM/yyyy'
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        value={filterSearch}
        onChange={(event) => { setFilterSearch(event.target.value) }}
        placeholder="Tìm kiếm theo mã đơn hàng hoặc khách hàng..."
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

