import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

// import DatePicker from '@mui/lab/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Card, Chip, Checkbox, Grid, Button, Stack, Box, TextField, Typography, InputAdornment, MenuItem, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useConfirm from '../../../../hooks/useConfirm'
import useNotification from '../../../../hooks/useNotification';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFTextField,
  RHFEditor,
  RHFRadioGroup,
} from '../../../../components/hook-form';
import Label from '../../../../components/Label';
import { isNumber } from '../../../../utils/validate';
import { VoucherTypeDiscount } from '../../../../constants/enum';
import { convertVoucherTypeDiscount, convertToEnumVoucherTypeDiscount } from '../../../../utils/ConvertEnum';
import { convertDateTimeParam, convertDateTimePicker } from '../../../../utils/convertDate';
import { formatCurrencyVnd, formatNumber } from '../../../../utils/formatCurrency';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

VoucherNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentVoucher: PropTypes.object,
};
export default function VoucherNewEditForm({ isEdit, currentVoucher, onUpdateData }) {


  const navigate = useNavigate();


  const { enqueueSnackbar } = useSnackbar();

  const NewVoucherSchema = Yup.object().shape({
    code: Yup.string()
      .required('Mã giảm giá không được để trống')
      .max(15, 'Mã giảm giá không được dài hơn 15 ký tự'),
    value: Yup.string()
      .required('Giá trị không được để trống'),
    //   .max(999999999, 'Giá trị không được nhập quá 999,999,999'),
    minOrderValue: Yup.string()
      .required('Mã giảm giá không được để trống'),

    // maxDiscountValue: Yup.string()
    //   .required('Mã giảm giá không được để trống'),
    //   .transform((value, originalValue) => {
    //     return originalValue === '' ? null : value;
    //   })
    //   .nullable()
    //   .test(
    //     'maxDigits',
    //     'Giá trị không được nhập quá 999,999,999',
    //     value => value === null || (value.toString().length <= 9 && value <= 999999999)
    //   ),
    startTime: Yup.date()
      .nullable()
      .required('Thời gian bắt đầu không được để trống')
      .test('is-future-date', 'Thời gian bắt đầu phải lớn hơn hoặc bằng ngày hiện tại', (value) => {
        return value && value >= new Date().setHours(0, 0, 0, 0); // So sánh với ngày hiện tại, không tính giờ phút
      }),
    endTime: Yup.date()
      .nullable()
      .required('Thời gian kết thúc không được để trống')
      .test('is-after-startTime', 'Thời gian kết thúc phải sau thời gian bắt đầu', (value, context) => {
        const { startTime } = context.parent;
        return value && startTime && value > startTime;
      })
  });

  const defaultValues = useMemo(
    () => ({
      code: currentVoucher?.code || '',
      name: currentVoucher?.name || '',
      status: currentVoucher?.status || '',
      typeDiscount: convertToEnumVoucherTypeDiscount(currentVoucher?.typeDiscount),
      value: currentVoucher?.value || '',
      minOrderValue: currentVoucher?.minOrderValue || '',
      maxDiscountValue: currentVoucher?.maxDiscountValue || '',
      startTime: convertDateTimePicker(currentVoucher?.startTime),
      endTime: convertDateTimePicker(currentVoucher?.endTime),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentVoucher]
  );

  const methods = useForm({
    resolver: yupResolver(NewVoucherSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // const onSubmit = async () => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     reset();
  //     enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
  //     navigate(PATH_DASHBOARD.eCommerce.list);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  useEffect(() => {
    if (isEdit && currentVoucher) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentVoucher]);

  const { post, put, putEndVoucher, putRestoreVoucher } = useFetch(null, { fetch: false });

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification()

  const onFinish = (data) => {
    // Kiểm tra xem có phải là chế độ chỉnh sửa hay không
    if (!isEdit) {
      // Thêm mới voucher
      onOpenSuccessNotify('Thêm mới voucher thành công!');
      navigate(PATH_DASHBOARD.discount.voucher.edit(data?.id));
    } else {
      // Cập nhật voucher
      onOpenSuccessNotify('Cập nhật voucher thành công!');
      onUpdateData(data); // Cập nhật dữ liệu voucher
    }
  };

  const onSubmit = async (data) => {
    if (!isEdit) {
      // Thêm mới voucher
      const body = {
        ...data,
        typeDiscount: convertVoucherTypeDiscount(data?.typeDiscount),
        startTime: convertDateTimeParam(data.startTime),
        endTime: convertDateTimeParam(data.endTime),
        value: parseInt(data.value, 10),
        maxDiscountValue: data.maxDiscountValue ? parseInt(data.maxDiscountValue, 10) : 0,
        minOrderValue: parseInt(data.minOrderValue, 10)
      };
      console.log(body);
      showConfirm("Xác nhận thêm mới voucher?", () => post(ADMIN_API.voucher.post, body, (response) => onFinish(response)));
    } else {
      // Cập nhật voucher
      const { status, ...filteredData } = data; // Loại bỏ trường status

      const body = {
        ...filteredData,
        typeDiscount: convertVoucherTypeDiscount(filteredData?.typeDiscount),
        startTime: convertDateTimeParam(filteredData.startTime),
        endTime: convertDateTimeParam(filteredData.endTime),
        value: parseInt(filteredData.value, 10),
        maxDiscountValue: filteredData.maxDiscountValue ? parseInt(filteredData.maxDiscountValue, 10) : 0,
        minOrderValue: parseInt(filteredData.minOrderValue, 10)
      };

      const id = currentVoucher?.id;
      console.log(body);
      showConfirm("Xác nhận cập nhật voucher?", () => put(`${ADMIN_API.voucher.put(id)}`, body, (response) => onFinish(response)));
    }
  };

  const endVoucher = (id) => {
    const body = { status: 'finished' };

    showConfirm("Xác nhận kết thúc voucher?", () => {
      putEndVoucher(ADMIN_API.voucher.endVoucher(id), body, (response) => {
        onOpenSuccessNotify('Voucher đã kết thúc', { variant: 'success' });
        navigate(PATH_DASHBOARD.discount.voucher.list);
        // console.log(response);
        // if (response.ok) {
        //   onOpenSuccessNotify('Voucher đã được kết thúc', { variant: 'success' });
        //   navigate(PATH_DASHBOARD.discount.voucher.list);
        // } else {
        //   response.json().then(errorData => {
        //     onOpenSuccessNotify(errorData.message || 'Có lỗi xảy ra khi kết thúc voucher', { variant: 'error' });
        //   });
        // }
      });
    });
  };

  const restoreVoucher = (id) => {
    showConfirm("Xác nhận khôi phục voucher?", () => {
      putRestoreVoucher(ADMIN_API.voucher.restoreVoucher(id), {}, (response) => {
        onOpenSuccessNotify('Voucher đã được khôi phục', { variant: 'success' });
        navigate(PATH_DASHBOARD.discount.voucher.list);
      });
    });
  };

  const handleTypeDiscountChange = (newTypeDiscount) => {
    // Đặt lại giá trị của cả hai trường
    setValue('value', '');
    setValue('maxDiscountValue', '');

    // Cập nhật loại giảm giá
    setValue('typeDiscount', newTypeDiscount);
  };

  const LabelStyleGray = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    marginBottom: theme.spacing(0.5),
    color: '#595959',
    fontWeight: 'normal',
  }));

  const LabelStyleHeader = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.black,
    fontSize: 16.5,
  }));


  const LabelStyleBlack = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.black,
  }));


  function VoucherForm() {
    const [code, setCode] = useState('');
    const [value, setValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
  }

  // const currentDateTime = dayjs();
  // const endTime = getValues('endTime');
  // const isEndTimeFuture = endTime ? dayjs(endTime).isAfter(currentDateTime) : false;
  // const isStatusFinished = getValues('status') === 'finished'; // Kiểm tra xem status có phải là 'finished'
  // const shouldShowRestoreButton = isEdit && isStatusFinished && isEndTimeFuture;

  const { id } = useParams();
  const { data } = useFetch(ADMIN_API.voucher.details(id));

  // 1. Lấy giá trị thời gian hiện tại
  const currentDateTime = dayjs();

  // 2. Lấy giá trị `endTime` từ data
  const endTime = data?.endTime;

  // 3. Kiểm tra xem `endTime` có lớn hơn thời gian hiện tại không
  // const isEndTimeFuture = endTime ? dayjs(endTime).isAfter(currentDateTime) : false;
  const isEndTimeFuture = endTime ? dayjs(endTime, "HH:mm:ss DD-MM-YYYY").isAfter(currentDateTime) : false;

  // 4. Kiểm tra `status` có phải là 'finished' không
  const isStatusFinished = getValues('status') === 'finished';

  // 5. Kiểm tra điều kiện để hiển thị nút "Khôi phục mã giảm giá"
  const shouldShowRestoreButton = isEdit && isStatusFinished && isEndTimeFuture;

  // 6. Kiểm tra điều kiện để hiển thị nút "Kết thúc mã giảm giá"
  const shouldShowEndVoucherButton = isEdit && !isStatusFinished;

  console.log(isEdit);


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Mã khuyến mãi</LabelStyleHeader>
              <RHFTextField name="code" topLabel="Mã khuyến mãi" placeholder="Nhập mã khuyến mãi" isRequired />

              <RHFTextField name="name" topLabel="Mô tả" placeholder="Nhập mô tả" multiline rows={3} />
            </Stack>
          </Card>

          <Card sx={{ p: 3, marginTop: 3 }}>
            <Stack spacing={3}>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Giá trị</LabelStyleHeader>

              <RHFRadioGroup
                name="typeDiscount"
                options={[
                  VoucherTypeDiscount.vi.VND,
                  VoucherTypeDiscount.vi.PERCENT
                ]}
                onChange={(event) => handleTypeDiscountChange(event.target.value)}
              />
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 3.5,
                  rowGap: 2.5,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: getValues('typeDiscount') === VoucherTypeDiscount.vi.PERCENT ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)' },
                }}
              >
                <RHFTextField
                  name="value"
                  topLabel="Giá trị"
                  placeholder={getValues('typeDiscount') === VoucherTypeDiscount.vi.PERCENT ? "0" : "0.00"}
                  value={getValues('value') === 0 ? '' : formatCurrencyVnd(String(getValues('value')))} // Định dạng giá trị với dấu phẩy
                  InputLabelProps={{ shrink: true }}
                  isRequired
                  onChange={(event) => {
                    const rawValue = event.target.value.replace(/,/g, ''); // Loại bỏ dấu phẩy
                    const value = parseFloat(rawValue); // Chuyển đổi thành số
                    const typeDiscount = getValues('typeDiscount');

                    if (typeDiscount === VoucherTypeDiscount.vi.PERCENT) {
                      if (!Number.isNaN(value)) {
                        // Giới hạn giá trị tối đa là 100 cho loại giảm giá PERCENT
                        const adjustedValue = value > 100 ? 100 : value;
                        setValue('value', adjustedValue.toString()); // Lưu giá trị điều chỉnh không có dấu phẩy
                      } else if (event.target.value === '') {
                        setValue('value', ''); // Xử lý trường hợp giá trị là rỗng
                      }
                    } else if (typeDiscount === VoucherTypeDiscount.vi.VND) {
                      if (!Number.isNaN(value)) {
                        setValue('value', rawValue); // Lưu giá trị không có dấu phẩy
                      } else if (event.target.value === '') {
                        setValue('value', ''); // Xử lý trường hợp giá trị là rỗng
                      }
                    }
                  }}
                  inputProps={{
                    max: getValues('typeDiscount') === VoucherTypeDiscount.vi.PERCENT ? 100 : undefined
                  }}
                />
                {getValues('typeDiscount') === VoucherTypeDiscount.vi.PERCENT && (
                  <RHFTextField
                    name="maxDiscountValue"
                    topLabel="Giảm tối đa"
                    placeholder="0.00"
                    value={getValues('maxDiscountValue') === 0 ? '' : formatCurrencyVnd(String(getValues('maxDiscountValue')))}
                    onChange={(event) => {
                      const rawValue = event.target.value.replace(/,/g, ''); // loại bỏ dấu phẩy
                      const formattedVnd = formatCurrencyVnd(rawValue); // định dạng lại với VND

                      setValue('maxDiscountValue', rawValue); // lưu giá trị không có dấu phẩy
                      // Nếu bạn muốn sử dụng formattedVnd cho một mục đích khác
                      console.log(formattedVnd); // Hoặc xử lý theo cách khác
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Box>
            </Stack>
          </Card>

          <Card sx={{ p: 3, marginTop: 3 }}>
            <Stack spacing={3}>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Điều kiện áp dụng</LabelStyleHeader>
              <RHFTextField
                name="minOrderValue"
                topLabel="Tổng số tiền đơn hàng tối thiểu"
                placeholder="0.00"
                value={getValues('minOrderValue') === 0 ? '' : formatCurrencyVnd(String(getValues('minOrderValue')))}
                onChange={(event) => {
                  const rawValue = event.target.value.replace(/,/g, ''); // loại bỏ dấu phẩy
                  const formattedVnd = formatCurrencyVnd(rawValue); // định dạng lại với VND

                  setValue('minOrderValue', rawValue); // lưu giá trị không có dấu phẩy
                  // Nếu bạn muốn sử dụng formattedVnd cho một mục đích khác
                  console.log(formattedVnd); // Hoặc xử lý theo cách khác
                }}
              />
            </Stack>
          </Card>

          <Card sx={{ p: 3, marginTop: 3 }}>

            <Stack spacing={3}>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Thời gian</LabelStyleHeader>
              <Box
                sx={{
                  p: 1,
                  mt: 1.5,
                  display: 'grid',
                  columnGap: 3.5,
                  rowGap: 2.5,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Controller
                  name='startTime'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Grid className="custom-grid">
                      <LabelStyle>
                        Thời gian bắt đầu
                      </LabelStyle>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            {...field}
                            slotProps={{
                              textField: {
                                placeholder: 'dd/mm/yyyy hh:mm',
                                size: "small",
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                              }
                            }}
                            sx={{
                              '& fieldset': {
                                borderRadius: '6px',
                              },
                              "& .Mui-error": {
                                marginLeft: 0,
                              },
                            }}
                            ampm
                            format="DD/MM/YYYY HH:mm"
                            disablePast
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                  )}
                />

                <Controller
                  name='endTime'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Grid className="custom-grid">
                      <LabelStyle>
                        Thời gian kết thúc
                      </LabelStyle>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            {...field}
                            slotProps={{
                              textField: {
                                placeholder: 'dd/mm/yyyy hh:mm',
                                size: "small",
                                fullWidth: true,
                                error: !!error,
                                helperText: error?.message,
                              }
                            }}
                            sx={{
                              '& fieldset': {
                                borderRadius: '6px',
                              },
                              "& .Mui-error": {
                                marginLeft: 0,
                              },
                            }}
                            ampm
                            format="DD/MM/YYYY HH:mm"
                            disablePast
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                  )}
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Tổng quan mã giảm giá</LabelStyleHeader>

              <Stack spacing={1} sx={{p: 1}}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <LabelStyleGray>Mã khuyến mãi</LabelStyleGray>
                    <LabelStyleBlack
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Đặt kích thước tối đa cho phần tử
                      }}
                    >
                      {getValues('code') || ''}
                    </LabelStyleBlack>
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <LabelStyleGray>Giá trị</LabelStyleGray>
                  <LabelStyleBlack
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px', // Đặt kích thước tối đa cho phần tử
                    }}
                  >
                    {(() => {
                      const value = getValues('value');
                      const typeDiscount = getValues('typeDiscount');
                      let displayValue = '';

                      if (value) {
                        if (typeDiscount === VoucherTypeDiscount.vi.PERCENT) {
                          displayValue = `${formatCurrencyVnd(String(value))}%`;
                        } else if (typeDiscount === VoucherTypeDiscount.vi.VND) {
                          displayValue = `${formatCurrencyVnd(String(value))} VNĐ`;
                        }
                      }

                      return displayValue;
                    })()}
                  </LabelStyleBlack>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <LabelStyleGray>Giá trị đơn hàng tối thiểu</LabelStyleGray>
                  <LabelStyleBlack
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px', // Đặt kích thước tối đa cho phần tử, bạn có thể điều chỉnh giá trị này
                    }}
                  >
                    {getValues('minOrderValue')
                      ? `${formatCurrencyVnd(String(getValues('minOrderValue')))} VNĐ`
                      : ''}
                  </LabelStyleBlack>
                </Stack>

                {getValues('typeDiscount') === VoucherTypeDiscount.vi.PERCENT && (
                  <Stack direction="row" justifyContent="space-between">
                    <LabelStyleGray>Giá trị giảm tối đa</LabelStyleGray>
                    <LabelStyleBlack
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Đặt kích thước tối đa cho phần tử, điều chỉnh giá trị này theo thiết kế của bạn
                      }}
                    >
                      {getValues('maxDiscountValue')
                        ? `${formatCurrencyVnd(String(getValues('maxDiscountValue')))} VNĐ`
                        : ''}
                    </LabelStyleBlack>
                  </Stack>
                )}

                <Stack direction="row" justifyContent="space-between">
                  <LabelStyleGray>Thời gian bắt đầu</LabelStyleGray>
                  <LabelStyleBlack>
                    {getValues('startTime') ? dayjs(getValues('startTime')).format('DD/MM/YYYY HH:mm') : ''}
                  </LabelStyleBlack>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <LabelStyleGray>Thời gian kết thúc</LabelStyleGray>
                  <LabelStyleBlack>
                    {getValues('endTime') ? dayjs(getValues('endTime')).format('DD/MM/YYYY HH:mm') : ''}
                  </LabelStyleBlack>
                </Stack>
              </Stack>
            </Card>

            <LoadingButton onClick={() => console.log(getValues('endTime'))} type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Tạo mã giảm giá' : 'Lưu thay đổi'}
            </LoadingButton>
            {shouldShowEndVoucherButton && (
              <LoadingButton
                type="button"
                variant="contained"
                color="error"
                onClick={() => endVoucher(currentVoucher?.id)}
              >
                Kết thúc mã giảm giá
              </LoadingButton>
            )}

            {shouldShowRestoreButton && (
              <LoadingButton
                type="button"
                variant="contained"
                color="success"
                onClick={() => restoreVoucher(currentVoucher?.id)} // Cần implement logic khôi phục mã giảm giá
              >
                Khôi phục mã giảm giá
              </LoadingButton>
            )}
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
