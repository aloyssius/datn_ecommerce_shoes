import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { convertVoucherType } from '../../../../utils/ConvertEnum';
// components
import Iconify from '../../../../components/Iconify';
import useDebounce from '../../../../hooks/useDebounce';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

VoucherTableToolbar.propTypes = {
  filterType: PropTypes.string,
  filterStartDate: PropTypes.instanceOf(Date),
  filterEndDate: PropTypes.instanceOf(Date),
  onFilterSearch: PropTypes.func,
  onFilterType: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  optionsType: PropTypes.arrayOf(PropTypes.string),
};

export default function VoucherTableToolbar({
  filterType,
  filterStartDate,
  filterEndDate,
  onFilterSearch,
  onFilterType,
  onFilterStartDate,
  onFilterEndDate,
  optionsType,
}) {

  const [filterSearch, setFilterSearch] = useState('');
  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onFilterSearch(debounceValue);
  }, [debounceValue]);

  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 2 }}>
      <DatePicker
        label="Ngày bắt đầu"
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
        label="Ngày kết thúc"
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
        onChange={(event) => setFilterSearch(event.target.value)}
        placeholder="Tìm kiếm mã giảm giá..."
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
