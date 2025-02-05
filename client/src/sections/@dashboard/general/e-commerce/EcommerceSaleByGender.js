import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, Typography } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

const CHART_DATA = [44, 75];

export default function EcommerceSaleByGender({ totalCount, totalPercent, isLoading }) {
  const theme = useTheme();

  const completed = totalPercent?.find((item) => item?.status === "completed")?.percentage;
  const canceled = totalPercent?.find((item) => item?.status === "canceled")?.percentage;

  const chartOptions = merge(BaseOptionChart(), {
    labels: ['Đã giao', 'Đã hủy'],
    colors: [theme.palette.primary.main, theme.palette.error.main],
    legend: { floating: true, horizontalAlign: 'center' },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          [
            {
              offset: 0,
              color: theme.palette.primary.light,
            },
            {
              offset: 100,
              color: theme.palette.primary.main,
            },
          ],
          [
            {
              offset: 0,
              color: theme.palette.error.light,
            },
            {
              offset: 100,
              color: theme.palette.error.main,
            },
          ],
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '68%' },
        dataLabels: {
          value: { offsetY: 16 },
          total: {
            label: "Tổng cộng",
            formatter: () => totalCount,
          },
        },
      },
    },
  });

  return (
    <>
      <Card>
        <CardHeader title="Biểu đồ trạng thái đơn hàng" />
        {totalCount === 0 ?
          <Typography variant='h5' sx={{ p: 5, textAlign: 'center' }}>
            Chưa có dữ liệu
          </Typography> :
          <ChartWrapperStyle dir="ltr">
            <ReactApexChart type="radialBar" series={[parseInt(completed, 10) || 0, parseInt(canceled, 10) || 0]} options={chartOptions} height={310} />
          </ChartWrapperStyle>
        }
      </Card>
    </>
  );
}
