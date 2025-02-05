import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import { Dialog, Stack, Typography, Button, Box } from '@mui/material';
// components
import { isValidColorHex } from '../../../../utils/validate';
import Label from '../../../../components/Label';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

ProductColorNewDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onSave: PropTypes.func,
  colorName: PropTypes.string,
};

export default function ProductColorNewDialog({ open, onClose, onSave, colorName }) {

  const NewColorSchema = Yup.object().shape({
    name: Yup.string().test(
      'max',
      'Tên màu sắc quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Tên màu sắc không được để trống'),

    code: Yup.string().test('is-code-hex', 'Mã màu không hợp lệ', (value) => {
      return isValidColorHex(value);
    }).required('Mã màu được để trống'),

  });

  const defaultValues = useMemo(
    () => ({
      code: isValidColorHex(colorName) ? colorName : '',
      name: !isValidColorHex(colorName) ? colorName : '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorName]
  );

  const methods = useForm({
    resolver: yupResolver(NewColorSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [colorName, open]);

  const onSubmit = async (data) => {
    onSave(data);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} sx={{ bottom: 200 }}>
      <FormProvider methods={methods} >
        <Box sx={{ py: 2 }}>
          <Stack sx={{ px: 3, py: 2 }}>
            <Typography variant="h6"> Thêm mới màu sắc </Typography>
          </Stack>
          <Stack spacing={3} sx={{ px: 3, height: 'auto' }}>
            <RHFTextField
              isRequired
              topLabel="Mã màu sắc"
              name="code"
              placeholder="Nhập mã màu sắc (VD: #F0F0F0)"
              InputProps={{
                endAdornment: isValidColorHex(values.code) &&
                  <Label
                    variant={'filled'}
                    color={values.code}
                  >
                    {values.code}
                  </Label>
              }}
            />

            <RHFTextField
              isRequired
              topLabel="Tên màu sắc"
              name="name"
              placeholder="Nhập tên màu sắc"
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ py: 2 }}>
              <Button color="inherit" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit)}>
                Thêm mới
              </Button>
            </Stack>

          </Stack>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
