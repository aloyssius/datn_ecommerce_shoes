import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import Swal from 'sweetalert2'
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MenuItem, Grid, Box, Dialog, Stack, Typography, Button, TextField, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import { FormProvider, RHFCheckbox, RHFTextField } from '../../../../components/hook-form';
// hooks
import useDeliveryApi from '../../../../hooks/useDeliveryApi';

// ----------------------------------------------------------------------

CustomerAddressNewDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

export default function CustomerAddressNewDialog({ open, onClose, isEdit, currentAddress }) {

  const NewAddressSchema = Yup.object().shape({
    fullName: Yup.string().required('Tên không được để trống'),
    phoneNumber: Yup.string().required('SĐT không được để trống'),
    district: Yup.object().nullable().required('Bạn chưa chọn Quận/Huyện'),
    ward: Yup.object().nullable().required('Bạn chưa chọn Xã/Phường'),
    province: Yup.object().nullable().required('Bạn chưa chọn Tỉnh/Thành'),
    address: Yup.string().required('Địa chỉ không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentAddress?.fullName || '',
      phoneNumber: currentAddress?.phoneNumber || '',
      district: currentAddress?.districtId || null,
      ward: currentAddress?.wardCode || null,
      province: currentAddress?.provinceId || null,
      address: currentAddress?.address || '',
      isDefault: currentAddress?.isDefault || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAddress]
  );

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    trigger,
    formState: { isSubmitted },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentAddress) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentAddress]);

  useEffect(() => {
    setValue('district', null);
    setValue('ward', null);

    if (isSubmitted) {
      trigger(['district', 'ward']);
    }

    if (values.province === null) {
      setDistricts([]);
      setWards([]);
    }

    if (values.province) {
      // get districts
      fetchDistrictsByProvinceId(values.province.ProvinceID);
    }

  }, [values.province]);

  useEffect(() => {
    setValue('ward', null);

    if (isSubmitted) {
      trigger(['ward']);
    }

    if (values.district === null) {
      setWards([]);
    }

    if (values.district) {
      // get wards
      fetchWardsByDistrictId(values.district.DistrictID);
    }

  }, [values.district]);

  // get hooks devlivery
  const { provinces, districts, wards, fetchDistrictsByProvinceId, fetchWardsByDistrictId, setDistricts, setWards } = useDeliveryApi();

  const fetch = () => {
    axios.get("https://64aae1d60c6d844abedef185.mockapi.io/api/v1/todos/10")
      .then(response => {
        setTimeout(() => {
          Swal.close();

        }, 3000);
      })
      .catch(error => {
        Swal.close();
      });
  }

  const onSubmit = async () => {
    try {
      await fetch();
      reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} sx={{ bottom: 50 }}>
      <Stack sx={{ px: 3, mt: 3, ml: 0.5 }}>
        <Typography variant="h6"> Thêm mới địa chỉ </Typography>
      </Stack>
      <Stack spacing={3} sx={{ px: 3, maxHeight: 600, mt: 1 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit()}>
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
            <RHFTextField name="fullName" topLabel="Họ và tên" placeholder="Nhập họ và tên" isRequired />
            <RHFTextField name="phoneNumber" topLabel="Số điện thoại" placeholder="Nhập số điện thoại" isRequired />

            <Controller
              name='province'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Grid>
                  <LabelStyle>
                    Tỉnh/Thành <span className="required">*</span>
                  </LabelStyle>
                  <Autocomplete
                    {...field}
                    autoHighlight
                    fullWidth
                    options={provinces || []}
                    isOptionEqualToValue={(option, value) => option.ProvinceID === value.ProvinceID}
                    getOptionLabel={(option) => option.ProvinceName}
                    onChange={(event, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderOption={(props, option) => (
                      <MenuItem
                        {...props}
                        key={option.ProvinceID}
                        value={option.ProvinceID}
                        sx={{
                          typography: 'body2',
                          height: 38,
                        }}
                      >
                        {option.ProvinceName}
                      </MenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Chọn tỉnh thành"
                        size='small'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'off', // disable autocomplete and autofill
                        }}
                        error={!!error}
                        helperText={error?.message}
                        sx={{
                          '& fieldset': {
                            borderRadius: '6px',
                          },
                          "& .Mui-error": {
                            marginLeft: 0,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            />

            <Controller
              name='district'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Grid>
                  <LabelStyle>
                    Quận/Huyện <span className="required">*</span>
                  </LabelStyle>
                  <Autocomplete
                    {...field}
                    autoHighlight
                    fullWidth
                    className='custom-disabled'
                    disabled={districts && districts.length === 0}
                    options={districts || []}
                    isOptionEqualToValue={(option, value) => option.DistrictID === value.DistrictID}
                    getOptionLabel={(option) => option.DistrictName}
                    onChange={(event, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderOption={(props, option) => (
                      <MenuItem
                        {...props}
                        key={option.DistrictID}
                        value={option.DistrictID}
                        sx={{
                          typography: 'body2',
                          height: 38,
                        }}
                      >
                        {option.DistrictName}
                      </MenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Chọn quận huyện"
                        size='small'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'off', // disable autocomplete and autofill
                        }}
                        error={!!error}
                        helperText={error?.message}
                        sx={{
                          "& .MuiInputBase-root.Mui-disabled": {
                            backgroundColor: "#f3f4f5",
                          },
                          '& fieldset': {
                            borderRadius: '6px',
                          },
                          "& .Mui-error": {
                            marginLeft: 0,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            />

            <Controller
              name='ward'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Grid>
                  <LabelStyle>
                    Xã/Phường <span className="required">*</span>
                  </LabelStyle>
                  <Autocomplete
                    {...field}
                    autoHighlight
                    fullWidth
                    // className='custom-disabled'
                    disabled={wards && wards.length === 0}
                    options={wards || []}
                    isOptionEqualToValue={(option, value) => option.WardCode === value.WardCode}
                    getOptionLabel={(option) => option.WardName}
                    onChange={(event, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderOption={(props, option) => (
                      <MenuItem
                        {...props}
                        key={option.WardCode}
                        value={option.WardCode}
                        sx={{
                          typography: 'body2',
                          height: 38,
                        }}
                      >
                        {option.WardName}
                      </MenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Chọn xã phường"
                        size='small'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'off', // disable autocomplete and autofill
                        }}

                        error={!!error}
                        helperText={error?.message}
                        sx={{
                          "& .MuiInputBase-root.Mui-disabled": {
                            backgroundColor: "#f3f4f5",
                          },
                          '& fieldset': {
                            borderRadius: '6px',
                          },
                          "& .Mui-error": {
                            marginLeft: 0,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
            />

            <RHFTextField name="address" topLabel="Địa chỉ cụ thể" placeholder="Nhập Tên đường, Tòa nhà, Số nhà" isRequired />
            <div>
              <RHFCheckbox name="isDefault" label="Đặt làm địa chỉ mặc định" size="small" />
            </div>
          </Box>
          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ py: 3, px: 1 }}>
            <Button color="inherit" size="small" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button size="small" variant="contained" onClick={() => { console.log(values.district) }} type="submit">
              Thêm mới
            </Button>
          </Stack>
        </FormProvider>
      </Stack>

    </Dialog>
  );
}
