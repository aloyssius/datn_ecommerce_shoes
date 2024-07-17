import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  Stack,
} from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
}));

// ----------------------------------------------------------------------

BillProductDetails.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};

export default function BillProductDetails({ products, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
  return (
    <>
      <TableContainer sx={{ minWidth: 720 }} className="table-product-bill-details">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell align="left">Đơn giá</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => {
              const { id, name, size, price, color, cover, quantity, available } = product;
              return (
                <TableRow key={id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image alt="product image" src={cover} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
                      <Box>
                        <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                          {name}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="body2">
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                              Kích cỡ:&nbsp;
                            </Typography>
                            {size}
                          </Typography>
                          <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                          <Typography variant="body2">
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                              Màu sắc:&nbsp;
                            </Typography>
                            {getColorName(color)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="left">{price}</TableCell>

                  <TableCell align="left">
                    <Incrementer
                      quantity={quantity}
                      available={available}
                      onDecrease={() => onDecreaseQuantity(id)}
                      onIncrease={() => onIncreaseQuantity(id)}
                    />
                  </TableCell>

                  <TableCell align="right">{fCurrency(price * quantity)}</TableCell>

                  <TableCell align="right">
                    <Stack spacing={0.1} direction="row">
                      <IconButton onClick={() => onDelete(id)} color="primary">
                        <Iconify icon={'eva:edit-2-outline'} width={20} height={20} />
                      </IconButton>
                      <IconButton onClick={() => onDelete(id)} color="error">
                        <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ /* width: 96, */ textAlign: 'center' }}>
      {quantity}
      {/*
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Iconify icon={'eva:minus-fill'} width={16} height={16} />
        </IconButton>
        {quantity}
        <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <Iconify icon={'eva:plus-fill'} width={16} height={16} />
        </IconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
      */}
    </Box>
  );
}
