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
      <CardHeader title={type === "product_hot" ? "Top 5 sản phẩm bán chạy" : "Danh sách sản phẩm sắp hết hàng"} sx={{ mb: 3 }} />
      {products?.length <= 0 ?
        <Typography variant='h5' sx={{ p: 5, textAlign: 'center' }}>
          Chưa có dữ liệu
        </Typography> :
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
                            {`${row?.name} ${row?.colorName} (${row?.code})`}
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
      }
    </Card>
  );
}
