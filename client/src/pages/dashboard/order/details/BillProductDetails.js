import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableContainer,
  Stack,
  Tooltip,
  TextField,
  MenuItem,
  Typography,
  Dialog,
  Button,
  Grid,
} from '@mui/material';
// utils
import { BillStatusTab } from '../../../../constants/enum';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { formatCurrencyVnd } from '../../../../utils/formatCurrency';

// hooks
import useFetch from '../../../../hooks/useFetch';
import useConfirm from '../../../../hooks/useConfirm'
import useNotification from '../../../../hooks/useNotification';
import { ADMIN_API } from '../../../../api/apiConfig';

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

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

// ----------------------------------------------------------------------

BillProductDetails.propTypes = {
  products: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  data: PropTypes.object,
  isOrderTransferNotYetPayment: PropTypes.func,
  status: PropTypes.string,
};

export default function BillProductDetails({ products, onDelete, status, isOrderTransferNotYetPayment, data, onUpdate }) {

  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({});

  const handleOpen = (item) => {
    setOpen(true);
    setProduct(item);
  }

  return (
    <>
      <TableContainer sx={{ minWidth: 720 }} className="table-product-bill-details">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell align="center">Đơn giá</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Thành tiền</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => {
              const { billDetailId, name, sizeName, price, colorName, pathUrl, quantity } = product;
              return (
                <TableRow key={billDetailId}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image alt="product image" src={pathUrl} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
                      <Box>
                        <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                          {`${name} ${colorName}`}
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
                            {sizeName}
                          </Typography>
                          {/*
                          <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                          <Typography variant="body2">
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                              Màu sắc:&nbsp;
                            </Typography>
                            {getColorName(color)}
                          </Typography>
                          */}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">{formatCurrency(String(price))}</TableCell>

                  <TableCell align="center">
                    <Incrementer
                      quantity={quantity}
                    />
                  </TableCell>

                  <TableCell align="center">{formatCurrency(String(price * quantity))}</TableCell>

                  {/* (status === BillStatusTab.en.PENDING_CONFIRM || status === BillStatusTab.en.WAITTING_DELIVERY) && !isOrderTransferNotYetPayment() &&
                    <TableCell align="right">
                      <Stack spacing={0.1} direction="row">
                        <Tooltip title="Cập nhật">
                          <IconButton onClick={() => handleOpen(product)} color="primary">
                            <Iconify icon={'eva:edit-2-outline'} width={20} height={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton onClick={() => onDelete(billDetailId)} color="error">
                            <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogUpdateProductBillItem
        open={open}
        onClose={() => setOpen(false)}
        item={product}
        data={data}
        onUpdate={onUpdate}
      />
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

const formatCurrency = (data) => {
  if (data === 0 || data === "0" || data === "" || !data) {
    return "0đ";
  }
  return `${formatCurrencyVnd(data)} đ`;
}

const DialogUpdateProductBillItem = ({ open, onClose, item, data, onUpdate }) => {

  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setQuantity(item?.quantity);
    setSize(item?.id);
    setNote("");
  }, [item])

  const handleClose = () => {
    setQuantity(item?.quantity);
    setSize(item?.id);
    setNote("");
    onClose();
  }

  const { put } = useFetch(null, { fetch: false });
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify } = useNotification();

  const onFinish = (data) => {
    onOpenSuccessNotify('Cập nhật số lượng thành công!')
    onUpdate(data);
    onClose();
  }

  const handleUpdate = () => {
    const oldTotalItem = parseInt(item?.price, 10) * parseInt(item?.quantity, 10);
    const newTotalItem = parseInt(item?.price, 10) * parseInt(quantity, 10);
    const totalMoney = parseInt(newTotalItem, 10) + parseInt(data?.totalMoney, 10) - parseInt(oldTotalItem, 10);

    const body = {
      totalMoney,
      id: data?.id,
      billDetailId: item?.billDetailId,
      quantity: parseInt(quantity, 10),
      note,
    }
    console.log(body);
    showConfirm("Xác nhận cập nhật số lượng mua mới?", () => put(ADMIN_API.bill.putQuantity, body, (response) => onFinish(response)));
  };

  const totalQuantityCurrent = item?.quantity + item?.stock;

  return (

    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} sx={{ bottom: 50 }}>
      <Stack sx={{ px: 3, mt: 3, ml: 0.5 }}>
        <Typography sx={{ display: 'flex' }} variant="h6">{`${item?.name} ${item?.colorName}`}
        </Typography>

      </Stack>
      <Stack spacing={1} sx={{ px: 3, maxHeight: 600, mt: 1 }}>
        <Box
          sx={{
            p: 1,
            mt: 1.5,
            display: 'grid',
            columnGap: 3.5,
            rowGap: 2.5,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
          }}
        >
          <Grid>
            <LabelStyle>
              Chọn số lượng mua
            </LabelStyle>
            <TextField
              fullWidth
              select
              InputLabelProps={{ shrink: true }}
              value={quantity}
              size='small'
              onChange={(e) => setQuantity(e.target.value)}
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                },
              }}
            >
              {ARR_QUANTITY.map((option) => (
                <MenuItem
                  disabled={parseInt(option, 10) > item?.stock && parseInt(option, 10) > totalQuantityCurrent}
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
                  {option} {(parseInt(option, 10) > item?.stock && parseInt(option, 10) > totalQuantityCurrent && "( Hết hàng)")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid>
            <LabelStyle>
              Ghi chú
            </LabelStyle>
            <TextField
              fullWidth
              value={note}
              size='small'
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
            />
          </Grid>
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ py: 3, px: 1 }}>
          <Button color="inherit" size="small" onClick={handleClose}>
            Hủy bỏ
          </Button>
          <Button size="small" onClick={handleUpdate} variant="contained" type="submit" disabled={size === item?.id && parseInt(quantity, 10) === item?.quantity}>
            Xác nhận
          </Button>
        </Stack>
      </Stack>

    </Dialog>
  )
}

const ARR_QUANTITY = ["1", "2", "3"];
