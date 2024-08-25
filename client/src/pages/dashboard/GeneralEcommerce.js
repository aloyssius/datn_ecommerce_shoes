import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TextField, Container, Grid, Stack, Typography, MenuItem } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ADMIN_API } from '../../api/apiConfig';
// hooks
import useSettings from '../../hooks/useSettings';
import useFetch from '../../hooks/useFetch';
// components
import Page from '../../components/Page';
// sections
import {
  // EcommerceWelcome,
  // EcommerceNewProducts,
  EcommerceYearlySales,
  EcommerceBestSalesman,
  EcommerceSaleByGender,
  EcommerceWidgetSummary,
  // EcommerceSalesOverview,
  EcommerceLatestProducts,
  // EcommerceCurrentBalance,
} from '../../sections/@dashboard/general/e-commerce';

// ----------------------------------------------------------------------

export default function GeneralEcommerce() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const { data, isLoading, fetch } = useFetch(null, { fetch: false });

  const { totalBill, totalCount, totalPercent, products, revenueByMonth } = data;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState("Hôm nay");
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (date === "Hôm nay") {
      setStartDate(new Date());
      setEndDate(new Date());
    }

    if (date === "Tuần này") {
      setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    }

    if (date === "Tháng này") {
      setStartDate(startOfMonth(new Date()));
      setEndDate(endOfMonth(new Date()));
    }
    if (date === "Năm nay") {
      setStartDate(startOfYear(new Date()));
      setEndDate(endOfYear(new Date()));
    }

  }, [date])

  const onFinish = () => {
    setKey((key) => key + 1);
  }

  useEffect(async () => {
    if (startDate && endDate) {
      const params = {
        startDate: startDate ? dayjs(startDate).format('DD-MM-YYYY') : null,
        endDate: endDate ? dayjs(endDate).format('DD-MM-YYYY') : null,
      }
      console.log(params);
      await fetch(ADMIN_API.statistics, params);
      onFinish();
    }
  }, [startDate, endDate])

  return (
    <Page title="Thống kê - DKN Shop">
      <>
        {data?.totalBill &&
          <Container maxWidth={themeStretch ? false : 'xl'}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: 40, fontWeight: '550' }}>THỐNG KÊ</Typography>
              <Stack spacing={2} direction="row">
                <DatePicker
                  label="Từ ngày"
                  inputFormat='dd/MM/yyyy'
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        // maxWidth: { md: INPUT_WIDTH },
                        width: 200,
                      }}
                    />
                  )}
                />

                <DatePicker
                  label="Đến ngày"
                  inputFormat='dd/MM/yyyy'
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        // maxWidth: { md: INPUT_WIDTH },
                        width: 200,
                      }}
                    />
                  )}
                />

                <TextField
                  fullWidth
                  select
                  label="Tùy chọn"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  SelectProps={{
                    MenuProps: {
                      sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                    },
                  }}
                  sx={{
                    width: 200,
                    textTransform: 'capitalize',
                  }}
                >
                  {dates.map((option) => (
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
              </Stack>
            </Stack>
            <Grid container spacing={3} sx={{ mt: 0 }}>

              <Grid item xs={12} md={4}>
                <EcommerceWidgetSummary
                  key={key}
                  title="Tổng Doanh Thu"
                  percent={2.6}
                  total={parseInt(totalBill?.totalMoney, 10) || 0}
                  chartColor={theme.palette.primary.main}
                  // chartData={[22, 8, 35, 50, 82, 84, 77, 12, 87, 43]}
                  type='revenue'
                  color='success'
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <EcommerceWidgetSummary
                  key={key}
                  title="Tổng Đơn Hàng"
                  percent={2}
                  total={totalBill?.totalOrder || 0}
                  // chartColor={theme.palette.chart.green[0]}
                  chartData={[56, 47, 40, 62, 73, 30, 23, 54, 67, 68]}
                  type='order'
                  color='info'
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <EcommerceWidgetSummary
                  key={key}
                  title="Tổng Sản Phẩm Đã Bán"
                  percent={0.6}
                  total={parseInt(totalBill?.totalSold, 10) || 0}
                  type='product_sold'
                  // chartColor={theme.palette.chart.red[0]}
                  chartData={[40, 70, 75, 70, 50, 28, 7, 64, 38, 27]}
                  color='warning'
                />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <EcommerceSaleByGender key={key} totalCount={totalCount} loading={isLoading} totalPercent={totalPercent || []} />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
                <EcommerceYearlySales key={key} month={revenueByMonth} />
              </Grid>


              {/*
          <Grid item xs={12} md={6} lg={8}>
            <EcommerceSalesOverview />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceCurrentBalance />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceBestSalesman type='product_hot' />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts />
          </Grid>
          */}

              <Grid item xs={12} md={12} lg={12}>
                <EcommerceBestSalesman key={key} type='product_hot' products={products} />
              </Grid>


            </Grid>
          </Container>
        }
      </>
    </Page>
  );
}

const dates = ["Hôm nay", "Tuần này", "Tháng này", "Năm nay"];
