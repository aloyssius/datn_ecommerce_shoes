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
import { All, ProductStatusTab, ProductStockOption } from '../../../../constants/enum';
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
import ProductTableRow from './ProductTableRow';
import ProductTableToolbar from './ProductTableToolBar';
import ProductTagFiltered from './ProductTagFiltered';
import { convertedtArr } from '../../../../utils/convertArray';

// ----------------------------------------------------------------------

const STOCK_OPTIONS = [
  ProductStockOption.IN_STOCK,
  ProductStockOption.LOW_STOCK,
  ProductStockOption.OUT_OF_STOCK,
]

const TABLE_HEAD = [
  { id: 'sku', label: 'Mã SKU', align: 'left'},
  { id: 'name', label: 'Sản phẩm', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'left' },
  { id: 'totalQuantity', label: 'Số lượng tồn', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'action', label: '', align: 'left' },
];

// ----------------------------------------------------------------------

export default function ProductList() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    page,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({});

  const [tabs, setTabs] = useState(
    [
      { value: All.EN, label: All.VI, color: 'info', count: 0 },
      { value: ProductStatusTab.en.IS_ACTIVE, label: ProductStatusTab.vi.IS_ACTIVE, color: 'success', count: 0 },
      { value: ProductStatusTab.en.UN_ACTIVE, label: ProductStatusTab.vi.UN_ACTIVE, color: 'error', count: 0 },
    ]
  );

  const [filterSearch, setFilterSearch] = useState('');

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(All.EN);

  const [stockSelecteds, setStockSelecteds] = useState([]);

  const [brandSelecteds, setBrandSelecteds] = useState([]);

  const [categorySelecteds, setCategorySelecteds] = useState([]);

  const handleFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch);
  };

  const handleFilterStock = (event) => {
    setStockSelecteds(event.target.value);
  };

  const handleFilterBrand = (event) => {
    setBrandSelecteds(event.target.value);
  };

  const handleFilterCategory = (event) => {
    setCategorySelecteds(event.target.value);
  };

  const handleRemoveStock = (value) => {
    const newValue = stockSelecteds.filter((item) => item !== value);
    setStockSelecteds(newValue);
  };

  const handleRemoveBrand = (value) => {
    const newValue = brandSelecteds.filter((item) => item !== value);
    setBrandSelecteds(newValue);
  };

  const handleRemoveCategory = (value) => {
    const newValue = categorySelecteds.filter((item) => item !== value);
    setCategorySelecteds(newValue);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.discount.voucher.edit(id));
  };

  const isDefault =
    categorySelecteds.length === 0 &&
    stockSelecteds.length === 0 &&
    brandSelecteds.length === 0 &&
    filterStatus === All.EN;

  const { data, totalElements, totalPages, setParams, fetchCount, statusCounts, otherData, loading } = useFetch(ADMIN_API.product.all);

  const convertedStockSelected = (stocks) => {
    const converted = stocks.map(item => {
      if (item === ProductStockOption.OUT_OF_STOCK) {
        return '<=0';
      } if (item === ProductStockOption.LOW_STOCK) {
        return '<=10';
      } if (item === ProductStockOption.IN_STOCK) {
        return '>10';
      }
      return "";
    });

    return converted;
  };

  const handleFilter = () => {
    const params = {
      currentPage: page,
      pageSize: rowsPerPage,
      search: filterSearch || null,
      status: filterStatus !== All.EN ? filterStatus : null,
      brandIds: brandSelecteds.length === 0 ? null : convertedtArr(brandSelecteds),
      categoryIds: categorySelecteds.length === 0 ? null : convertedtArr(categorySelecteds),
      quantityConditions: stockSelecteds.length === 0 ? null : convertedtArr(convertedStockSelected(stockSelecteds)),
    };
    setParams(params);
  }

  useEffect(() => {
    if (fetchCount > 0) {
      handleFilter();
    }
  }, [page, rowsPerPage, filterSearch, filterStatus, categorySelecteds, brandSelecteds, stockSelecteds]);

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
    <Page title="Quản lý sản phẩm - Danh sách sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[
            { name: 'Quản lý sản phẩm', href: PATH_DASHBOARD.product.list },
            { name: 'Danh sách sản phẩm' },
          ]}
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

          <ProductTableToolbar
            optionsStock={STOCK_OPTIONS}
            optionsCategory={otherData?.categories}
            optionsBrand={otherData?.brands}
            filterSearch={filterSearch}
            filterCategory={categorySelecteds}
            filterBrand={brandSelecteds}
            filterStock={stockSelecteds}
            onFilterSearch={handleFilterSearch}
            onFilterStock={handleFilterStock}
            onFilterBrand={handleFilterBrand}
            onFilterCategory={handleFilterCategory}
          />

          {!isDefault &&
            <Stack sx={{ mb: 3, px: 2 }}>
              <>
                <ProductTagFiltered
                  otherData={otherData}
                  isShowReset={isDefault}
                  status={filterStatus}
                  stocks={stockSelecteds}
                  brands={brandSelecteds}
                  categories={categorySelecteds}
                  onRemoveStatus={() => onFilterStatus(null, All.EN)}
                  onRemoveStock={handleRemoveStock}
                  onRemoveBrand={handleRemoveBrand}
                  onRemoveCategory={handleRemoveCategory}
                  onResetAll={() => {
                    onFilterStatus(null, All.EN)
                    setCategorySelecteds([]);
                    setBrandSelecteds([]);
                    setStockSelecteds([]);
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
                    <ProductTableRow
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
