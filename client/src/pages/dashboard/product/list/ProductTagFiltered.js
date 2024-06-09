import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
import { All } from '../../../../constants/enum';
// utils
import { convertProductStatus } from '../../../../utils/ConvertEnum';
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

ProductTagFiltered.propTypes = {
  otherData: PropTypes.object,
  status: PropTypes.string,
  brands: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  stocks: PropTypes.arrayOf(PropTypes.string),
  isShowReset: PropTypes.bool,
  onRemoveStatus: PropTypes.func,
  onRemoveStock: PropTypes.func,
  onRemoveBrand: PropTypes.func,
  onRemoveCategory: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function ProductTagFiltered({
  otherData,
  status,
  stocks,
  brands,
  categories,
  onRemoveStatus,
  onRemoveStock,
  onRemoveBrand,
  onRemoveCategory,
  isShowReset,
  onResetAll,
}) {

  const findBrandName = (id) => {
    return otherData?.brands?.find((item) => item.id === id)?.name;
  }

  const findCategoryName = (id) => {
    return otherData?.categories?.find((item) => item.id === id)?.name;
  }

  return (
    <RootStyle>
      {status !== All.EN && (
        <WrapperStyle>
          <LabelStyle>Trạng thái:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={convertProductStatus(status)} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveStatus} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {stocks.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Số lượng tồn:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {stocks.map((s) => (
              <Chip
                key={s}
                color='primary'
                deleteIcon={'ic:round-clear-all'}
                label={s}
                size="small"
                onDelete={() => onRemoveStock(s)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}

      {categories.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Danh mục:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {categories.map((s) => (
              <Chip
                key={s.id}
                deleteIcon={'ic:round-clear-all'}
                label={findCategoryName(s)}
                color='primary'
                size="small"
                onDelete={() => onRemoveCategory(s)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}
      {brands.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Thương hiệu:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {brands.map((s) => (
              <Chip
                key={s}
                label={findBrandName(s)}
                color='primary'
                deleteIcon={'ic:round-clear-all'}
                size="small"
                onDelete={() => onRemoveBrand(s)}
                sx={{ m: 0.5 }}
              />
            ))}
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
