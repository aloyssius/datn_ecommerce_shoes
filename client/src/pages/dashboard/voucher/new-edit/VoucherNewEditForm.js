import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Checkbox, Grid, Stack, TextField, Typography, InputAdornment, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useConfirm from '../../../../hooks/useConfirm'
// components
import {
  FormProvider,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
} from '../../../../components/hook-form';
import Label from '../../../../components/Label';
import { formatCurrencyVnd } from '../../../../utils/formatCurrency';

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

export default function VoucherNewEditForm({ isEdit, currentVoucher }) {

  const { showConfirm } = useConfirm();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewVoucherSchema = Yup.object().shape({
    // name: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    // code: Yup.string().required('Mã sản phẩm không được bỏ trống'),
    // images: Yup.array().min(1, 'Images is required'),
    // price: Yup.number().moreThan(0, 'Vui lòng nhập đơn giá'),
  });

  const defaultValues = useMemo(
    () => ({
      // name: currentProduct?.name || '',
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

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Tên sản phẩm" />

              <RHFTextField name="code" label="Mã sản phẩm" />


              <RHFTextField
                name="price"
                label="Giá trị"
                placeholder="0.00"
                value={getValues('price') === 0 ? '' : getValues('price')}
                onChange={(event) => setValue('price', formatCurrencyVnd(event.target.value))}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                }}
              />
            </Stack>
          </Card>

          <Card sx={{ p: 3, marginTop: 3 }}>
            <Stack spacing={3}>

              Xem sapo

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

            <LoadingButton onClick={() => console.log(getValues('brand'))} type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
