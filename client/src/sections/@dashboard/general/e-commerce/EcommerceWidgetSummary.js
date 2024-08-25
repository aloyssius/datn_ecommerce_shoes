import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { FaMoneyCheckAlt } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { BsBoxSeamFill } from "react-icons/bs";
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack } from '@mui/material';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
import { formatCurrencyVnd } from '../../../../utils/formatCurrency';
// components
import Iconify from '../../../../components/Iconify';
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 74,
  height: 74,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  color: theme.palette.success.main,
  // backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

// ----------------------------------------------------------------------

EcommerceWidgetSummary.propTypes = {
  chartColor: PropTypes.string,
  chartData: PropTypes.arrayOf(PropTypes.number),
  percent: PropTypes.number,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function EcommerceWidgetSummary({ title, percent, total, chartColor, chartData, type, color = 'primary' }) {
  const chartOptions = merge(BaseOptionChart(), {
    colors: [chartColor],
    chart: { animations: { enabled: true }, sparkline: { enabled: true } },
    stroke: { width: 2 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
  });

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" paragraph>
          {title}
        </Typography>
        <Typography variant="h3" gutterBottom>
          {type === 'revenue' ? `${formatCurrency(String(total))}` : total}
        </Typography>

        {/*
        <Stack direction="row" alignItems="center">
          <IconWrapperStyle
            sx={{
              ...(percent < 0 && {
                color: 'error.main',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
              }),
            }}
          >
            <Iconify width={16} height={16} icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
          </IconWrapperStyle>

          <Typography variant="subtitle2" component="span">
            {percent > 0 && '+'}
            {fPercent(percent)}
          </Typography>
          <Typography variant="body2" component="span" noWrap sx={{ color: 'text.secondary' }}>
            &nbsp;than last week
          </Typography>
        </Stack>
          */}
      </Box>

      {/*
      <ReactApexChart type="line" series={[{ data: chartData }]} options={chartOptions} width={120} height={80} />
      */}
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          ...(percent < 0 && {
            color: 'error.main',
            // bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
          }),
        }}
      >
        {type === 'revenue' && <FaMoneyCheckAlt size={74} />}
        {type === 'order' && <HiShoppingBag size={74} />}
        {type === 'product_sold' && <BsBoxSeamFill size={74} />}

      </IconWrapperStyle>
    </Card>
  );
}

const formatCurrency = (data) => {
  if (data === 0 || data === "0" || data === "" || !data || data === null || data === undefined) {
    return "0đ";
  }
  return `${formatCurrencyVnd(data)} đ`;
}
