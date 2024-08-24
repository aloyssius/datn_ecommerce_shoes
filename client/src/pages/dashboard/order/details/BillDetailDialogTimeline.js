
import PropTypes from 'prop-types';
import {
  FaTruck,
  FaRegCalendarCheck,
  FaRegFileAlt,
  FaRegCalendarTimes,
  FaBusinessTime,
} from "react-icons/fa";
// @mui
import { Dialog, Box, Stack, Typography, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Scrollbar from '../../../../components/Scrollbar';

import { BillStatusTimeline } from '../../../../constants/enum';
// ----------------------------------------------------------------------

BillDetailDialogTimeline.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  data: PropTypes.object,
};

export default function BillDetailDialogTimeline({ open, onClose, histories }) {

  const historiesFiltered = histories?.filter((item, index, self) =>
    index === self.findIndex((t) => t.status === item.status)
  );

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose} sx={{ bottom: 50 }}>
      <Stack sx={{ px: 3, mt: 3 }}>
        <Typography variant="h6">Lịch sử đơn hàng</Typography>
      </Stack>
      <Stack spacing={3} sx={{ px: 3, maxHeight: 600, mt: 2 }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 650 }} >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" />
                  <TableCell align="left">Thời gian</TableCell>
                  <TableCell align="left">Nhân viên xác nhận</TableCell>
                  <TableCell align="left">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historiesFiltered?.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left" >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item?.status === BillStatusTimeline.en.CREATED &&
                          <FaRegFileAlt
                            color="#1890FF"
                            size={"40px"}
                            style={{ marginBottom: "5px" }}
                          />
                        }

                        {item?.status === BillStatusTimeline.en.WAITTING_DELIVERY &&
                          <FaBusinessTime
                            color="#FFC107"
                            size={"40px"}
                            style={{ marginBottom: "5px" }}
                          />
                        }

                        {item?.status === BillStatusTimeline.en.DELIVERING &&
                          <FaTruck
                            color="#2065D1"
                            size={"40px"}
                            style={{ marginBottom: "5px" }}
                          />
                        }

                        {item?.status === BillStatusTimeline.en.COMPLETED &&
                          <FaRegCalendarCheck
                            color="#54D62C"
                            size={"40px"}
                            style={{ marginBottom: "5px" }}
                          />
                        }

                        {item?.status === BillStatusTimeline.en.CANCELED &&
                          <FaRegCalendarTimes
                            color="#FF4842"
                            size={"40px"}
                            style={{ marginBottom: "5px" }}
                          />
                        }

                        <Typography variant='subtitle2' sx={{ ml: 2 }}>
                          {item?.action}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{item?.createdAt}</TableCell>
                    {item?.createdBy &&
                      <TableCell align="left">
                        {`${item?.createdBy} (${item?.accountRole} - ${item?.accountCode})`}
                      </TableCell>
                    }
                    {!item?.createdBy &&
                      <TableCell align="left">
                        ...
                      </TableCell>
                    }
                    <TableCell align="left">
                      {item?.note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Stack direction="row" justifyContent="flex-end" sx={{ py: 3, px: 1 }}>
          <Button color="inherit" variant="contained" size="small" onClick={onClose}>
            Đóng
          </Button>
        </Stack>
      </Stack>

    </Dialog>
  );
}
