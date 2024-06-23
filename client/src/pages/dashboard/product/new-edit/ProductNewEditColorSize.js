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

// ----------------------------------------------------------------------

ProductNewEditColorSize.propTypes = {
  // isEdit: PropTypes.bool,
  // currentProduct: PropTypes.object,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const filter = createFilterOptions();

export default function ProductNewEditColorSize({ methods }) {

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

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <>
      <LabelStyle>Màu sắc & Kích cỡ</LabelStyle>
      <div style={{ display: 'flex' }}>
        <Controller
          name='colors'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              multiple
              selectOnFocus
              disableCloseOnSelect
              clearOnBlur
              handleHomeEndKeys
              fullWidth
              sx={{ marginRight: '20px' }}
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
                const isExisting = options.some((option) => inputValue === option.name || inputValue === option.code);
                if (inputValue?.trim() !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                  });
                }

                return filtered;
              }}
              onChange={(event, newValue) => {
                if (newValue.some((item) => typeof item === 'string')) {
                  const str = newValue.find((item) => typeof item === 'string');
                  if (top100Films.some((item) => item.name === str)) {
                    const obj = top100Films.find((item) => item.name === str);
                    const newArr = [...getValues('colors'), obj];
                    field.onChange(newArr);
                  }
                  else {
                    handleOpenFormColorDialog(str);
                  }
                } else if (newValue && newValue?.some((item) => item?.inputValue)) {
                  const value = newValue?.find((item) => item?.inputValue)?.inputValue;
                  handleOpenFormColorDialog(value);
                } else {
                  field.onChange(newValue);
                }
              }}
              options={top100Films}
              renderOption={(props, option, { selected }) => (
                <MenuItem
                  {...props}
                  key={option.id}
                  value={option.id}
                  sx={{
                    typography: 'body2',
                    height: 38,
                  }}
                >
                  {option.inputValue ? (
                    <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới màu sắc: "${option.inputValue}"`}</Typography>
                  ) : (
                    <>
                      <ColorSquare color={option.code} name={option.name} />
                      <Checkbox size='small' checked={selected} sx={{ marginLeft: 'auto' }} />
                    </>
                  )}
                </MenuItem>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <span key={index} {...getTagProps({ index })}>
                    <>
                      <ColorSquare color={option?.code} name={option?.name} />
                    </>
                  </span>
                ))
              }
              renderInput={(params) => <TextField
                label='Màu sắc'
                {...params}
                error={!!error}
                helperText={error?.message}
              />}
            />
          )}
        />

        <ProductColorNewDialog
          open={openColorDialog}
          onClose={() => setOpenColorDialog(false)}
          colorName={colorName}
          onColorName={handleChangeColorName}
          onAddColor={handleAddColor}
        />

        <Controller
          name='sizes'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              freeSolo
              forcePopupIcon
              multiple
              selectOnFocus
              disableCloseOnSelect
              clearOnBlur
              handleHomeEndKeys
              fullWidth
              isOptionEqualToValue={(option, value) => option.id === value.id}
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
                if (newValue.some((item) => typeof item === 'string')) {
                  const str = newValue.find((item) => typeof item === 'string');
                  if (top100Films1.some((item) => item.name === str)) {
                    const obj = top100Films1.find((item) => item.name === str);
                    const newArr = [...getValues('sizes'), obj];
                    field.onChange(newArr);
                  }
                  else {
                    const obj = { name: str };
                    const newArr = [...getValues('sizes'), obj];
                    field.onChange(newArr);
                    showConfirm("Xác nhận thêm mới kích cỡ?", () => fetch(), () => onCancel(field));
                  }
                } else if (newValue && newValue?.some((item) => item?.inputValue)) {
                  const value = newValue?.find((item) => item?.inputValue)?.inputValue;
                  const obj = { name: value };
                  const newArr = [...getValues('sizes'), obj];
                  field.onChange(newArr);
                  showConfirm("Xác nhận thêm mới kích cỡ?", () => fetch(), () => onCancel(field));
                } else {
                  field.onChange(newValue);
                }
              }}
              options={top100Films1}
              renderOption={(props, option, { selected }) => (
                <MenuItem
                  {...props}
                  key={option.id}
                  value={option.id}
                  sx={{
                    typography: 'body2',
                    height: 38,
                  }}
                >
                  {option.inputValue ? (
                    <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới kích cỡ: "${option.inputValue}"`}</Typography>
                  ) : (
                    <>
                      {option.name}
                      <Checkbox size='small' checked={selected} sx={{ marginLeft: 'auto' }} />
                    </>
                  )}
                </MenuItem>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <span key={index} {...getTagProps({ index })}>
                    <>
                      <Label
                        variant={'filled'}
                        color={option?.id ? 'primary' : 'default'}
                      >
                        {option?.name}
                      </Label>
                    </>
                  </span>
                ))
              }
              renderInput={(params) => <TextField
                label='Kích cỡ'
                {...params}
                error={!!error}
                helperText={error?.message}
              />}
            />
          )}
        />
      </div>
    </>
  )

}
const top100Films = [
  { id: 'uuid1', code: '#313131', name: 'Blue' },
  { id: 'uuid2', code: '#d1d1d1', name: 'White' },
];

const top100Films1 = [
  { id: 'uuid1', name: '40' },
  { id: 'uuid2', name: '41' },
];
