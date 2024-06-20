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
import { All, AccountStatusTab, AccountGenderOption } from '../../../../constants/enum';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useTabs from '../../../../hooks/useTabs';
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
import CustomerTableToolBar from './CustomerTableToolBar';
import CustomerTableRow from './CustomerTableRow';
import CustomerTagFiltered from './CustomerTagFiltered';

// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
  All.VI,
  AccountGenderOption.vi.MEN,
  AccountGenderOption.vi.WOMEN,
];

const TABLE_HEAD = [
  { id: 'fullName', label: 'Khách hàng', align: 'left' },
  { id: 'code', label: 'Mã khách hàng', align: 'left' },
  { id: 'phoneNumber', label: 'Số điện thoại', align: 'left' },
  { id: 'birthDate', label: 'Ngày sinh', align: 'left' },
  { id: 'gender', label: 'Giới tính', align: 'left' },
  { id: 'status', label: 'Trạng Thái', align: 'left' },
  { id: 'action', label: '', align: 'left' },
];

export default function CustomerList() {
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
    page,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({});

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: AccountStatusTab.en.IS_ACTIVE, label: AccountStatusTab.vi.IS_ACTIVE, color: 'success', count: 0 },
      { value: AccountStatusTab.en.UN_ACTIVE, label: AccountStatusTab.vi.UN_ACTIVE, color: 'error', count: 0 },
    ]
  );



  const [filterSearch, setFilterSearch] = useState('');

  const [filterGender, setFilterGender] = useState(All.VI);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const [foundLengthData, setFoundLengthData] = useState(0);

  const isDefault =
    filterGender === All.VI &&
    filterStatus === All.EN;

  const handleFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch);
  };

  const handleFilterGender = (event) => {
    setFilterGender(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.account.customer.edit(id));
  };

  const { data, totalElements, totalPages, setParams, fetchCount, statusCounts, otherData } = useFetch(ADMIN_API.customer.all);

  const handleFilter = () => {

    let gender;
    if (filterGender === AccountGenderOption.vi.MEN) {
      gender = 0;
    } else if (filterGender === AccountGenderOption.vi.WOMEN) {
      gender = 1;
    } else {
      gender = null;
    }

    const params = {
      currentPage: page,
      pageSize: rowsPerPage,
      search: filterSearch || null,
      status: filterStatus !== All.EN ? filterStatus : null,
      gender,
    };
    setParams(params);
  }

  useEffect(() => {
    if (fetchCount > 0) {
      handleFilter();
    }
  }, [page, rowsPerPage, filterSearch, filterStatus, filterGender]);

  useEffect(() => {
    if (statusCounts) {

      const updatedTabs = tabs.map(tab => {
        let count = 0;
        if (tab.value === All.EN) {
          count = statusCounts.reduce((acc, curr) => acc + curr.count, 0);
        } else {
          const statusCount = statusCounts.find(item => item.status === tab.value);
          count = statusCount ? statusCount.count : tab.count;
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
    <Page title="Quản lý khách hàng - Danh sách khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách khách hàng"
          links={[
            { name: 'Quản lý khách hàng', href: PATH_DASHBOARD.account.customer.list },
            { name: 'Danh sách khách hàng' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.invoice.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tạo tài khoản
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

          <CustomerTableToolBar
            filterSearch={filterSearch}
            filterGender={filterGender}
            onFilterSearch={handleFilterSearch}
            onFilterGender={handleFilterGender}
            optionsGender={GENDER_OPTIONS}
          />

          {!isDefault &&
            <Stack sx={{ mb: 3, px: 2 }}>
              <>
                <CustomerTagFiltered
                  isShowReset={isDefault}
                  status={filterStatus}
                  gender={filterGender}
                  onRemoveStatus={() => onFilterStatus(null, All.EN)}
                  onRemoveGender={() => {
                    setFilterGender(All.VI);
                  }}
                  onResetAll={() => {
                    onFilterStatus(null, All.EN)
                    setFilterGender(All.VI);
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
                  rowCount={totalElements}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      data.map((row) => row.id)
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
                  rowCount={totalElements}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      data.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.map((row) => (
                    <CustomerTableRow
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
              rowsPerPageOptions={[10, 15, 25]}
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

