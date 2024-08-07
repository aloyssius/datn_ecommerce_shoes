import merge from 'lodash/merge';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, Typography, CardHeader, Box, TextField } from '@mui/material';
//
import { BaseOptionChart } from '../../../../components/chart';
import { formatCurrencyVnd } from '../../../../utils/formatCurrency';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 2019,
    data: [
      { name: 'Tổng doanh thu', data: [12, 41, 35, 171, 49, 62, 69, 91, 48, 42, 43, 23] },
      // { name: 'Total Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 55, 67, 33] },
    ],
  },
  {
    year: 2020,
    data: [
      { name: 'Tổng doanh thu', data: [148, 91, 69, 62, 49, 51, 35, 41, 10, 12, 13, 43] },
      // { name: 'Total Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10, 23, 33, 44] },
    ],
  },
];

export default function EcommerceYearlySales({ month = [] }) {

  const data = month?.reduce((acc, item) => {
    let yearIndex = acc.findIndex((i) => i.year === item.year);
    if (yearIndex === -1) {
      acc.push({
        year: item.year,
        data: [
          {
            name: 'Tổng doanh thu',
            data: Array(12).fill(0),
          },
        ],
      });
      yearIndex = acc.length - 1;
    }

    acc[yearIndex].data[0].data[parseInt(item.month, 10) - 1] += item.totalRevenue;

    return acc;
  }, []);

  console.log(data);

  const [seriesData, setSeriesData] = useState(Math.max(...data.map(item => item.year)));

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    },
    yaxis: {
      labels: {
        formatter: (value) => `${formatCurrency(String(value))}`,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Biểu đồ thống kê doanh thu"
        // subheader="(+43%) than last year"
        action={
          month?.length > 0 &&
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 },
            }}
          >
            {data?.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />
      {data?.length <= 0 ?
        <Typography variant='h5' sx={{ p: 5, textAlign: 'center' }}>
          Chưa có dữ liệu
        </Typography> :
        <>
          {data?.map((item) => (
            <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
              {item.year === seriesData && (
                <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />
              )}
            </Box>
          ))}
        </>
      }

    </Card>
  );
}

const formatCurrency = (data) => {
  if (data === 0 || data === "0" || data === "" || !data || data === null || data === undefined) {
    return "0đ";
  }
  return `${formatCurrencyVnd(data)} đ`;
}
