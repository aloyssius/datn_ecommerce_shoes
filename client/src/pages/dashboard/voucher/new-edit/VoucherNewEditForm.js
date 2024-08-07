import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
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
import { Card, Chip, Checkbox, Grid, Stack, Box, TextField, Typography, InputAdornment, MenuItem, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
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
import { convertDateTimeParam } from '../../../../utils/convertDate';
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
      .required('Giá trị không được để trống')
      .max(9, 'Giá trị không được nhập quá 999,999,999'),
    minOrderValue: Yup.string()
      .required('Giá trị không được để trống')
      .max(9, 'Giá trị không được nhập quá 999,999,999'),
    maxDiscountValue: Yup.string()
      .max(9, 'Giá trị không được nhập quá 999,999,999'),
    // .typeError('Giá trị phải là một số')
    // .positive('Giá trị phải lớn hơn 0')
    // .integer('Giá trị phải là một số nguyên')





    // value: Yup.string().test('is-valid', 'Giá trị không hợp lệ', (value) => {
    //   if (!/^\d+$/.test(value)) {
    //     return false; // Nếu không phải số, không hợp lệ
    //   }
    //   // Lấy giá trị của typeDiscount từ đâu đó (ví dụ, mình giả sử lấy từ state hoặc props)
    //   const typeDiscount = getValues('typeDiscount'); // Đảm bảo bạn có cách lấy giá trị typeDiscount ở đây
    //   // Xác định giới hạn số chữ số tối đa dựa vào typeDiscount
    //   let maxDigitsAllowed;
    //   if (typeDiscount === VoucherTypeDiscount.vi.VND) {
    //     maxDigitsAllowed = 9;
    //   } else if (typeDiscount === VoucherTypeDiscount.vi.PERCENT) {
    //     maxDigitsAllowed = 2;
    //   }
    //   // Kiểm tra số chữ số của giá trị
    //   if (value.length > maxDigitsAllowed) {
    //     return false;
    //   }
    //   return true;
    // }).required('Không được để trống'),

    // minOrderValue: Yup.string()
    //   .max(9, 'Giá trị không hợp lệ')
    //   .test(
    //     'value is invalid',
    //     'Số tiền không hợp lệ',
    //     (value) => {
    //       return isNumber(value);
    //     }).required('Không được để trống'),

    // startTime: Yup.date()
    //   .required('Ngày bắt đầu không được để trống'),
    // // .test(
    // //   'future',
    // //   'Không nhập ngày quá khứ',
    // //   (value) => {
    // //     return dayjs(value);
    // //   }
    // // ),

    // endTime: Yup.date()
    //   .required('Ngày kết thúc không được để trống')

    // // images: Yup.array().min(1, 'Images is required'),
    // // price: Yup.number().moreThan(0, 'Vui lòng nhập đơn giá'),
  });

  const defaultValues = useMemo(
    () => ({
      code: currentVoucher?.code || '',
      name: currentVoucher?.name || '',
      typeDiscount: convertToEnumVoucherTypeDiscount(currentVoucher?.typeDiscount),
      value: currentVoucher?.value || '',
      minOrderValue: currentVoucher?.minOrderValue || '',
      maxDiscountValue: currentVoucher?.maxDiscountValue || '',
      // startTime: convertDateTimeParam(currentVoucher?.startTime),
      // endTime: convertDateTimeParam(currentVoucher?.endTime),
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

  const { post, put } = useFetch(null, { fetch: false });

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
      const body = {
        ...data,
        typeDiscount: convertVoucherTypeDiscount(data?.typeDiscount),
        startTime: convertDateTimeParam(data.startTime),
        endTime: convertDateTimeParam(data.endTime),
        value: parseInt(data.value, 10),
        // maxDiscountValue: parseInt(data.maxDiscountValue, 10),
        maxDiscountValue: data.maxDiscountValue ? parseInt(data.maxDiscountValue, 10) : 0,
        minOrderValue: parseInt(data.minOrderValue, 10)
      }
      console.log(body);
      showConfirm("Xác nhận thêm mới voucher?", () => post(ADMIN_API.voucher.post, body, (response) => onFinish(response)));
    }
    else {
      const body = {
        ...data,
        typeDiscount: convertVoucherTypeDiscount(data?.typeDiscount),
        startTime: convertDateTimeParam(data.startTime),
        endTime: convertDateTimeParam(data.endTime),
        value: parseInt(data.value, 10),
        maxDiscountValue: data.maxDiscountValue ? parseInt(data.maxDiscountValue, 10) : 0,
        minOrderValue: parseInt(data.minOrderValue, 10)
      }
      const id = currentVoucher?.id;
      console.log(body);
      showConfirm("Xác nhận cập nhật voucher?", () => put(`${ADMIN_API.voucher.put(id)}`, body, (response) => onFinish(response)));
    }


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
                  value={getValues('value') === 0 ? '' : formatCurrencyVnd(getValues('value'))} // Định dạng giá trị với dấu phẩy
                  InputLabelProps={{ shrink: true }}
                  isRequired
                  onChange={(event) => {
                    const rawValue = event.target.value.replace(/,/g, ''); // Loại bỏ dấu phẩy
                    const value = parseFloat(rawValue); // Chuyển đổi thành số
                    const typeDiscount = getValues('typeDiscount');

                    if (typeDiscount === VoucherTypeDiscount.vi.PERCENT) {
                      if (!Number.isNaN(value) && value <= 100) {
                        setValue('value', rawValue); // Lưu giá trị không có dấu phẩy
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
                    value={getValues('maxDiscountValue') === 0 ? '' : formatCurrencyVnd(getValues('maxDiscountValue'))}
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
                value={getValues('minOrderValue') === 0 ? '' : formatCurrencyVnd(getValues('minOrderValue'))}
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
                        Ngày bắt đầu
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
                          // disablePast
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
                        Ngày kết thúc
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
                          // disablePast
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
              <Stack spacing={3}>
                <div>
                  <LabelStyle>Tổng quan mã giảm giá</LabelStyle>
                  ABC
                </div>
              </Stack>
            </Card>

            <LoadingButton onClick={() => console.log(getValues('endTime'))} type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Tạo mã giảm giá' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
