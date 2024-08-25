import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { noCase } from 'change-case';
import { useState } from 'react';
// @mui
import { green, pink } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import moment from 'moment';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import { ADMIN_API } from '../../../api/apiConfig';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {

  const { user, notifies, onNotifies } = useAuth();

  const [notifications, setNotifications] = useState(_notifications);

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const totalUnRead = notifies?.length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} thông báo chưa đọc
            </Typography>
          </Box>

          {/* totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          ) */}
        </Box>

        {/*
        <Divider sx={{ borderStyle: 'dashed' }} />
        */}

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
          // subheader={
          //   <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
          //     Mới
          //   </ListSubheader>
          // }
          >
            {notifies?.slice(0, 5)?.map((notification) => (
              <NotificationItem onClose={handleClose} key={notification.id} notification={notification} onUpdate={onNotifies} />
            ))}
          </List>

          {/*
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Trước đó
              </ListSubheader>
            }
          >
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
          */}
        </Scrollbar>


        {/*
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
        */}
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
};

function NotificationItem({ notification, onClose, onUpdate }) {
  const { /* avatar, */ title } = renderContent(notification);
  const navigate = useNavigate();
  const { put } = useFetch(null, { fetch: false });

  const onFinish = (res) => {
    onClose();
    onUpdate(res);
    navigate(`${PATH_DASHBOARD.bill.details(notification?.url)}`);
  }

  const handleUpdateNotify = () => {
    put(ADMIN_API.changeNotifies(notification?.url), null, (res) => onFinish(res));
  }

  return (
    <ListItemButton
      onClick={handleUpdateNotify}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.is_seen === 0 && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: green[500] }}>{
          <AssignmentIcon sx={{ color: 'white' }} />
        }</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />

            <TimeAgo dateString={notification.created_at} />
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {"Đơn hàng mới"}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {"đang chờ bạn xác nhận"}
      </Typography>
    </Typography>
  );

  // if (notification.type === 'order_placed') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  // if (notification.type === 'order_shipped') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  // if (notification.type === 'mail') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_mail.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  // if (notification.type === 'chat_message') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_chat.svg"
  //       />
  //     ),
  //     title,
  //   };
  // }
  return {
    // avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}

function TimeAgo({ dateString }) {
  const now = moment();
  const createdAt = moment(dateString, 'HH:mm:ss DD-MM-YYYY');
  const diff = now.diff(createdAt);

  if (diff < 60000) {
    return <span>{Math.floor(diff / 1000)} giây trước</span>;
  }
  if (diff < 3600000) {
    return <span>{Math.floor(diff / 60000)} phút trước</span>;
  }
  if (diff < 86400000) {
    return <span>{Math.floor(diff / 3600000)} giờ trước</span>;
  }
  if (diff < 2592000000) {
    return <span>{Math.floor(diff / 86400000)} ngày trước</span>;
  }
  if (diff < 31536000000) {
    return <span>{Math.floor(diff / 2592000000)} tháng trước</span>;
  }
  return <span>{Math.floor(diff / 31536000000)} năm trước</span>;
}
