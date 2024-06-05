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
  TablePagination,
  Pagination,
  Typography,
} from '@mui/material';
import { All, VoucherTypeOption, DiscountStatusTab } from '../../../../constants/enum';
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
import VoucherTableToolbar from './VoucherTableToolBar';
import VoucherTableRow from './VoucherTableRow';
import VoucherTagFiltered from './VoucherTagFiltered';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
  All.EN,
  VoucherTypeOption.en.PUBLIC,
  VoucherTypeOption.en.PRIVATE,
];

const TABLE_HEAD = [
  { id: 'code', label: 'Mã', align: 'left' },
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'type', label: 'Loại', align: 'left' },
  { id: 'value', label: 'Giá trị', align: 'left' },
  { id: 'quantity', label: 'Số lượng', align: 'left' },
  { id: 'dateTime', label: 'Thời gian', align: 'left' },
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
    rowsPerPage,
    onChangeRowsPerPage,
  } = useTable({});

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: DiscountStatusTab.en.UP_COMMING, label: DiscountStatusTab.vi.UP_COMMING, color: 'warning', count: 0 },
      { value: DiscountStatusTab.en.ON_GOING, label: DiscountStatusTab.vi.ON_GOING, color: 'success', count: 0 },
      { value: DiscountStatusTab.en.FINISHED, label: DiscountStatusTab.vi.FINISHED, color: 'error', count: 0 },
    ]
  );

  const [tableData, setTableData] = useState([
    {
      id: 1,
      code: '123123',
      name: 'ABC',
      type: 'Công khai',
      value: 500000,
      quantity: 500,
      dateTime: '17/05/2023 - 18/05/2024',
      status: 'on_going',
    },
    {
      id: 2,
      code: '113123',
      name: 'ABCD',
      type: 'Cá nhân',
      value: 100000,
      quantity: 200,
      dateTime: '17/05/2023 - 18/05/2024',
      status: 'up_comming',
    },
    {
      id: 3,
      code: '1231234',
      name: 'ABCC',
      type: 'Công khai',
      value: 400000,
      quantity: 400,
      dateTime: '17/05/2023 - 18/05/2024',
      status: 'finished',
    },
    {
      id: 4,
      code: '1231235',
      name: 'ABCK',
      type: 'Công khai',
      value: 300000,
      quantity: 300,
      dateTime: '17/05/2023 - 18/05/2024',
      status: 'UNACTIVE',
    },
    {
      id: 5,
      code: '1231239',
      name: 'ABCL',
      type: 'Cá nhân',
      value: 200000,
      quantity: 200,
      dateTime: '17/05/2023 - 18/05/2024',
      status: 'EXPIRED',
    },
    {
      id: 6,
      code: '1231231',
      name: 'ABCQ',
      type: 'Công khai',
      value: 600000,
      quantity: 600,
      dateTime: '17/05/2023 - 18/05/2024',
      status: 'ACTIVE',
    },
  ]);

  const [filterSearch, setFilterSearch] = useState('');

  const [filterType, setFilterType] = useState(All.EN);

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const [foundLengthData, setFoundLengthData] = useState(0);

  const isDefault =
    filterStartDate === null &&
    filterEndDate === null &&
    filterStatus === All.EN &&
    filterType === All.EN;

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
    <Page title="Quản lý mã giảm giá - Danh sách mã giảm giá">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách mã giảm giá"
          links={[
            { name: 'Quản lý mã giảm giá', href: PATH_DASHBOARD.discount.voucher.list },
            { name: 'Danh sách mã giảm giá' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.invoice.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tạo mã giảm giá
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
            {tabs.map((tab, index) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div>
                    <Label
                      variant={filterStatus === tab.value || index === 0 ? 'filled' : 'ghost'}
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

          <VoucherTableToolbar
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

          {!isDefault &&
            <Stack sx={{ mb: 3, px: 2 }}>
              <>
                <Typography sx={{ px: 1 }} variant="body2" gutterBottom>
                  <strong>{foundLengthData}</strong>
                  &nbsp; Mã giảm giá được tìm thấy
                </Typography>
                <VoucherTagFiltered
                  isShowReset={isDefault}
                  status={filterStatus}
                  type={filterType}
                  startDate={filterStartDate}
                  endDate={filterEndDate}
                  onRemoveStatus={() => onFilterStatus(null, All.EN)}
                  onRemoveType={() => setFilterType(All.EN)}
                  onRemoveDate={() => {
                    setFilterEndDate(null);
                    setFilterStartDate(null);
                  }}
                  onResetAll={() => {
                    onFilterStatus(null, All.EN)
                    setFilterType(All.EN)
                    setFilterEndDate(null);
                    setFilterStartDate(null);
                  }}
                />
              </>
            </Stack>
          }

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
                    <VoucherTableRow
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

          <Divider />

          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onChangeRowsPerPage}
              ActionsComponent={() => null}
              labelDisplayedRows={() => ''}
              labelRowsPerPage='Số hàng mỗi trang:'
              sx={{
                borderTop: 'none',
              }}
            />

            <Pagination
              sx={{ px: 1 }}
              count={10}
            />
          </Box>
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
