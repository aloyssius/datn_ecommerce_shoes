import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ADMIN_API } from '../../../api/apiConfig';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useFetch from '../../../hooks/useFetch';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const { fetch } = useFetch(null, { fetch: false });

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Email không được bỏ trống'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: '',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onFinish = (data) => {
    onSent();
    onGetEmail(data.email);
  }

  const onSubmit = async (data) => {
    await fetch(ADMIN_API.resetPass, { email: data?.email }, false);
    onFinish(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Nhập email" size="medium" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Quên mật khẩu
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
