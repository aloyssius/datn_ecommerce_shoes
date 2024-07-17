import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Chip, Checkbox, Button, Grid, Stack, TextField, Typography, InputAdornment, MenuItem } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Swal from 'sweetalert2'
// hooks
import useConfirm from '../../../../hooks/useConfirm'
import useNotification from '../../../../hooks/useNotification';
// components
import ProductColorNewDialog from './ProductColorNewDialog';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { IconArrowDownAutocomplete } from '../../../../components/IconArrow';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const filter = createFilterOptions();

export default function ProductNewEditColorSize({ data, onCreateAttribute }) {

  const [openColorDialog, setOpenColorDialog] = useState(false);
  const [colorName, setColorName] = useState('');

  const handleOpenFormColorDialog = (colorName) => {
    setOpenColorDialog(true);
    setColorName(colorName);
  }

  const handleClose = () => {
    setOpenColorDialog(false);
    setColorName('');
  }

  const handleCreateColor = (data) => {
    onCreateAttribute(data, "color", "Xác nhận thêm mới màu sắc?", () => setOpenColorDialog(false));
  }

  const addValueToArrayIfNotExits = (data, type, titleConfirm) => {
    onCreateAttribute(data, type, titleConfirm)
  }

  const addValueStrToArray = (list, value, currentArr, field, titleConfirm, type) => {
    if (list.some((item) => item.name === value)) {
      const obj = list.find((item) => item.name === value);
      const newArr = [...currentArr, obj];
      field.onChange(newArr);
    }
    else {
      addValueToArrayIfNotExits(value, type, titleConfirm);
    }
  }

  const {
    control,
    getValues,
  } = useFormContext();

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          columnGap: 3,
          rowGap: 2.5,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
        }}
      >
        <Controller
          name='colors'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Grid>
              <LabelStyle>
                Màu sắc <span className="required">*</span>
              </LabelStyle>
              <Autocomplete
                {...field}
                multiple
                selectOnFocus
                disableCloseOnSelect
                clearOnBlur
                handleHomeEndKeys
                fullWidth
                isOptionEqualToValue={(option, value) => option.id === value.id}
                size='small'
                popupIcon={<IconArrowDownAutocomplete />}
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
                    if (data?.colors?.some((item) => item.name === str)) {
                      const obj = data?.colors?.find((item) => item.name === str);
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
                options={data?.colors || []}
                renderOption={(props, option, { selected }) => (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    sx={{
                      typography: 'body2',
                      height: 36,
                    }}
                  >
                    {option.inputValue ? (
                      <Stack spacing={1} direction="row">
                        <Iconify icon={'eva:plus-circle-outline'} sx={{ color: 'primary.main', width: 22, height: 22 }} />
                        <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới màu sắc: "${option.inputValue}"`}</Typography>
                      </Stack>
                    ) : (
                      <>
                        <Label
                          variant={'filled'}
                          color={option?.code}
                        >
                          {option?.name}
                        </Label>
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
                          color={option?.code}
                        >
                          {option?.name}
                        </Label>
                      </>
                    </span>
                  ))
                }
                renderInput={(params) => <TextField
                  {...params}
                  error={!!error}
                  helperText={error?.message}
                  placeholder={getValues('colors')?.length === 0 ? "Chọn màu sắc" : ""}
                  sx={{
                    '& fieldset': {
                      borderRadius: '6px',
                    },
                    "& .Mui-error": {
                      marginLeft: 0,
                    },
                  }}
                />}
              />
            </Grid>
          )}
        />

        <ProductColorNewDialog
          open={openColorDialog}
          onClose={handleClose}
          colorName={colorName}
          onSave={handleCreateColor}
        />

        <Controller
          name='sizes'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Grid>
              <LabelStyle>
                Kích cỡ <span className="required">*</span>
              </LabelStyle>
              <Autocomplete
                {...field}
                freeSolo
                // ListboxProps={{style: { maxHeight: "25rem" }}}
                forcePopupIcon
                multiple
                selectOnFocus
                disableCloseOnSelect
                clearOnBlur
                popupIcon={<IconArrowDownAutocomplete />}
                handleHomeEndKeys
                fullWidth
                size='small'
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
                  const currentArr = getValues('sizes');
                  if (newValue.some((item) => typeof item === 'string')) {
                    const valueStr = newValue.find((item) => typeof item === 'string');
                    const titleConfirm = `${`Xác nhận thêm mới kích cỡ`} '${valueStr}'?`;
                    addValueStrToArray(data?.sizes, valueStr, currentArr, field, titleConfirm, "size");
                  } else if (newValue && newValue?.some((item) => item?.inputValue)) {
                    const value = newValue?.find((item) => item?.inputValue)?.inputValue;
                    const titleConfirm = `${`Xác nhận thêm mới kích cỡ`} '${value}'?`;
                    addValueToArrayIfNotExits(value, "size", titleConfirm)
                  } else {
                    field.onChange(newValue);
                  }
                }}
                options={data?.sizes || []}
                renderOption={(props, option, { selected }) => (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    sx={{
                      typography: 'body2',
                      height: 36,
                    }}
                  >
                    {option.inputValue ? (
                      <>
                        <Stack spacing={1} direction="row">
                          <Iconify icon={'eva:plus-circle-outline'} sx={{ color: 'primary.main', width: 22, height: 22 }} />
                          <Typography color='primary' sx={{ fontWeight: 'bold' }}>
                            {`Thêm mới kích cỡ: "${option.inputValue}"`}
                          </Typography>
                        </Stack>
                      </>
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
                          color={'primary'}
                        >
                          {option?.name}
                        </Label>
                      </>
                    </span>
                  ))
                }
                renderInput={(params) => <TextField
                  {...params}
                  placeholder={getValues('sizes')?.length === 0 ? "Chọn kích cỡ" : ""}
                  sx={{
                    '& fieldset': {
                      borderRadius: '6px',
                    },
                    "& .Mui-error": {
                      marginLeft: 0,
                    },
                  }}
                  error={!!error}
                  helperText={error?.message}
                />}
              />
            </Grid>
          )}
        />
      </Box>
    </>
  )

}
