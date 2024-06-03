import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { All, VoucherTypeOptions, VoucherStatusTabs } from '../../../../constants/enum';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useTabs from '../../../../hooks/useTabs';
import useSettings from '../../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// _mock_
import { _vouchers } from '../../../../_mock';
// components
import Page from '../../../../components/Page';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../../components/table';
// sections
import PromotionTableToolbar from './PromotionTableToolBar';
import PromotionTableRow from './PromotionTableRow';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
  All.VI,
  VoucherTypeOptions.vi.PUBLIC,
  VoucherTypeOptions.vi.PRIVATE,
];

const TABLE_HEAD = [
  { id: 'code', label: 'Mã', align: 'left' },
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'value', label: 'Giá trị', align: 'left' },
  { id: 'dateTimeRange', label: 'Thời gian', align: 'left' },
  { id: 'status', label: 'Trạng Thái', align: 'left' },
  { id: 'action', label: 'Thao tác', align: 'center' },
];

// ----------------------------------------------------------------------

export default function VoucherList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    order,
    orderBy,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
  } = useTable({ defaultOrderBy: 'value' });

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: VoucherStatusTabs.en.ACTIVE, label: VoucherStatusTabs.vi.ACTIVE, color: 'success', count: 0 },
      { value: VoucherStatusTabs.en.UNACTIVE, label: VoucherStatusTabs.vi.UNACTIVE, color: 'warning', count: 0 },
      { value: VoucherStatusTabs.en.EXPIRED, label: VoucherStatusTabs.vi.EXPIRED, color: 'error', count: 0 },
      { value: VoucherStatusTabs.en.DRAFT, label: VoucherStatusTabs.vi.DRAFT, color: 'default', count: 0 },
    ]
  );

  const [tableData, setTableData] = useState([
    {
      id: 1,
      code: '123123',
      name: 'ABC',
      value: 500000,
      dateTimeRange: '17/05/2023 - 18/05/2024',
      status: 'ACTIVE',
    },
    {
      id: 2,
      code: '113123',
      name: 'ABCD',
      value: 100000,
      dateTimeRange: '17/05/2023 - 18/05/2024',
      status: 'ACTIVE',
    },
    {
      id: 3,
      code: '1231234',
      name: 'ABCC',
      value: 400000,
      dateTimeRange: '17/05/2023 - 18/05/2024',
      status: 'ACTIVE',
    },
    {
      id: 4,
      code: '1231235',
      name: 'ABCK',
      value: 300000,
      dateTimeRange: '17/05/2023 - 18/05/2024',
      status: 'UNACTIVE',
    },
    {
      id: 5,
      code: '1231239',
      name: 'ABCL',
      value: 200000,
      dateTimeRange: '17/05/2023 - 18/05/2024',
      status: 'EXPIRED',
    },
    {
      id: 6,
      code: '1231231',
      name: 'ABCQ',
      value: 600000,
      dateTimeRange: '17/05/2023 - 18/05/2024',
      status: 'ACTIVE',
    },
  ]);

  const [filterSearch, setFilterSearch] = useState('');

  const [filterDiscountValue, setFilterDiscountValue] = useState('');

  const [filterQuantity, setFilterQuantity] = useState('');

  const [filterTypeDiscount, setFilterTypeDiscount] = useState('');

  const [filterType, setFilterType] = useState(All.VI);

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const handleFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch);
  };

  const handleFilterType = (event) => {
    setFilterType(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.discount.voucher.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  return (
    <Page title="Quản lý đợt giảm giá - Danh sách đợt giảm giá">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đợt giảm giá"
          links={[
            { name: 'Quản lý đợt giảm giá', href: PATH_DASHBOARD.discount.voucher.list },
            { name: 'Danh sách đợt giảm giá' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.invoice.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tạo đợt giảm giá
            </Button>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            TabIndicatorProps={{
              sx: { height: 2.5 },
            }}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {tabs.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div>
                    <Label
                      variant={filterStatus === tab.value ? 'filled' : 'ghost'}
                      sx={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      color={tab.color}
                    >
                      {tab.count}
                    </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <PromotionTableToolbar
            filterDiscountValue={filterDiscountValue}
            filterQuantity={filterQuantity}
            filterTypeDiscount={filterTypeDiscount}
            filterSearch={filterSearch}
            filterType={filterType}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterSearch={handleFilterSearch}
            onFilterType={handleFilterType}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            optionsType={TYPE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Delete">
                        <IconButton color="primary">
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.map((row) => (
                    <PromotionTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}
                  {/*
                  <TableNoData isNotFound={isNotFound} />
                  */}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  return tableData;
}

// ----------------------------------------------------------------------

// const dataFiltered = applySortFilter({
//   tableData,
//   comparator: getComparator(order, orderBy),
//   filterSearch,
//   filterStatus,
//   filterStartDate,
//   filterEndDate,
//   filterDiscountValue,
//   filterQuantity,
//   filterType,
//   filterTypeDiscount,
// });

// ----------------------------------------------------------------------

// function useDebounce(cb, delay) {
//   const [debounceValue, setDebounceValue] = useState(cb);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebounceValue(cb);
//     }, delay);
//
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [cb, delay]);
//   return debounceValue;
// }
//
// const debounceValue = useDebounce(filterSearch, 300);
//
// useEffect(() => {
//   const dataFiltered = applySortFilter({
//     tableData,
//     comparator: getComparator(order, orderBy),
//     filterSearch,
//   });
//   setTableFiltered(dataFiltered);
// }, [debounceValue]);
//
// const handleFilterType = (event) => {
//   setFilterType(event.target.value);
// };
