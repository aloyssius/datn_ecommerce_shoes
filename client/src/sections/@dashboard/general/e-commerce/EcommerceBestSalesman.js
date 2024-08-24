// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// _mock_
import { _ecommerceBestSalesman } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

export default function EcommerceBestSalesman({ type = "product_hot", products }) {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title={type === "product_hot" ? "Top sản phẩm bán chạy" : "Danh sách sản phẩm sắp hết hàng"} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="center">Số lượng đã bán</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((row) => (
                <TableRow key={row.code}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image alt="product image" src={row?.pathUrl} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
                      <Box>
                        <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                          {`${row?.name} (${row?.code})`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>{row?.totalSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

//           <TableBody>
//             {products.map((product) => {
//               const { billDetailId, name, sizeName, price, colorName, pathUrl, quantity } = product;
//               return (
//                 <TableRow key={billDetailId}>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Image alt="product image" src={pathUrl} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
//                       <Box>
//                         <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
//                           {`${name} ${colorName}`}
//                         </Typography>
//
//                         <Box
//                           sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <Typography variant="body2">
//                             <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//                               Kích cỡ:&nbsp;
//                             </Typography>
//                             {sizeName}
//                           </Typography>
//                           {/*
//                           <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
//                           <Typography variant="body2">
//                             <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//                               Màu sắc:&nbsp;
//                             </Typography>
//                             {getColorName(color)}
//                           </Typography>
//                           */}
//                         </Box >
//                       </Box >
//                     </Box >
//                   </TableCell >
//
//                   <TableCell align="center">{formatCurrency(String(price))}</TableCell>
//
//                   <TableCell align="center">
//                     <Incrementer
//                       quantity={quantity}
//                     />
//                   </TableCell>
//
//                   <TableCell align="center">{formatCurrency(String(price * quantity))}</TableCell>
//
// {/* (status === BillStatusTab.en.PENDING_CONFIRM || status === BillStatusTab.en.WAITTING_DELIVERY) && !isOrderTransferNotYetPayment() &&
//                     <TableCell align="right">
//                       <Stack spacing={0.1} direction="row">
//                         <Tooltip title="Cập nhật">
//                           <IconButton onClick={() => handleOpen(product)} color="primary">
//                             <Iconify icon={'eva:edit-2-outline'} width={20} height={20} />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Xóa">
//                           <IconButton onClick={() => onDelete(billDetailId)} color="error">
//                             <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     </TableCell>
//                   */}
//                 </TableRow >
//               );
//             })}
//           </TableBody >
