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
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ADMIN_API } from '../../../../api/apiConfig';
import useFetch from '../../../../hooks/useFetch';
import { All, BillStatusTab, BillTypeOption } from '../../../../constants/enum';
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
import BillTableRow from './BillTableRow';
import BillTableToolBar from './BillTableToolBar';
import BillTagFiltered from './BillTagFiltered';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Mã đơn hàng', align: 'left' },
  { id: 'fullName', label: 'Khách hàng', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'left' },
  { id: 'totalMoney', label: 'Tổng tiền', align: 'left' },
  { id: 'status', label: 'Trạng thái thanh toán', align: 'left' },
  { id: 'totalPayment', label: 'Trạng thái xử lý', align: 'left' }, // ? them status payment
  { id: 'action', label: '', align: 'left' },
];

// ----------------------------------------------------------------------

export default function BillList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    order,
    orderBy,
    rowsPerPage,
    page,
    onChangePage,
    onSelectRow,
    onSort,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: "code" });

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: BillStatusTab.en.PENDING_CONFIRM, label: BillStatusTab.vi.PENDING_CONFIRM, color: 'warning', count: 0 },
      { value: BillStatusTab.en.WAITTING_DELIVERY, label: BillStatusTab.vi.WAITTING_DELIVERY, color: 'default', count: 0 },
      { value: BillStatusTab.en.DELIVERING, label: BillStatusTab.vi.DELIVERING, color: 'primary', count: 0 },
      { value: BillStatusTab.en.COMPLETED, label: BillStatusTab.vi.COMPLETED, color: 'success', count: 0 },
      { value: BillStatusTab.en.CANCELED, label: BillStatusTab.vi.CANCELED, color: 'error', count: 0 },
    ]
  );

  const [filterSearch, setFilterSearch] = useState('');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const isDefault =
    filterStartDate === null &&
    filterEndDate === null &&
    filterStatus === All.EN;

  const handleFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.bill.details(id));
  };

  const { data, totalPages, setParams, firstFetch, statusCounts } = useFetch(ADMIN_API.bill.all);

  const handleFilter = () => {
    const params = {
      currentPage: page,
      pageSize: rowsPerPage,
      search: filterSearch || null,
      status: filterStatus !== All.EN ? filterStatus : null,
      startDate: filterStartDate ? dayjs(filterStartDate).format('DD-MM-YYYY') : null,
      endDate: filterEndDate ? dayjs(filterEndDate).format('DD-MM-YYYY') : null,
    }
    setParams(params);
  }

  useEffect(() => {
    console.log(firstFetch)
    if (firstFetch) {
      handleFilter();
    }
  }, [page, rowsPerPage, filterSearch, filterStatus, filterStartDate, filterEndDate]);

  useEffect(() => {
    if (statusCounts) {

      const updatedTabs = tabs.map(tab => {
        let count = 0;
        if (tab.value === All.EN) {
          count = statusCounts.reduce((acc, curr) => acc + curr.count, 0);
        } else {
          const statusCount = statusCounts.find(item => item.status === tab.value);
          count = statusCount ? statusCount.count : 0;
        }

        return {
          ...tab,
          count,
        };
      });

      setTabs(updatedTabs);
    }
  }, [statusCounts]);

  const dataFiltered = applySortFilter({
    data,
    comparator: getComparator(order, orderBy),
  });

  return (
    <Page title="Quản lý đơn hàng - Danh sách đơn hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đơn hàng"
          links={[
            { name: 'Quản lý đơn hàng', href: PATH_DASHBOARD.bill.list },
            { name: 'Danh sách đơn hàng' },
          ]}
        />

        <Card className='card-round-1'>
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

          <BillTableToolBar
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterSearch={handleFilterSearch}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />

          {!isDefault &&
            <Stack sx={{ mb: 3, px: 2 }}>
              <>
                <BillTagFiltered
                  isShowReset={isDefault}
                  status={filterStatus}
                  startDate={filterStartDate ? dayjs(filterStartDate).format('DD-MM-YYYY') : null}
                  endDate={filterEndDate ? dayjs(filterEndDate).format('DD-MM-YYYY') : null}
                  onRemoveStatus={() => onFilterStatus(null, All.EN)}
                  onRemoveDate={() => {
                    setFilterEndDate(null);
                    setFilterStartDate(null);
                  }}
                  onResetAll={() => {
                    onFilterStatus(null, All.EN)
                    setFilterEndDate(null);
                    setFilterStartDate(null);
                  }}
                />
              </>
            </Stack>
          }
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered.map((row) => (
                    <BillTableRow
                      key={row.id}
                      row={row}
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
              rowsPerPageOptions={[10, 15, 25]}
              component="div"
              rowsPerPage={rowsPerPage}
              page={0}
              onPageChange={onChangePage}
              count={0}
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
              page={page}
              count={totalPages}
              onChange={onChangePage}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  data,
  comparator,
}) {
  const stabilizedThis = data.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  data = stabilizedThis.map((el) => el[0]);

  return data;
}

// ----------------------------------------------------------------------

