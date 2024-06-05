import { useState } from 'react';
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
import { All, CustomerTypeOptions, CustomerStatusTab } from '../../../../constants/enum';
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

// section

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
  All.VI,
  CustomerTypeOptions.vi.MEN,
  CustomerTypeOptions.vi.WOMEN,
];

const TABLE_HEAD = [
  { id: 'code', label: 'Mã khách hàng', align: 'left' },
  { id: 'name', label: 'Tên khách hàng', align: 'left' },
  { id: 'birth', label: 'Ngày sinh', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'gender', label: 'Giới tính', align: 'left' },
  { id: 'avatar', label: 'Ảnh', align: 'left' },
  { id: 'status', label: 'Trạng Thái', align: 'left' },
  { id: 'action', label: 'Thao tác', align: 'left' },
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
  } = useTable({ defaultOrderBy: 'value' });

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: CustomerStatusTab.en.ACTIVE, label: CustomerStatusTab.vi.ACTIVE, color: 'success', count: 0 },
      { value: CustomerStatusTab.en.UNACTIVE, label: CustomerStatusTab.vi.UNACTIVE, color: 'warning', count: 0 },
    ]
  );

  const [tableData, setTableData] = useState([
    {
      id: 1,
      code: 'PH22590',
      name: 'Hồ Khánh Đăng',
      birth: '11/11/2003',
      phone: '0978267385',
      email: 'danghkph22590@fpt.edu.vn',
      gender: 'Nam',
      avatar: 'none',
      status: 'ACTIVE',
    },
  ]);

  const [filterSearch, setFilterSearch] = useState('');

  const [filterType, setFilterType] = useState(All.VI);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const handleFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch);
  };

  const handleFilterType = (event) => {
    setFilterType(event.target.value);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.account.customer.list.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  return (
    <Page title="Quản lý khách hàng - Danh sách khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách tài khoản khách hàng"
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

          <CustomerTableToolBar
            filterSearch={filterSearch}
            filterType={filterType}
            onFilterSearch={handleFilterSearch}
            onFilterType={handleFilterType}
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

