import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, Autocomplete, Box, TextField, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { styled } from '@mui/material/styles';
// hooks
import useConfirm from '../../../../hooks/useConfirm'
import useNotification from '../../../../hooks/useNotification';
// utils
import { fData } from '../../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Label from '../../../../components/Label';
import { FormProvider, RHFRadioGroup, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { AccountGenderOption, AccountStatusTab } from '../../../../constants/enum';
import CustomerNewEditListAddress from './CustomerNewEditListAddress';
import { isPastOrPresentDate, isVietnamesePhoneNumberValid } from '../../../../utils/validate';
import { convertDateGMT, convertDateParam } from '../../../../utils/convertDate';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';

// ----------------------------------------------------------------------

CustomerNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 21,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === '#2065D1',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 17,
    height: 17,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#C1C1C1' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const LabelStyleHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.black,
  fontSize: 16.5,
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

export default function CustomerNewEditForm({ isEdit, currentCustomer }) {
  const navigate = useNavigate();

  const NewCustomerSchemahema = Yup.object().shape({
    fullName: Yup.string().test(
      'max',
      'Họ và tên quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Họ và tên không được để trống'),

    email: Yup.string().test(
      'max',
      'Email không hợp lệ',
      value => value.trim().length <= 254
    ).required('Email không được để trống').email('Email không hợp lệ'),

    phoneNumber: Yup.string().test('is-vietnamese-phone-number', 'SĐT không hợp lệ', (value) => {
      return isVietnamesePhoneNumberValid(value);
    }).required('SĐT không được để trống'),

    birthDate: Yup.string().nullable()
      .test('date-validation', 'Ngày sinh không hợp lệ', (value) => {
        if (value) {
          return isPastOrPresentDate(convertDateGMT(value))
        }
        return true;
      }),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentCustomer?.fullName || '',
      email: currentCustomer?.email || '',
      phoneNumber: currentCustomer?.phoneNumber || '',
      birthDate: currentCustomer?.birthDate || null,
      gender: currentCustomer?.gender || AccountGenderOption.vi.MEN,
      status: currentCustomer?.status || AccountStatusTab.en.IS_ACTIVE,
      avatarUrl: currentCustomer?.avatarUrl || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomer]
  );

  const methods = useForm({
    resolver: yupResolver(NewCustomerSchemahema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentCustomer) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCustomer]);

  const { post } = useFetch(null, { fetch: false });

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const onFinish = (data) => {
    onOpenSuccessNotify('Thêm mới khách hàng thành công!')
    console.log(data);
    navigate(PATH_DASHBOARD.account.customer.edit(data?.id));
  }

  const onSubmit = async (data) => {
    const body = {
      ...data,
      gender: data === AccountGenderOption.vi.MEN ? 0 : 1,
      birthDate: convertDateParam(data.birthDate)
    }
    console.log(body);
    showConfirm("Xác nhận?", () => post(ADMIN_API.customer.post, body, (response) => onFinish(response)));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: !isEdit ? 8.8 : 4, px: 3 }} className='card'>

              <Box sx={{ mt: 5 }}>
                <RHFUploadAvatar
                  name="avatarUrl"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Cho phép định dạng *.jpeg, *.jpg, *.png, *.gif
                      <br /> kích thước tối đa {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              {isEdit && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <IOSSwitch
                          {...field}
                          checked={field.value === AccountStatusTab.vi.IS_ACTIVE}
                          onChange={(event) => field.onChange(event.target.checked ? AccountStatusTab.vi.IS_ACTIVE : AccountStatusTab.vi.UN_ACTIVE)}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Trạng thái
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {values.status}
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mt: 4, width: 1, justifyContent: 'space-between' }}
                />
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2 }} className='card'>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Thông tin khách hàng</LabelStyleHeader>
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
                <RHFTextField name="email" topLabel="Email" isRequired placeholder="Nhập email" />
                <RHFTextField name="phoneNumber" topLabel="Số điện thoại" placeholder="Nhập số điện thoại" isRequired />

                <RHFRadioGroup
                  name="gender"
                  options={[AccountGenderOption.vi.MEN, AccountGenderOption.vi.WOMEN]}
                  topLabel="Giới tính"
                  isRequired
                />

                <Controller
                  name='birthDate'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Grid>
                      <LabelStyle>
                        Ngày sinh
                      </LabelStyle>
                      <DatePicker
                        {...field}
                        inputProps={{
                          placeholder: "dd/MM/yyyy"
                        }}
                        inputFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            size='small'
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
              </Box>

              <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3, px: 1 }}>
                <Button color="inherit" variant="contained">
                  Hủy
                </Button>
                <Button type="submit" variant="contained">
                  Lưu
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <CustomerNewEditListAddress isEdit={isEdit} />
    </>
  );
}
