import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Checkbox, Grid, Stack, TextField, Typography, InputAdornment, MenuItem } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Swal from 'sweetalert2'
import axios from 'axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useConfirm from '../../../../hooks/useConfirm'
import useNotification from '../../../../hooks/useNotification';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../../components/hook-form';
import ColorSquare from './ColorSquare';
import ProductColorNewDialog from './ProductColorNewDialog';
import Label from '../../../../components/Label';
import { formatCurrencyVnd } from '../../../../utils/formatCurrency';
import { ProductStatusTab } from '../../../../constants/enum';
import ProductNewEditColorSize from './ProductNewEditColorSize';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const filter = createFilterOptions();

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {

  const fetchArr = () => {
    axios.get("https://64aae1d60c6d844abedef185.mockapi.io/api/v1/todos/10")
      .then(response => {
        setTimeout(() => {
          Swal.close();

          // const newArr = getValues('colors').filter((item) => !item?.isNew).map((item) => ({
          //   id: item.id,
          //   name: item.name,
          // }));
          // newArr.push({ id: response.data.id, name: response.data.ma })
          //
          // setValue('colors', newArr);
          // top100Films.push({ id: response.data.id, name: response.data.ma });

          console.log(getValues('colors'))

          onOpenSuccessNotify('Thêm mới danh mục thành công!')
        }, 3000);
      })
      .catch(error => {
        Swal.close();
      });
  }

  const fetch = (color, hex) => {
    axios.get("https://64aae1d60c6d844abedef185.mockapi.io/api/v1/todos/10")
      .then(response => {
        setTimeout(() => {
          Swal.close();

          setOpenColorDialog(false);
          console.log(color);
          console.log(hex);

          onOpenSuccessNotify('Thêm mới danh mục thành công!')
          handleChangeColorName('');
        }, 3000);
      })
      .catch(error => {
        Swal.close();
      });
  }

  const fetch1 = () => {
    axios.get("https://64aae1d60c6d844abedef185.mockapi.io/api/v1/todos/1")
      .then(response => {
        // setValue('brand', { id: response.data.id, name: response.data.ma });
        // top100Films.push({ id: response.data.id, name: response.data.ma });
        Swal.close();
        onOpenSuccessNotify('Thêm mới danh mục thành công!')
      })
      .catch(error => {
        Swal.close();
      });
  }

  const handleAddColor = (color, hex) => {
    showConfirm("Xác nhận thêm mới màu sắc?", () => fetch(color, hex));
  }

  const [openColorDialog, setOpenColorDialog] = useState(false);
  const [colorName, setColorName] = useState('');

  const handleOpenFormColorDialog = (colorName) => {
    setOpenColorDialog(true);
    handleChangeColorName(colorName);
  }

  const handleChangeColorName = (name) => {
    setColorName(name);
  }

  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const { showConfirm } = useConfirm();

  const onConfirm = (field, newValue) => {
    field.onChange({ id: 1, name: newValue.inputValue });
  }

  const onCancel = (field) => {
    field.onChange(field.value);
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    code: Yup.string().required('Mã sản phẩm không được bỏ trống'),
    // images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Vui lòng nhập đơn giá'),
  });

  const defaultValues = useMemo(
    () => ({
      // name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      code: currentProduct?.code || '',
      price: currentProduct?.price || 0,
      status: currentProduct?.status || true,
      category: currentProduct?.category || null,
      brand: currentProduct?.brand || null,
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Tên sản phẩm" />

              <RHFTextField name="code" label="Mã sản phẩm" />

              <div>
                <LabelStyle>Mô tả</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              {/*
                <RHFTextField
                  name="price"
                  label="Đơn giá"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', formatCurrencyVnd(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                  }}
                />
                  <div>
                    <LabelStyle>Images</LabelStyle>
                    <RHFUploadMultiFile
                      name="images"
                      showPreview
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </div>
                */}
            </Stack>
          </Card>

          <Card sx={{ p: 3, marginTop: 3 }}>
            <Stack spacing={3}>

              <ProductNewEditColorSize methods={methods} />

            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Controller
                  name='category'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      {...field}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      fullWidth
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      freeSolo
                      forcePopupIcon
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        return option.name;
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        const isExisting = options.some((option) => inputValue === option.name);
                        if (inputValue?.trim() !== '' && !isExisting) {
                          filtered.push({
                            inputValue,
                          });
                        }

                        return filtered;
                      }}
                      onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                          if (top100Films.some((item) => item.name === newValue)) {
                            field.onChange(top100Films.find((item) => item.name === newValue));
                          }
                          else {
                            field.onChange(newValue);
                            showConfirm("Xác nhận thêm mới danh mục?", () => fetch(), () => onCancel(field));
                          }
                        } else if (newValue && newValue.inputValue) {
                          field.onChange(newValue.inputValue);
                          showConfirm("Xác nhận thêm mới danh mục?", () => fetch(), () => onCancel(field));
                        } else {
                          field.onChange(newValue);
                        }
                      }}
                      options={top100Films}
                      renderOption={(props, option) => (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            padding: 0,
                            height: 38
                          }}
                        >
                          {option.inputValue ? (
                            <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới danh mục : "${option.inputValue}"`}</Typography>
                          ) : (
                            <>
                              {option.name}
                            </>
                          )}
                        </MenuItem>
                      )}
                      renderInput={(params) => <TextField
                        label='Danh mục'
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />}
                    />
                  )}
                />

                <Controller
                  name='brand'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      {...field}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      fullWidth
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      freeSolo
                      forcePopupIcon
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        return option.name;
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        const isExisting = options.some((option) => inputValue === option.name);
                        if (inputValue?.trim() !== '' && !isExisting) {
                          filtered.push({
                            inputValue,
                          });
                        }

                        return filtered;
                      }}
                      options={top100Films}
                      onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                          if (top100Films.some((item) => item.name === newValue)) {
                            field.onChange(top100Films.find((item) => item.name === newValue));
                          }
                          else {
                            field.onChange(newValue);
                            showConfirm("Xác nhận thêm mới thương hiệu?", () => fetch1(), () => onCancel(field));
                          }
                        } else if (newValue && newValue.inputValue) {
                          field.onChange(newValue.inputValue);
                          showConfirm("Xác nhận thêm mới thương hiệu?", () => fetch1(), () => onCancel(field));
                        } else {
                          field.onChange(newValue);
                        }
                      }}
                      renderOption={(props, option) => (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          sx={{
                            mx: 1,
                            my: 0.5,
                            borderRadius: 0.75,
                            typography: 'body2',
                            padding: 0,
                            height: 38
                          }}
                        >
                          {option.inputValue ? (
                            <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới thương hiệu : "${option.inputValue}"`}</Typography>
                          ) : (
                            <>
                              {option.name}
                            </>
                          )}
                        </MenuItem>
                      )}
                      renderInput={(params) => <TextField
                        label='Thương hiệu'
                        {...params}
                        error={!!error}
                        helperText={error?.message}
                      />}
                    />
                  )}
                />

              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div style={{ display: 'flex' }}>
                  <div >
                    <LabelStyle>Trạng thái</LabelStyle>
                    <p>{getValues('status') === true ? 'Kinh doanh' : 'Ngừng kinh doanh'}</p>
                  </div>

                  <div style={{ marginLeft: 'auto' }}>
                    <RHFSwitch
                      name="status"
                    />
                  </div>
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
const top100Films = [
  { id: 'uuid1', code: '#313131', name: 'Blue' },
  { id: 'uuid2', code: '#d1d1d1', name: 'White' },
];

const top100Films1 = [
  { id: 'uuid1', name: '40' },
  { id: 'uuid2', name: '41' },
];
