import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
import { All } from '../../../../constants/enum';
// utils
import { convertOrderStatus } from '../../../../utils/ConvertEnum';
import getColorName from '../../../../utils/getColorName';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 10,
  color: theme.palette.text.dark,
  fontWeight: 'bold',
  backgroundColor: theme.palette.background.white,
  // borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

function labelPriceRange(range) {
  if (range === 'below') {
    return 'Below $25';
  }
  if (range === 'between') {
    return 'Between $25 - $75';
  }
  return 'Above $75';
}

OrderTagFiltered.propTypes = {
  status: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isShowReset: PropTypes.bool,
  onRemoveStatus: PropTypes.func,
  onRemoveDate: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function OrderTagFiltered({
  status,
  startDate,
  endDate,
  onRemoveStatus,
  onRemoveDate,
  isShowReset,
  onResetAll,
}) {

  const getDateLabel = (startDate, endDate) => {
    const parseDate = (dateString) => {
      const dateArray = dateString.split("-");
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];

      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12"
      ];

      const formattedDate = `${day} ${monthNames[Number(month) - 1]} ${year}`;
      return formattedDate;
    };

    const formattedStartDate = parseDate(String(startDate));
    const formattedEndDate = parseDate(String(endDate));

    if (startDate && endDate) {
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
    if (startDate && !endDate) {
      return `${formattedStartDate} - ?`;
    }
    if (!startDate && endDate) {
      return `? - ${formattedEndDate}`;
    }

    return 'No Dates Available';
  };

  return (
    <RootStyle>
      {status !== All.EN && (
        <WrapperStyle>
          <LabelStyle>Trạng thái:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={convertOrderStatus(status)} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveStatus} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {(startDate || endDate) && (
        <WrapperStyle>
          <LabelStyle>Ngày tạo:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={getDateLabel(startDate, endDate)} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveDate} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {!isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          Làm Mới
        </Button>
      )}
    </RootStyle>
  );
}
