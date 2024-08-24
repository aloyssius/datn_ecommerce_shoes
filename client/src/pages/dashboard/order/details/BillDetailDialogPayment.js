import PropTypes from 'prop-types';
// @mui
import { Dialog, Stack, Typography, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

import { formatCurrencyVnd } from '../../../../utils/formatCurrency';

// ----------------------------------------------------------------------

BillDetailDialogPayment.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  data: PropTypes.object,
};

export default function BillDetailDialogPayment({ open, onClose, data }) {

  const { payment } = data;

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose} sx={{ bottom: 50 }}>
      <Stack sx={{ px: 3, mt: 3 }}>
        <Typography variant="h6">Lịch sử thanh toán</Typography>
      </Stack>
      <Stack spacing={3} sx={{ px: 3, maxHeight: 600, mt: 2 }}>
        {payment && 
        <Scrollbar>
          <TableContainer sx={{ minWidth: 650 }} >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Số tiền</TableCell>
                  <TableCell align="left">Thời gian</TableCell>
                  <TableCell align="left">Mã giao dịch</TableCell>
                  <TableCell align="left">Phương thức thanh toán</TableCell>
                  <TableCell align="left">Trạng thái</TableCell>
                  <TableCell align="left">Nhân viên xác nhận</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key={payment?.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">
                    {formatCurrencyVnd(String(payment?.totalMoney))}
                  </TableCell>
                  <TableCell align="left">{payment?.createdAt}</TableCell>
                  <TableCell align="left">
                    {payment?.tradingCode || ".."}
                  </TableCell>
                  <TableCell align="left">
                    {payment?.type === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến"}
                  </TableCell>
                  <TableCell align="left">
                    <Label
                      variant={'ghost'}
                      color={
                        'success'
                      }
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {payment?.id && "Đã thanh toán"}
                    </Label>
                  </TableCell>
                    {payment?.createdBy && 
                  <TableCell align="left">
                    {`${payment?.createdBy} (${payment?.accountRole} - ${payment?.accountCode})`}
                  </TableCell>
                    }

                    {!payment?.createdBy && 
                  <TableCell align="left">
                        ..
                  </TableCell>
                    }
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        }
        <Stack direction="row" justifyContent="flex-end" sx={{ py: 3, px: 1 }}>
          <Button color="inherit" variant="contained" size="small" onClick={onClose}>
            Đóng
          </Button>
        </Stack>
      </Stack>

    </Dialog>
  );
}

const formatCurrency = (data) => {
  if (data === 0 || data === "0" || data === "" || !data) {
    return "0đ";
  }
  return `${formatCurrencyVnd(data)} đ`;
}
