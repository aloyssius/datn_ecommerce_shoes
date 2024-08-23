import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import DatePicker from '@mui/lab/DatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import { format } from "date-fns";
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, Autocomplete, Box, TextField, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
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
import EmployeeNewEditListAddress from './EmployeeNewEditListAddress';
import { isPastOrPresentDate, isVietnamesePhoneNumberValid } from '../../../../utils/validate';
import { convertDatePicker, convertDateParam } from '../../../../utils/convertDate';
import { convertToEnumAccountGender, convertAccountGender, convertAccountStatus } from '../../../../utils/ConvertEnum';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';

// ----------------------------------------------------------------------

EmployeeNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentEmployee: PropTypes.object,
  onUpdate: PropTypes.func,
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

export default function EmployeeNewEditForm({ isEdit, currentEmployee, onUpdate }) {
  const navigate = useNavigate();

  const NewEmployeeSchema = Yup.object().shape({
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

    birthDate: Yup.string().nullable().test('is-past-or-present-date', 'Ngày sinh không hợp lệ', (value) => {
      if (value) {
        return isPastOrPresentDate(value);
      }
      return true;
    }
    ),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentEmployee?.fullName || '',
      email: currentEmployee?.email || '',
      phoneNumber: currentEmployee?.phoneNumber || '',
      birthDate: convertDatePicker(currentEmployee?.birthDate),
      gender: convertToEnumAccountGender(currentEmployee?.gender),
      status: currentEmployee?.status || AccountStatusTab.en.IS_ACTIVE,
      // avatarUrl: currentEmployee?.avatarUrl || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentEmployee]
  );

  const methods = useForm({
    resolver: yupResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
  } = methods;

  const values = watch();

  const { fullName, phoneNumber, birthDate, gender, status } = values;

  useEffect(() => {
    if (isEdit && currentEmployee) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentEmployee]);

  const { post, put } = useFetch(null, { fetch: false });

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify } = useNotification();

  const onFinish = (data) => {
    if (!isEdit) {
      onOpenSuccessNotify('Thêm mới nhân viên thành công!')
      console.log(data);
      navigate(PATH_DASHBOARD.account.employee.edit(data?.id));
    }
    else {
      console.log(data);
      onOpenSuccessNotify('Cập nhật nhân viên thành công!')
      onUpdate(data);
    }
  }

  const onSubmit = async (data) => {
    const body = {
      ...data,
      gender: convertAccountGender(data?.gender),
      birthDate: convertDateParam(data.birthDate)
    }
    console.log(body);

    if (!isEdit) {
      const body = {
        ...data,
        gender: convertAccountGender(data?.gender),
        birthDate: convertDateParam(data.birthDate)
      }
      console.log(body);
      showConfirm("Xác nhận thêm mới nhân viên?", () => post(ADMIN_API.employee.post, body, (response) => onFinish(response)));
    }
    else {
      const body = {
        ...data,
        gender: convertAccountGender(data?.gender),
        id: currentEmployee?.id,
        birthDate: convertDateParam(data.birthDate)
      }
      console.log(body);
      showConfirm("Xác nhận cập nhật nhân viên?", () => put(ADMIN_API.employee.put, body, (response) => onFinish(response)));
    }
  };

  const isDefault = fullName?.trim() !== currentEmployee?.fullName ||
    phoneNumber?.trim() !== currentEmployee?.phoneNumber ||
    status !== currentEmployee?.status ||
    convertDateParam(birthDate) !== currentEmployee?.birthDate ||
    convertAccountGender(gender) !== currentEmployee?.gender;

  // const handleDrop = useCallback(
  //     (acceptedFiles) => {
  //         const file = acceptedFiles[0];
  //
  //         if (file) {
  //             setValue(
  //                 'avatarUrl',
  //                 Object.assign(file, {
  //                     preview: URL.createObjectURL(file),
  //                 })
  //             );
  //         }
  //     },
  //     [setValue]
  // );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/*
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
                                                    checked={field.value === AccountStatusTab.en.IS_ACTIVE}
                                                    onChange={(event) => field.onChange(event.target.checked ? AccountStatusTab.en.IS_ACTIVE : AccountStatusTab.en.UN_ACTIVE)}
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
                                                {convertAccountStatus(values.status)}
                                            </Typography>
                                        </>
                                    }
                                    sx={{ mx: 0, mt: 4, width: 1, justifyContent: 'space-between' }}
                                />
                            )}
                        </Card>
                    </Grid>
          */}

          <Grid item xs={12} md={12}>
            <Card sx={{ p: 2 }} className='card'>
              <LabelStyleHeader sx={{ ml: 0.8 }}>Thông tin nhân viên</LabelStyleHeader>
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
                <RHFTextField name="email" topLabel="Email" isRequired placeholder="Nhập email" disabled={isEdit} />
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
                    <Grid className="custom-grid">
                      <LabelStyle>
                        Ngày sinh
                      </LabelStyle>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            disableFuture
                            value={field.value}
                            onChange={(newValue) => {
                              console.log(newValue);
                              field.onChange(newValue);
                            }}
                            format="DD/MM/YYYY"
                            slotProps={{
                              textField: {
                                placeholder: 'dd/MM/yyyy',
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
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>
                  )}
                />

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
                            checked={field.value === AccountStatusTab.en.IS_ACTIVE}
                            onChange={(event) => field.onChange(event.target.checked ? AccountStatusTab.en.IS_ACTIVE : AccountStatusTab.en.UN_ACTIVE)}
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
                          {status === AccountStatusTab.en.IS_ACTIVE ? "Đang làm việc" : "Đã nghỉ việc"}
                        </Typography>
                      </>
                    }
                    sx={{ mx: 0, mt: 2, width: 1, justifyContent: 'space-between' }}
                  />
                )}
              </Box>


              <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3, px: 1 }}>
                <Button onClick={() => navigate(PATH_DASHBOARD.account.employee.root)} color="inherit" variant="contained">
                  Hủy
                </Button>
                <Button type="submit" variant="contained" disabled={!isDefault && isEdit}>
                  Lưu
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid >
      </FormProvider >
    </>
  );
}
