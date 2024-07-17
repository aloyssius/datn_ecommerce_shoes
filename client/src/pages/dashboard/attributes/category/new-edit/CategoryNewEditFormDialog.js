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

CategoryNewEditFormDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  isEdit: PropTypes.bool,
  currentColor: PropTypes.object,
  onSave: PropTypes.func,
};

export default function CategoryNewEditFormDialog({ open, onClose, onSave, currentCategory, isEdit }) {

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().test(
      'max',
      'Tên danh mục quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Tên danh mục không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
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
  }, [currentCategory, open]);

  const onSubmit = (data) => {
    console.log(data.name.trim())
    const body = {
      ...data,
      id: currentCategory?.id,
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
            <Typography variant="h6"> {isEdit ? "Cập nhật" : "Thêm mới"} danh mục </Typography>
          </Stack>
          <Stack spacing={3} sx={{ px: 3, height: 'auto' }}>
            <RHFTextField
              isRequired
              topLabel="Tên danh mục"
              name="name"
              placeholder="Nhập tên danh mục"
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
