import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Box,
  Stack,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { TableHeadCustom, TableSelectedActions } from '../../../../components/table';
import Scrollbar from '../../../../components/Scrollbar';
import useTable, { getComparator } from '../../../../hooks/useTable';
// components
import Iconify from '../../../../components/Iconify';
import ProductVariantTableRow from './ProductVariantTableRow';
import ProductVariantTableFooter from './ProductVariantTableFooter';

// ----------------------------------------------------------------------

ProductVariantTableContainer.propTypes = {
  variant: PropTypes.object,
  onRemoveSize: PropTypes.func,
  onRemoveSizes: PropTypes.func,
  onUpdateSize: PropTypes.func,
};

export default function ProductVariantTableContainer({ variant, isSubmitted, onRemoveSize, onRemoveSizes, onUpdateSize, onUpdateImageDefault, isEdit }) {
  const {
    order,
    orderBy,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    rowsPerPage,
    page,
    onChangePage,
  } = useTable({ defaultCurrentPage: 0, defaultRowsPerPage: 5, defaultOrderBy: 'sizeName', defaultOrder: 'asc' });

  const data = variant?.variantItems || [];

  const dataFiltered = applySortFilter({
    data,
    comparator: getComparator(order, orderBy),
  });

  const [isRemove, setIsRemove] = useState(false);

  const handleRemoveSizes = (colorId) => {
    onRemoveSizes(colorId, selected);
    setIsRemove(true);
  }

  const handleRemoveSize = (colorId, sizeId) => {
    onRemoveSize(colorId, sizeId);
    setIsRemove(true);
  }

  const handleUpdatePrice = (colorId, price) => {
    onUpdateSize('price', colorId, null, price);
  }

  const handleUpdateImages = useCallback((colorId, images) => {
    onUpdateSize('images', colorId, null, images);
  }, []);

  useEffect(() => {
    if (selected.length > 0 && isRemove) {
      const updatedSelected = selected.filter((id) => {
        return variant.variantItems.some((size) => size.sizeId === id);
      });
      setSelected(updatedSelected);
      setIsRemove(false);
    }
  }, [variant.variantItems, isRemove]);

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ position: 'relative' }}>
          <Table className="table-product">
            {selected.length > 0 && (
              <TableSelectedActions
                checkBoxAllSmall
                numSelected={selected.length}
                rowCount={data.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    data.map((row) => row.sizeId)
                  )
                }
                actions={
                  <Stack spacing={1} direction="row">
                    {/*
                    <Tooltip title="Cập nhật số lượng" placement='left'>
                      <IconButton color="primary">
                        <Iconify icon={'eva:edit-2-outline'} />
                      </IconButton>
                    </Tooltip>
                    */}
                    {!isEdit &&
                      <Tooltip title="Xóa kích cỡ" placement='right'>
                        <IconButton color="error" onClick={() => handleRemoveSizes(variant.colorId)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    }
                  </Stack>
                }
              />
            )}
            <TableHeadCustom
              checkBoxAllSmall
              order={order}
              orderBy={orderBy}
              onSort={onSort}
              headLabel={!isEdit ? TABLE_HEAD : TABLE_HEAD_EDIT}
              rowCount={data.length}
              numSelected={selected.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  data.map((row) => row.sizeId)
                )
              }
            />
            <TableBody>
              {dataFiltered?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <ProductVariantTableRow
                  key={row.sizeId}
                  isEdit={isEdit}
                  row={row}
                  selected={selected.includes(row.sizeId)}
                  onSelectRow={() => onSelectRow(row.sizeId)}
                  onEditRow={onUpdateSize}
                  onDeleteRow={() => handleRemoveSize(row.colorId, row.sizeId)}
                />
              ))}
            </TableBody>
            <ProductVariantTableFooter variant={variant} isSubmitted={isSubmitted} onUpdatePrice={handleUpdatePrice} onUpdateImages={handleUpdateImages} onUpdateImageDefault={onUpdateImageDefault} isEdit={isEdit} />
          </Table>
        </TableContainer>
      </Scrollbar>
      <Box sx={{ position: 'relative' }}>
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
        />
      </Box>
    </>
  );
};

const TABLE_HEAD = [
  { id: 'sizeName', label: 'Kích cỡ', align: 'left' },
  { id: 'quantity', label: 'Số lượng tồn', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'action', label: '', align: 'left' },
];

const TABLE_HEAD_EDIT = [
  { id: 'sizeName', label: 'Kích cỡ', align: 'left' },
  { id: 'quantity', label: 'Số lượng tồn', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
];

function applySortFilter({
  data,
  comparator,
}) {
  if (!data) {
    return [];
  }

  const stabilizedThis = data.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  data = stabilizedThis.map((el) => el[0]);

  return data;
}
