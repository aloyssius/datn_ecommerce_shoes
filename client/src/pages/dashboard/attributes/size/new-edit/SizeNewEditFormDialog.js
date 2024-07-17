import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import { Dialog, Stack, Typography, Button, Box } from '@mui/material';
// components
import { FormProvider, RHFTextField } from '../../../../../components/hook-form';

// ----------------------------------------------------------------------

SizeNewEditFormDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  isEdit: PropTypes.bool,
  currentColor: PropTypes.object,
  onSave: PropTypes.func,
};

export default function SizeNewEditFormDialog({ open, onClose, onSave, currentSize, isEdit }) {

  const NewSizeSchema = Yup.object().shape({
    name: Yup.string().test(
      'max',
      'Tên kích cỡ quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Tên kích cỡ không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentSize?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSize]
  );

  const methods = useForm({
    resolver: yupResolver(NewSizeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [currentSize, open]);

  const onSubmit = (data) => {
    console.log(data.name.trim())
    const body = {
      ...data,
      id: currentSize?.id,
    }
    onSave(isEdit ? body : data, isEdit ? "update" : "create");
  };

  const isAllowUpdate = () => {

    if (values.name?.trim() !== defaultValues?.name) {
      return true;
    }

    return false;

  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} sx={{ bottom: 200 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ py: 2 }}>
          <Stack sx={{ px: 3, py: 2 }}>
            <Typography variant="h6"> {isEdit ? "Cập nhật" : "Thêm mới"} kích cỡ </Typography>
          </Stack>
          <Stack spacing={3} sx={{ px: 3, height: 'auto' }}>
            <RHFTextField
              isRequired
              topLabel="Tên kích cỡ"
              name="name"
              placeholder="Nhập tên kích cỡ"
            // onBlur={(e) => setValue('name', e.target.value?.trim())}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ py: 2 }}>
              <Button color="inherit" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button variant="contained" type="submit" disabled={isEdit && !isAllowUpdate()}>
                {isEdit ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Stack>

          </Stack>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
