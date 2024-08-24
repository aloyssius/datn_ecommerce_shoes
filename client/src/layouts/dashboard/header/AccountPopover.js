import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Button, Dialog, Divider, Typography, Stack, MenuItem, IconButton, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
// hooks
import useFetch from '../../../hooks/useFetch';
import useConfirm from '../../../hooks/useConfirm';
import useNotification from '../../../hooks/useNotification';
import { ADMIN_API } from '../../../api/apiConfig';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import useLoading from '../../../hooks/useLoading';
import { RHFTextField, FormProvider } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: 'Home',
  //   linkTo: '/',
  // },
  // {
  //   label: 'Hồ sơ',
  //   linkTo: PATH_DASHBOARD.user.account,
  // },
  // {
  //   label: 'Settings',
  //   linkTo: PATH_DASHBOARD.user.account,
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const { onOpenLoading, onCloseLoading } = useLoading();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const [openChangePass, setOpenChangePass] = useState(false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    onOpenLoading();
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
      onCloseLoading();
    } catch (error) {
      console.error(error);
      onCloseLoading();
      // enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.fullName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>


        {/*
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>
        */}
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => setOpenChangePass(true)} sx={{ m: 1 }}>
          Đổi mật khẩu
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </MenuPopover>

      <DialogChangePass open={openChangePass} onClose={() => setOpenChangePass(false)} user={user} onCloseMenu={handleClose}/>
    </>
  );
}

const DialogChangePass = ({ open, onClose, user, onCloseMenu }) => {

  const handleClose = () => {
    onClose();
    reset();
    setShowPassword(false);
    setShowNewPassword(false);
    onCloseMenu();
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { put } = useFetch(null, { fetch: false });
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify } = useNotification();


  const passwordRegex = /^[^\s]{8,255}$/;

  const NewPassSchema = Yup.object().shape({
    password: Yup.string().required('Mật khẩu hiện tại không được để trống'),
    newPassword: Yup.string()
      .required('Mật khẩu mới không được để trống')
      .matches(passwordRegex, 'Mật khẩu mới phải có độ dài từ 8 đến 255 ký tự và không chứa khoảng trắng'),
  });

  const defaultValues = {
    password: '',
    newPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewPassSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
  } = methods;

  const onFinish = () => {
    onOpenSuccessNotify("Đổi mật khẩu thành công")
    handleClose();
  }

  const onSubmit = async (data) => {
    const body = {
      ...data,
      id: user?.id,
    }
    showConfirm("Xác nhận đổi mật khẩu?", () => put(ADMIN_API.changePass, body, () => onFinish()));
  };

  return (

    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} sx={{ bottom: 50 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ px: 3, mt: 3, ml: 0.5 }}>
          <Typography sx={{ display: 'flex' }} variant="h6">Đổi mật khẩu
          </Typography>

        </Stack>
        <Stack spacing={1} sx={{ px: 3, maxHeight: 600, mt: 1 }}>
          <Box
            sx={{
              p: 1,
              mt: 1.5,
              display: 'grid',
              columnGap: 3.5,
              rowGap: 2.5,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
            }}
          >
            <RHFTextField
              name="password"
              topLabel="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              isRequired
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="newPassword"
              topLabel="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              isRequired
              type={showNewPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ py: 3, px: 1 }}>
            <Button color="inherit" size="small" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button size="small" variant="contained" type="submit">
              Xác nhận
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  )
}
