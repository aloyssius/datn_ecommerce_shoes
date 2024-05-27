import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// components
import Iconify from '../../../../components/Iconify';
// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

VoucherTableToolbar.propTypes = {
  filterDiscountValue: PropTypes.string,
  filterQuantity: PropTypes.string,
  filterTypeDiscount: PropTypes.string,
  filterSearch: PropTypes.string,
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
  filterDiscountValue,
  filterQuantity,
  filterTypeDiscount,
  filterSearch,
  filterType,
  filterStartDate,
  filterEndDate,
  onFilterSearch,
  onFilterType,
  onFilterStartDate,
  onFilterEndDate,
  optionsType,
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Loại"
        value={filterType}
        onChange={onFilterType}
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
        {optionsType.map((option) => (
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
        onChange={(event) => onFilterSearch(event.target.value)}
        placeholder="Tìm kiếm mã giảm giá..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      <Stack
        direction="row"
        spacing={1}
        flexShrink={0}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
      >
        <Button disableRipple color="inherit" endIcon={<Iconify icon={'ic:round-filter-list'} />} /* onClick={onOpen} */>
          Bộ lọc
        </Button>
      </Stack>
    </Stack>
  );
}
