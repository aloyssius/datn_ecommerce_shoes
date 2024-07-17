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
import { ADMIN_API } from '../../../../../api/apiConfig';
import useFetch from '../../../../../hooks/useFetch';
import { All, AttributeStatus } from '../../../../../constants/enum';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// hooks
import useNotification from '../../../../../hooks/useNotification';
import useTabs from '../../../../../hooks/useTabs';
import useSettings from '../../../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../../../hooks/useTable';
import useConfirm from '../../../../../hooks/useConfirm'
// _mock_
import { _vouchers } from '../../../../../_mock';
// components
import Page from '../../../../../components/Page';
import Label from '../../../../../components/Label';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../../components/table';
// sections
import ColorTableRow from './ColorTableRow';
import ColorTableToolbar from './ColorTableToolBar';
import ColorTagFiltered from './ColorTagFiltered';
import ColorNewEditFormDialog from '../new-edit/ColorNewEditFormDialog';
// utils

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Mã màu sắc', align: 'left' },
  { id: 'name', label: 'Tên màu sắc', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'action', label: '', align: 'left' },
];

// ----------------------------------------------------------------------

export default function ColorList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { onOpenSuccessNotify } = useNotification();

  const {
    order,
    orderBy,
    rowsPerPage,
    onSort,
    page,
    setPage,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({});

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: AttributeStatus.en.IS_ACTIVE, label: AttributeStatus.vi.IS_ACTIVE, color: 'success', count: 0 },
      { value: AttributeStatus.en.UN_ACTIVE, label: AttributeStatus.vi.UN_ACTIVE, color: 'error', count: 0 },
    ]
  );

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);

  const [filterSearch, setFilterSearch] = useState('');

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const { showConfirm } = useConfirm();

  const handleFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch);
    setPage(1);
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
    setCurrentColor(null);
  };

  const handleOpenEditRow = (row) => {
    setOpen(true);
    setIsEdit(true);
    setCurrentColor(row);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setIsEdit(false);
    }, 100);
    setCurrentColor(null);
  };

  const isDefault =
    filterStatus === All.EN;

  const {
    data,
    totalPages,
    setParams,
    firstFetch,
    statusCounts,
    setStatusCounts,
    put,
    post,
    remove,
    setData,
    setTotalPages,
  } = useFetch(ADMIN_API.color.all);

  const onFinish = (data, type, id) => {
    if (type === "create") {
      onOpenSuccessNotify('Thêm mới màu sắc thành công!')
      setStatusCounts(data?.statusCounts);
      setData(data?.colors);
      setTotalPages(data?.totalPages);
      setOpen(false);
    }

    if (type === "update") {
      onOpenSuccessNotify('Cập nhật màu sắc thành công!')
      setData(data?.colors);
      setTotalPages(data?.totalPages);
      setCurrentColor(data?.colors.find((item) => item.id === id));
      setOpen(false);
    }

    if (type === "delete") {
      onOpenSuccessNotify('Xóa màu sắc thành công!')
      setData(data?.colors);
      setTotalPages(data?.totalPages);
      setStatusCounts(data?.statusCounts);
    }

  }

  const handleDeleteColor = (id) => {
    const body = {
      id,
      currentPage: page,
      pageSize: rowsPerPage,
      search: filterSearch || null,
      filterStatus: filterStatus !== All.EN ? filterStatus : null,
    };
    showConfirm("Xác nhận xóa màu sắc?", () => remove(ADMIN_API.color.delete, body, (res) => onFinish(res, "delete")));

  }

  const handleSaveColor = (data, type) => {

    if (type === 'create') {
      const body = {
        ...data,
        status: AttributeStatus.en.IS_ACTIVE,
        currentPage: page,
        pageSize: rowsPerPage,
        search: filterSearch || null,
        filterStatus: filterStatus !== All.EN ? filterStatus : null,
      }
      showConfirm("Xác nhận thêm mới màu sắc?", () => post(ADMIN_API.color.post, body, (res) => onFinish(res, type)));
    }

    if (type === 'update') {
      const body = {
        ...data,
        currentPage: page,
        pageSize: rowsPerPage,
        search: filterSearch || null,
        filterStatus: filterStatus !== All.EN ? filterStatus : null,
      }
      showConfirm("Xác nhận cập nhật màu sắc?", () => put(ADMIN_API.color.put, body, (res) => onFinish(res, type, body.id)));
    }
  }

  const onFinishUpdateStatus = (data) => {
    onOpenSuccessNotify('Cập nhật trạng thái thành công!')
    setStatusCounts(data?.statusCounts);
    setData(data?.colors);
    setTotalPages(data?.totalPages);
  }

  const handleUpdateStatus = (data) => {
    const body = {
      ...data,
      currentPage: page,
      pageSize: rowsPerPage,
      search: filterSearch || null,
      filterStatus: filterStatus !== All.EN ? filterStatus : null,
    }
    put(ADMIN_API.color.putStatus, body, (res) => onFinishUpdateStatus(res));
  }

  const handleFilter = () => {
    const params = {
      currentPage: page,
      pageSize: rowsPerPage,
      search: filterSearch || null,
      status: filterStatus !== All.EN ? filterStatus : null,
    };
    setParams(params);
  }

  useEffect(() => {
    if (firstFetch) {
      handleFilter();
    }
  }, [page, rowsPerPage, filterSearch, filterStatus]);

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
    <>
      <Page title="Quản lý màu sắc - Danh sách màu sắc">
        <Container >
          <HeaderBreadcrumbs
            heading="Danh sách màu sắc"
            links={[
              { name: 'Quản lý màu sắc', href: PATH_DASHBOARD.attribute.color.list },
              { name: 'Danh sách màu sắc' },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon={'eva:plus-fill'} />}
                onClick={handleOpen}
              >
                Tạo màu sắc
              </Button>
            }
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

            <ColorTableToolbar
              filterSearch={filterSearch}
              onFilterSearch={handleFilterSearch}
            />

            {!isDefault &&
              <Stack sx={{ mb: 3, px: 2 }}>
                <>
                  <ColorTagFiltered
                    isShowReset={isDefault}
                    status={filterStatus}
                    onRemoveStatus={() => onFilterStatus(null, All.EN)}
                    onResetAll={() => {
                      onFilterStatus(null, All.EN)
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
                      <ColorTableRow
                        key={row.id}
                        row={row}
                        onUpdateRow={handleUpdateStatus}
                        onOpenEditRow={() => handleOpenEditRow(row)}
                        onRemoveRow={() => handleDeleteColor(row.id)}
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
      <ColorNewEditFormDialog
        open={open}
        onClose={handleClose}
        onSave={handleSaveColor}
        currentColor={currentColor}
        isEdit={isEdit}
      />
    </>
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
