import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, CardHeader, CardContent, Button, Stack, Grid, Card, Typography } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
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
// utils
import createAvatar from '../../../../utils/createAvatar';
import { _analyticOrderTimeline } from '../../../../_mock';
// utils
import { fDateTime } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

const LabelStyleHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.black,
  fontSize: 16.5,
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export default function BillDetails() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const { data } = useFetch(null);

  const products = [
    {
      id: 2,
      name: "Panda",
      size: 41,
      price: 20000,
      color: "White Blue",
      cover: "https://ananas.vn/wp-content/uploads/Pro_AV00207_1.jpg",
      quantity: 10,
    },
    {
      id: 1,
      name: "Nike",
      size: 42,
      price: 10000,
      color: "White",
      cover: "https://ananas.vn/wp-content/uploads/Pro_AV00207_1.jpg",
      quantity: 10,
    },
    {
      id: 3,
      name: "PDB",
      size: 42,
      price: 30000,
      color: "Red",
      cover: "https://ananas.vn/wp-content/uploads/Pro_AV00207_1.jpg",
      quantity: 10,
    },
    {
      id: 4,
      name: "Nice",
      size: 40,
      price: 20000,
      color: "Blue",
      cover: "https://ananas.vn/wp-content/uploads/Pro_AV00207_1.jpg",
      quantity: 10,
    },
  ];

  return (

    <Page title={`Quản lý đơn hàng - ${'Chi tiết đơn hàng'}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Chi tiết đơn hàng'}
          links={[
            { name: 'Danh sách đơn hàng', href: PATH_DASHBOARD.bill.list },
            { name: '#DKN0001' },
          ]}
        />

        <Grid container spacing={3}>

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }} className="card">

                <LabelStyleHeader>Danh sách sản phẩm</LabelStyleHeader>
                <Stack spacing={3} sx={{ py: 2 }}>

                  <Scrollbar>
                    <BillProductDetails
                      products={products}
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
                        <Typography variant="subtitle2">{"12"}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tổng tiền hàng
                        </Typography>
                        <Typography variant="subtitle2">{"2,500,000đ"}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Giảm giá
                        </Typography>
                        <Typography variant="subtitle2">{"500,000đ"}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Phí vận chuyển
                        </Typography>
                        <Typography variant="subtitle2">{"30,000đ"}</Typography>
                      </Stack>

                      <Stack spacing={5} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Tổng cộng
                        </Typography>
                        <Typography variant="subtitle2">{"3,000,000đ"}</Typography>
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
                <CardHeader title="Lịch sử đơn hàng" />
                <CardContent>
                  <Timeline>
                    {_analyticOrderTimeline.map((item, index) => (
                      <OrderItem key={item.id} item={item} isLast={index === _analyticOrderTimeline.length - 1} />
                    ))}
                  </Timeline>
                </CardContent>
              </Card>

            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>

              <Card sx={{ p: 3 }} className='card' >
                <LabelStyleHeader>Thông tin đơn hàng</LabelStyleHeader>

                <Stack spacing={1.7} sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Mã đơn hàng
                    </Typography>
                    <Typography variant="body2">{"#ĐKN0001"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Ngày tạo
                    </Typography>
                    <Typography variant="body2">{"22/12/2022"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Trạng thái đơn hàng
                    </Typography>
                    <Typography variant="body2">{"Chờ xác nhận"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Trạng thái thanh toán
                    </Typography>
                    <Typography variant="body2">{"Đã thanh toán"}</Typography>
                  </Stack>

                </Stack>
              </Card>

              <Card sx={{ p: 3 }} className='card'>
                <LabelStyleHeader>Thông tin khách hàng</LabelStyleHeader>

                <Box sx={{ display: 'flex', mt: 2 }}>
                  <Avatar alt={"Hello"} color={createAvatar("Hello").color} sx={{ mr: 2 }}>
                    {createAvatar("Hello").name}
                  </Avatar>

                  <Stack spacing={0.6}>
                    <Typography variant="body2" noWrap>
                      {"Hello"}
                    </Typography>

                    <Typography noWrap variant="body2" sx={{ fontSize: '13px' }}>
                      {"0978774477"}
                    </Typography>

                    <Typography noWrap variant="body2" sx={{ color: 'text.disabled', fontSize: '13px' }}>
                      {"abc@gmail.com"}
                    </Typography>
                  </Stack>
                </Box>
              </Card>


              <Card sx={{ p: 3 }} className='card'>
                <LabelStyleHeader>Thông tin giao hàng</LabelStyleHeader>

                <Stack spacing={1.7} sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Tên người nhận
                    </Typography>
                    <Typography variant="body2">{"Lê Thị Hợi"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Số điện thoại
                    </Typography>
                    <Typography variant="body2">{"0978774477"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Địa chỉ
                    </Typography>
                    <Typography sx={{ maxWidth: 170 }} wrap variant="body2">{"Số nhà 12 Ngõ 40 Phú Kiều, Kiều Mai, Bắc Từ Liêm, Hà Nội"}</Typography>
                  </Stack>

                </Stack>
              </Card>

              <Card sx={{ p: 3 }} className='card'>
                <LabelStyleHeader>Thanh toán</LabelStyleHeader>

                <Stack spacing={1.7} sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Cần thanh toán
                    </Typography>
                    <Typography variant="subtitle2">{"2,500,000đ"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Đã thanh toán
                    </Typography>
                    <Typography variant="subtitle2">{"0đ"}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="flex-end">
                    <Button size="medium" color="primary" sx={{ mt: 2 }} variant="contained">Thanh toán</Button>
                  </Stack>

                </Stack>
              </Card>

            </Stack>

          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === 'order1' && 'primary') ||
            (type === 'order2' && 'success') ||
            (type === 'order3' && 'info') ||
            (type === 'order4' && 'warning') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
