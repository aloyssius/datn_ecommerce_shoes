import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Dialog, Tooltip, Box, Container, TextField, IconButton, MenuItem, CardHeader, CardContent, Button, Stack, Grid, Card, Typography } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
import useConfirm from '../../../../hooks/useConfirm';
import useNotification from '../../../../hooks/useNotification';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useAuth from '../../../../hooks/useAuth';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import Page from '../../../../components/Page';
import Scrollbar from '../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';
import BillProductDetails from './BillProductDetails';
import BillDetailDialogAddress from './BillDetailDialogAddress';
// utils
import { BillStatusTab, BillStatusTimeline } from '../../../../constants/enum';
import createAvatar from '../../../../utils/createAvatar';
import { _analyticOrderTimeline } from '../../../../_mock';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import { formatCurrencyVnd } from '../../../../utils/formatCurrency';
import { convertOrderStatus } from '../../../../utils/ConvertEnum';
import BillDetailDialogPayment from './BillDetailDialogPayment';
import BillDetailDialogTimeline from './BillDetailDialogTimeline';

// ----------------------------------------------------------------------

const LabelStyleHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.black,
  fontSize: 16.5,
}));

export default function BillDetails() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { id } = useParams();
  const { user } = useAuth();
  const { data, put, setData } = useFetch(ADMIN_API.bill.details(id));
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify } = useNotification();
  const [open, setOpen] = useState(false);
  const [openTimeline, setOpenTimeline] = useState(false);
  const [openPaymentHis, setOpenPaymentHis] = useState(false);

  const onFinishUpdateStatus = (res) => {
    setData(res);
    onOpenSuccessNotify("Cập nhật trạng thái thành công")
  }

  const handleUpdateStatus = (e) => {
    const value = e.target.value;
    if (value === BillStatusTab.en.CANCELED) {
      setOpen(true);
    }
    else {
      const body = {
        id: data?.id,
        status: value,
        actionTimeline: actionHistory(value),
        createdBy: user?.id,
        totalFinal,
      }
      console.log(body);
      const title = value === BillStatusTab.en.COMPLETED ? `Xác nhận đơn hàng đã được giao và đã nhận được số tiền là ${formatCurrency(String(totalFinal))}?` : "Xác nhận cập nhật trạng thái đơn hàng?";
      showConfirm(title, () => put(ADMIN_API.bill.putStatus, body, (response) => onFinishUpdateStatus(response)));
    }
  }

  const status = data?.status || "";
  const discount = data?.discount || 0;
  const shipFee = data?.shipFee || 0;
  const totalMoney = data?.totalMoney || 0;
  const totalQuantityProduct = data && data.billItems && data.billItems.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;
  const totalFinal = parseInt(totalMoney, 10) - parseInt(discount, 10) + parseInt(shipFee, 10);

  const isOrderTransferNotYetPayment = () => {
    if (data?.paymentMethod === TRANSFER && data?.payment === null/*  && data?.status === BillStatusTab.en.PENDING_CONFIRM */) {
      return true;
    }

    return false;
  }

  const historiesFiltered = data?.histories?.filter((item, index, self) =>
    index === self.findIndex((t) => t.status === item.status)
  );

  return (

    <Page title={`Quản lý đơn hàng - ${'Chi tiết đơn hàng'}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Chi tiết đơn hàng'}
          links={[
            { name: 'Danh sách đơn hàng', href: PATH_DASHBOARD.bill.list },
            { name: `${data?.code || ""}` },
          ]}
        />

        <Grid container spacing={3}>

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }} className="card">

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1}>
                    <Iconify style={{ fontSize: 23 }} icon={'eva:shopping-bag-outline'} />
                    <LabelStyleHeader>Danh sách sản phẩm</LabelStyleHeader>
                  </Stack>
                  {/* (status === BillStatusTab.en.PENDING_CONFIRM || status === BillStatusTab.en.WAITTING_DELIVERY) && !isOrderTransferNotYetPayment() &&
                    <Button sx={{ paddingInline: 2 }} size="small" color="primary" variant="contained">Thêm sản phẩm</Button>
                  */}
                </Stack>
                <Stack spacing={3} sx={{ py: 2 }}>

                  <Scrollbar>
                    <BillProductDetails
                      products={data?.billItems || []}
                      status={status}
                      isOrderTransferNotYetPayment={isOrderTransferNotYetPayment}
                      data={data}
                      onUpdate={(dataUpdate) => setData(dataUpdate)}
                    // onDelete={handleDeleteCart}
                    // onIncreaseQuantity={handleIncreaseQuantity}
                    // onDecreaseQuantity={handleDecreaseQuantity}
                    />
                  </Scrollbar>

                  <Box display="flex" justifyContent="flex-end">
                    <Stack spacing={1.7} sx={{ mt: 1 }}>
                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tổng số lượng
                        </Typography>
                        <Typography variant="subtitle2">{totalQuantityProduct}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tổng tiền hàng
                        </Typography>
                        <Typography variant="subtitle2">{formatCurrency(String(totalMoney))}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Giảm giá
                        </Typography>
                        <Typography variant="subtitle2">{discount !== 0 ? `- ${formatCurrency(String(discount))}` : formatCurrency(String(discount))}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Phí vận chuyển
                        </Typography>
                        <Typography variant="subtitle2">{formatCurrency(String(shipFee))}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tổng cộng
                        </Typography>
                        <Typography variant="subtitle2">{formatCurrency(String(totalFinal))}</Typography>
                      </Stack>

                    </Stack>
                  </Box>
                </Stack>
              </Card>

              <Card className="card"
                sx={{
                  '& .MuiTimelineItem-missingOppositeContent:before': {
                    display: 'none',
                  },
                }}
              >
                <CardHeader title={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1}>
                      <Iconify style={{ fontSize: 23 }} icon={'eva:file-text-outline'} />
                      <LabelStyleHeader>Lịch sử đơn hàng</LabelStyleHeader>
                    </Stack>
                    <Tooltip title="Xem lịch sử">
                      <IconButton size='medium' onClick={() => setOpenTimeline(true)}>
                        <Iconify icon={'eva:menu-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                } />
                <CardContent>
                  <Timeline>
                    {historiesFiltered?.map((item, index) => (
                      <OrderItem key={item.id} item={item} isLast={index === historiesFiltered.length - 1} />
                    ))}
                  </Timeline>
                </CardContent>
              </Card>

            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>

              <Card sx={{ p: 3 }} className='card'>
                <Stack direction="row" spacing={1}>
                  <Iconify style={{ fontSize: 23 }} icon={'eva:file-text-outline'} />
                  <LabelStyleHeader>Xử lý đơn hàng</LabelStyleHeader>
                </Stack>

                <Stack spacing={1.7} sx={{ mt: 2 }}>

                  {isOrderTransferNotYetPayment() &&
                    <Typography variant="subtitle2" sx={{ color: 'error.main' }}>{"Không thể giao hàng vì đơn hàng chưa được thanh toán bởi khách hàng"}</Typography>
                  }

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Trạng thái
                    </Typography>

                    <TextField
                      select
                      InputLabelProps={{ shrink: true }}
                      defaultValue={status === BillStatusTab.en.PENDING_CONFIRM ? "" : status}
                      value={status === BillStatusTab.en.PENDING_CONFIRM ? "" : status}
                      size='small'
                      onChange={handleUpdateStatus}
                      SelectProps={{
                        MenuProps: {
                          sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                        },
                      }}
                      sx={{
                        width: { md: 160 },
                        textTransform: 'capitalize',
                        '& .MuiSelect-select span::before': {
                          content: "'Chọn trạng thái'",
                          fontSize: 14,
                        },
                      }}
                    >
                      {STATUS_ARR.filter((item) => item !== BillStatusTab.en.PENDING_CONFIRM).map((option) => (
                        <MenuItem
                          disabled={
                            (isOrderTransferNotYetPayment() && option !== BillStatusTab.en.CANCELED) ||
                            ((status === BillStatusTab.en.PENDING_CONFIRM || status === BillStatusTab.en.WAITTING_DELIVERY) && option === BillStatusTab.en.COMPLETED) ||
                            (status === BillStatusTab.en.DELIVERING && option === BillStatusTab.en.WAITTING_DELIVERY) ||
                            (status === BillStatusTab.en.CANCELED &&
                              (option === BillStatusTab.en.WAITTING_DELIVERY || option === BillStatusTab.en.DELIVERING ||
                                option === BillStatusTab.en.PENDING_CONFIRM || option === BillStatusTab.en.COMPLETED)) ||
                            (status === BillStatusTab.en.COMPLETED &&
                              (option === BillStatusTab.en.WAITTING_DELIVERY || option === BillStatusTab.en.DELIVERING ||
                                option === BillStatusTab.en.PENDING_CONFIRM || option === BillStatusTab.en.CANCELED))
                          }
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
                          {convertOrderStatus(option)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3 }} className='card' >
                <Stack direction="row" spacing={1}>
                  <Iconify style={{ fontSize: 23 }} icon={'eva:calendar-outline'} />
                  <LabelStyleHeader>Thông tin đơn hàng</LabelStyleHeader>
                </Stack>

                <Stack spacing={1.7} sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Mã đơn hàng
                    </Typography>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle2">{data?.code || DIVIDE_DATA}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Ngày đặt hàng
                    </Typography>
                    <Typography variant="subtitle2">{data?.createdAt || DIVIDE_DATA}</Typography>
                  </Stack>

                  {data?.deliveryDate &&
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Ngày giao hàng
                      </Typography>
                      <Typography variant="subtitle2">{data?.deliveryDate || DIVIDE_DATA}</Typography>
                    </Stack>
                  }

                  {data?.completionDate &&
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Ngày hoàn thành
                      </Typography>
                      <Typography variant="subtitle2">{data?.completionDate || DIVIDE_DATA}</Typography>
                    </Stack>
                  }

                  {data?.cancellationDate &&
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Ngày hủy đơn
                      </Typography>
                      <Typography variant="subtitle2">{data?.cancellationDate || DIVIDE_DATA}</Typography>
                    </Stack>
                  }

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Trạng thái đơn hàng
                    </Typography>
                    {data?.status ?
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                          (data?.status === BillStatusTab.en.PENDING_CONFIRM && 'warning') ||
                          (data?.status === BillStatusTab.en.COMPLETED && 'success') ||
                          (data?.status === BillStatusTab.en.WAITTING_DELIVERY && 'default') ||
                          (data?.status === BillStatusTab.en.DELIVERING && 'primary') ||
                          (data?.status === BillStatusTab.en.CANCELED && 'error')
                        }
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {convertOrderStatus(data?.status)}
                      </Label>
                      : DIVIDE_DATA}
                  </Stack>

                </Stack>
              </Card>

              <Card sx={{ p: 3 }} className='card'>
                <Stack direction="row" spacing={1}>
                  <Iconify style={{ fontSize: 23 }} icon={'eva:person-outline'} />
                  <LabelStyleHeader>Thông tin khách hàng</LabelStyleHeader>
                </Stack>

                <Box sx={{ display: 'flex', mt: 2, alignItems: 'center' }}>
                  {!data?.customerId ?
                    <Avatar alt={""} color={createAvatar("").color} sx={{ mr: 2 }}>
                      {createAvatar("").name}
                    </Avatar>
                    :
                    <Avatar alt={data?.account?.fullName} color={createAvatar(data?.account?.fullName).color} sx={{ mr: 2 }}>
                      {createAvatar(data?.account?.fullName).name}
                    </Avatar>
                  }

                  <Stack spacing={0.6}>
                    {!data?.customerId ?
                      <Typography variant="body2" sx={{ color: 'primary.main' }}>
                        Khách hàng lẻ
                      </Typography> :
                      <>
                        <Typography variant="body2">
                          {data?.account?.fullName} {`(${data?.account?.code})`}
                        </Typography>

                        <Typography variant="body2">
                          {data?.account?.phoneNumber}
                        </Typography>

                        <Typography noWrap variant="body2" sx={{ color: 'text.disabled', fontSize: '13px' }}>
                          {data?.account?.email}
                        </Typography>
                      </>
                    }
                  </Stack>
                </Box>
              </Card>

              <Card sx={{ p: 3 }} className='card'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1}>
                    <Iconify style={{ fontSize: 23 }} icon={'eva:car-outline'} />
                    <LabelStyleHeader>Thông tin giao hàng</LabelStyleHeader>
                  </Stack>

                  {/* (status === BillStatusTab.en.PENDING_CONFIRM || status === BillStatusTab.en.WAITTING_DELIVERY) && !isOrderTransferNotYetPayment() &&
                    <Tooltip title="Chỉnh sửa">
                      <IconButton size='medium' onClick={() => setOpen(true)}>
                        <Iconify icon={'eva:edit-outline'} />
                      </IconButton>
                    </Tooltip>
                  */}
                </Box>

                <Stack spacing={1.7} sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Tên người nhận
                    </Typography>
                    <Typography variant="subtitle2">{data?.fullName || DIVIDE_DATA}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Số điện thoại
                    </Typography>
                    <Typography variant="subtitle2">{data?.phoneNumber || DIVIDE_DATA}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Email
                    </Typography>
                    <Typography variant="subtitle2">{data?.email || DIVIDE_DATA}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Địa chỉ
                    </Typography>
                    <Typography sx={{ maxWidth: 170 }} wrap variant="subtitle2">{data?.address || DIVIDE_DATA}</Typography>
                  </Stack>

                </Stack>
              </Card>

              <Card sx={{ p: 3 }} className='card'>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1}>
                    <Iconify style={{ fontSize: 23 }} icon={'eva:credit-card-outline'} />
                    <LabelStyleHeader>Thông tin thanh toán</LabelStyleHeader>
                  </Stack>

                  <Tooltip title="Xem lịch sử">
                    <IconButton size='medium' onClick={() => setOpenPaymentHis(true)}>
                      <Iconify icon={'eva:menu-2-outline'} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Stack spacing={1.7} sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Hình thức thanh toán
                    </Typography>
                    <Typography variant="subtitle2">{data?.paymentMethod === TRANSFER ? "Thanh toán trực truyến" : "Thanh toán khi nhận hàng"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Cần thanh toán
                    </Typography>
                    <Typography variant="subtitle2">{formatCurrency(String(totalFinal))}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Trạng thái thanh toán
                    </Typography>
                    {data?.id ?
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                          (data?.payment && 'success') ||
                          (!data?.payment && 'warning') ||
                          'default'
                        }
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {data?.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                      </Label>
                      : DIVIDE_DATA}
                  </Stack>

                </Stack>
              </Card>

            </Stack>

          </Grid>
        </Grid>
      </Container>

      <BillDetailDialogPayment open={openPaymentHis} onClose={() => setOpenPaymentHis(false)} data={data} />
      {/*
      <BillDetailDialogAddress
        open={open}
        onClose={() => setOpen(false)}
        currentAddress={data}
        totalFinal={totalFinal}
        onUpdate={(dataUpdate) => setData(dataUpdate)}
      />
      */}

      <DialogCancelOrder
        open={open}
        onClose={() => setOpen(false)}
        data={data}
        user={user}
        onUpdate={(dataUpdate) => setData(dataUpdate)}
      />

      <BillDetailDialogTimeline
        open={openTimeline}
        onClose={() => setOpenTimeline(false)}
        histories={data?.histories}
      />
    </Page>
  );
}

// thieu note address

function OrderItem({ item, isLast }) {
  const { status, createdAt, action } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (status === BillStatusTimeline.en.CREATED && 'info') ||
            (status === BillStatusTimeline.en.WAITTING_DELIVERY && 'warning') ||
            (status === BillStatusTimeline.en.DELIVERING && 'primary') ||
            (status === BillStatusTimeline.en.COMPLETED && 'success') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={1}>
            <Typography variant="subtitle2">{action}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {createdAt}
            </Typography>
          </Stack>

        </Stack>
      </TimelineContent>
    </TimelineItem>
  );
}

const formatCurrency = (data) => {
  if (data === 0 || data === "0" || data === "" || !data) {
    return "0đ";
  }
  return `${formatCurrencyVnd(data)} đ`;
}

const STATUS_ARR = [
  BillStatusTab.en.PENDING_CONFIRM,
  BillStatusTab.en.WAITTING_DELIVERY,
  BillStatusTab.en.DELIVERING,
  BillStatusTab.en.COMPLETED,
  BillStatusTab.en.CANCELED,
]

const TRANSFER = "transfer";

const DIVIDE_DATA = "---";

const actionHistory = (status) => {

  if (status === BillStatusTab.en.WAITTING_DELIVERY) {
    return {
      action: "Đang chuẩn bị hàng",
      note: "Người gửi đang chuẩn bị hàng",
    }
  }

  if (status === BillStatusTab.en.COMPLETED) {
    return {
      action: "Giao hàng thành công",
      note: "Đã giao hàng thành công đến khách hàng",
    }
  }
  if (status === BillStatusTab.en.DELIVERING) {
    return {
      action: "Đang vận chuyển",
      note: "Đơn hàng đang được vận chuyển đến khách hàng",
    }
  }

}

const DialogCancelOrder = ({ open, onClose, data, user, onUpdate }) => {

  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setNote("");
    }
  }, [open])

  const handleClose = () => {
    setNote("");
    onClose();
  }

  const { put } = useFetch(null, { fetch: false });
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify } = useNotification();

  const onFinish = (data) => {
    onOpenSuccessNotify("Cập nhật trạng thái thành công")
    onUpdate(data);
    onClose();
  }

  const handleUpdate = () => {
    const body = {
      id: data?.id,
      status: BillStatusTab.en.CANCELED,
      action: "Đã hủy đơn",
      note,
      createdBy: user?.id,
    }
    console.log(body);
    showConfirm("Xác nhận hủy đơn hàng?", () => put(ADMIN_API.bill.putStatus, body, (response) => onFinish(response)));
  };

  return (

    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} sx={{ bottom: 50 }}>
      <Stack sx={{ px: 3, mt: 3, ml: 0.5 }}>
        <Typography sx={{ display: 'flex' }} variant="h6">Xác nhận hủy đơn
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
          <Button size="small" onClick={handleUpdate} variant="contained" type="submit" disabled={note?.trim() === ""}>
            Xác nhận
          </Button>
        </Stack>
      </Stack>

    </Dialog>
  )
}

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));
